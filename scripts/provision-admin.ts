import { prisma } from '../src/lib/prisma';
import bcrypt from 'bcryptjs';

async function provisionAdmin() {
  const email = process.env.INITIAL_ADMIN_EMAIL || 'admin@novamarket.design';
  const rawPassword = process.env.INITIAL_ADMIN_PASSWORD || 'Admin2026!Secure';
  const name = process.env.INITIAL_ADMIN_NAME || 'Studio Administrator';

  if (!email || !rawPassword) {
    console.error('[PROVISION] Error: Admin email or password not specified.');
    process.exit(1);
  }

  // Safely display target database host without exposing credentials
  const dbUrl = process.env.DATABASE_URL || '';
  try {
    const parsed = new URL(dbUrl);
    console.log(`[PROVISION] Target Database Host: ${parsed.host} | DB: ${parsed.pathname.replace(/^\//, '')}`);
  } catch {
    console.log('[PROVISION] Target Database: Configured via DATABASE_URL');
  }

  console.log(`[PROVISION] Checking administrator account: ${email}`);

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  const salt = await bcrypt.genSalt(12);
  const passwordHash = await bcrypt.hash(rawPassword, salt);

  const shouldUpdatePassword = process.env.UPDATE_ADMIN_PASSWORD === 'true';

  if (existingUser) {
    const updateData: { role: 'ADMIN'; passwordHash?: string } = {
      role: 'ADMIN',
    };

    if (shouldUpdatePassword) {
      updateData.passwordHash = passwordHash;
      console.log(`[PROVISION] UPDATE_ADMIN_PASSWORD is set to true. Updating administrator password...`);
    }

    await prisma.user.update({
      where: { id: existingUser.id },
      data: updateData,
    });

    console.log(`[PROVISION] User ${email} verified as ADMIN.`);
    if (shouldUpdatePassword) {
      console.log(`[PROVISION] Password for ${email} has been updated.`);
    } else {
      console.log(`[PROVISION] Existing password preserved. (Set UPDATE_ADMIN_PASSWORD=true to reset it).`);
    }
  } else {
    console.log(`[PROVISION] Creating new administrator user...`);
    const newAdmin = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'ADMIN',
        emailVerified: new Date(),
      },
    });
    console.log(`[PROVISION] Successfully created administrator user (ID: ${newAdmin.id}) with role ADMIN.`);
  }
}

provisionAdmin()
  .catch((err) => {
    console.error('[PROVISION] Unexpected failure:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
