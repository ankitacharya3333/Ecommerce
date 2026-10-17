import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { SAMPLE_CATEGORIES, SAMPLE_PRODUCTS } from '../src/data/sample-data';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding NOVA MARKET database...');

  // 1. Seed Categories
  for (const cat of SAMPLE_CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {
        name: cat.name,
        description: cat.description,
        image: cat.image,
      },
      create: {
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: cat.image,
      },
    });
  }
  console.log(`✓ Seeded ${SAMPLE_CATEGORIES.length} categories.`);

  // 2. Seed Products
  for (const prod of SAMPLE_PRODUCTS) {
    const category = await prisma.category.findUnique({
      where: { slug: prod.categorySlug },
    });

    if (category) {
      await prisma.product.upsert({
        where: { slug: prod.slug },
        update: {
          name: prod.name,
          categoryId: category.id,
          price: prod.price,
          originalPrice: prod.originalPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviewCount,
          image: prod.image,
          images: prod.images,
          badge: prod.badge || null,
          description: prod.description,
          longDescription: prod.longDescription || null,
          inStock: prod.inStock,
          stockCount: prod.stockCount,
          sku: prod.sku,
          variants: (prod.variants as any) || null,
          specifications: (prod.specifications as any) || null,
        },
        create: {
          id: prod.id,
          name: prod.name,
          slug: prod.slug,
          categoryId: category.id,
          price: prod.price,
          originalPrice: prod.originalPrice || null,
          rating: prod.rating,
          reviewCount: prod.reviewCount,
          image: prod.image,
          images: prod.images,
          badge: prod.badge || null,
          description: prod.description,
          longDescription: prod.longDescription || null,
          inStock: prod.inStock,
          stockCount: prod.stockCount,
          sku: prod.sku,
          variants: (prod.variants as any) || null,
          specifications: (prod.specifications as any) || null,
        },
      });
    }
  }
  console.log(`✓ Seeded ${SAMPLE_PRODUCTS.length} products.`);

  // 3. Seed Demo Users (1 Customer, 1 Administrator)
  const customerPasswordHash = await bcrypt.hash('Customer123!', 10);
  const adminPasswordHash = await bcrypt.hash('Admin2026!Secure', 10);

  const demoCustomer = await prisma.user.upsert({
    where: { email: 'client@novamarket.design' },
    update: {},
    create: {
      name: 'Elena Rostova',
      email: 'client@novamarket.design',
      passwordHash: customerPasswordHash,
      role: 'CUSTOMER',
      emailVerified: new Date(),
    },
  });

  const demoAdmin = await prisma.user.upsert({
    where: { email: 'admin@novamarket.design' },
    update: {},
    create: {
      name: 'Studio Administrator',
      email: 'admin@novamarket.design',
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  console.log('✓ Seeded Demo Accounts:');
  console.log('  Customer: client@novamarket.design (Password: Customer123!)');
  console.log('  Admin:    admin@novamarket.design (Password: Admin2026!Secure)');

  console.log('Database seeding successfully completed.');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
