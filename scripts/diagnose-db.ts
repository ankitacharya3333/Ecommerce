import { prisma } from '../src/lib/prisma';

async function check() {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, name: true, role: true },
  });
  console.log('USERS_IN_DB:', JSON.stringify(users));

  const prodCount = await prisma.product.count();
  console.log('PRODUCT_COUNT:', prodCount);

  const orderCount = await prisma.order.count();
  console.log('ORDER_COUNT:', orderCount);

  // Check _prisma_migrations table
  try {
    const migrations: any[] = await prisma.$queryRaw`SELECT * FROM _prisma_migrations;`;
    console.log('PRISMA_MIGRATIONS:', JSON.stringify(migrations));
  } catch (err: any) {
    console.log('MIGRATIONS_TABLE_ERROR:', err.message);
  }
}

check()
  .catch((err) => {
    console.error('CHECK_FAILED:', err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
