import { describe, it, expect, afterAll } from 'vitest';
import crypto from 'crypto';
import { prisma } from '../src/lib/prisma';
import { hashPassword, verifyPassword } from '../src/lib/auth';

describe('NOVA MARKET - Password Reset & Admin Authorization Lifecycle', () => {
  const customerEmail = `reset_test_${Date.now()}@novamarket.design`;
  const adminTestEmail = `admin_test_${Date.now()}@novamarket.design`;
  let customerId: string;
  let adminId: string;

  afterAll(async () => {
    if (customerId) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: customerId } });
      await prisma.user.deleteMany({ where: { id: customerId } });
    }
    if (adminId) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: adminId } });
      await prisma.user.deleteMany({ where: { id: adminId } });
    }
    await prisma.$disconnect();
  });

  it('provisions a test customer and verifies initial password', async () => {
    const initialHash = await hashPassword('OldPassword123!');
    const user = await prisma.user.create({
      data: {
        name: 'Reset Testing Client',
        email: customerEmail,
        passwordHash: initialHash,
        role: 'CUSTOMER',
      },
    });

    expect(user.id).toBeDefined();
    customerId = user.id;

    expect(await verifyPassword('OldPassword123!', user.passwordHash!)).toBe(true);
    expect(await verifyPassword('NewPassword123!', user.passwordHash!)).toBe(false);
  });

  it('generates a secure reset token and verifies single-use atomic consumption', async () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    // Save token record
    const record = await prisma.passwordResetToken.create({
      data: {
        userId: customerId,
        tokenHash,
        expiresAt,
      },
    });
    expect(record.usedAt).toBeNull();

    // Verify lookup by token hash
    const found = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    expect(found).not.toBeNull();
    expect(found?.usedAt).toBeNull();
    expect(found?.expiresAt.getTime()).toBeGreaterThan(Date.now());

    // Execute atomic consumption with new password update
    const newPasswordHash = await hashPassword('BrandNewPass2026!');
    await prisma.$transaction(async (tx) => {
      const updatedToken = await tx.passwordResetToken.updateMany({
        where: {
          id: record.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      expect(updatedToken.count).toBe(1);

      await tx.user.update({
        where: { id: customerId },
        data: { passwordHash: newPasswordHash },
      });
    });

    // Check user's new password in PostgreSQL
    const updatedUser = await prisma.user.findUnique({ where: { id: customerId } });
    expect(await verifyPassword('BrandNewPass2026!', updatedUser!.passwordHash!)).toBe(true);
    expect(await verifyPassword('OldPassword123!', updatedUser!.passwordHash!)).toBe(false);

    // Verify token cannot be re-consumed (single-use enforcement)
    const replayed = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    expect(replayed?.usedAt).not.toBeNull();

    // Replay attempt fails atomic count check
    await expect(
      prisma.$transaction(async (tx) => {
        const attempt = await tx.passwordResetToken.updateMany({
          where: {
            id: record.id,
            usedAt: null,
          },
          data: { usedAt: new Date() },
        });
        if (attempt.count === 0) {
          throw new Error('TOKEN_ALREADY_USED');
        }
      })
    ).rejects.toThrow('TOKEN_ALREADY_USED');
  });

  it('rejects expired tokens and malformed hashes', async () => {
    const expiredRaw = crypto.randomBytes(32).toString('hex');
    const expiredHash = crypto.createHash('sha256').update(expiredRaw).digest('hex');
    const pastDate = new Date(Date.now() - 3600 * 1000); // 1 hour ago

    await prisma.passwordResetToken.create({
      data: {
        userId: customerId,
        tokenHash: expiredHash,
        expiresAt: pastDate,
      },
    });

    const foundExpired = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: expiredHash },
    });

    expect(foundExpired).not.toBeNull();
    expect(foundExpired!.expiresAt < new Date()).toBe(true);

    // Random non-existent token should return null
    const nonExistent = await prisma.passwordResetToken.findUnique({
      where: { tokenHash: 'non_existent_fake_hash' },
    });
    expect(nonExistent).toBeNull();
  });

  it('provisions an admin user and verifies role and password validation', async () => {
    const adminHash = await hashPassword('MasterAdmin2026!');
    const adminUser = await prisma.user.create({
      data: {
        name: 'Automated Operations Admin',
        email: adminTestEmail,
        passwordHash: adminHash,
        role: 'ADMIN',
      },
    });

    expect(adminUser.id).toBeDefined();
    expect(adminUser.role).toBe('ADMIN');
    adminId = adminUser.id;

    // Verify credentials authentication
    expect(await verifyPassword('MasterAdmin2026!', adminUser.passwordHash!)).toBe(true);
    expect(await verifyPassword('WrongAdminPassword', adminUser.passwordHash!)).toBe(false);

    // Verify role separation: Customer is NOT admin
    const normalCustomer = await prisma.user.findUnique({ where: { id: customerId } });
    expect(normalCustomer?.role).toBe('CUSTOMER');
    expect(normalCustomer?.role).not.toBe('ADMIN');
  });
});
