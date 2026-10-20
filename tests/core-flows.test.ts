import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import crypto from 'crypto';
import { prisma } from '../src/lib/prisma';
import {
  hashPassword,
  verifyPassword,
  createSessionToken,
  verifySessionToken,
} from '../src/lib/auth';

describe('NOVA MARKET - Core Security & Persistence Verification', () => {
  const testEmail = `test_customer_${Date.now()}@example.com`;
  let testUserId: string;

  afterAll(async () => {
    // Clean up test data
    if (testUserId) {
      await prisma.passwordResetToken.deleteMany({ where: { userId: testUserId } });
      await prisma.orderItem.deleteMany({
        where: { order: { userId: testUserId } },
      });
      await prisma.payment.deleteMany({
        where: { order: { userId: testUserId } },
      });
      await prisma.order.deleteMany({ where: { userId: testUserId } });
      await prisma.user.deleteMany({ where: { id: testUserId } });
    }
    await prisma.$disconnect();
  });

  it('correctly hashes passwords with bcrypt and verifies hashes', async () => {
    const raw = 'SecurePass123!@#';
    const hash = await hashPassword(raw);
    expect(hash).not.toBe(raw);
    expect(await verifyPassword(raw, hash)).toBe(true);
    expect(await verifyPassword('WrongPassword', hash)).toBe(false);
  });

  it('signs and verifies JWT sessions with role claims', async () => {
    const token = await createSessionToken({
      userId: 'usr_test_123',
      email: 'test@example.com',
      name: 'Test Customer',
      role: 'CUSTOMER',
    });

    const verified = await verifySessionToken(token);
    expect(verified).not.toBeNull();
    expect(verified?.userId).toBe('usr_test_123');
    expect(verified?.role).toBe('CUSTOMER');
  });

  it('persists a new customer user in PostgreSQL and enforces unique email', async () => {
    const pwdHash = await hashPassword('Password123!');
    const user = await prisma.user.create({
      data: {
        name: 'Automated Test Client',
        email: testEmail,
        passwordHash: pwdHash,
        role: 'CUSTOMER',
      },
    });

    expect(user.id).toBeDefined();
    expect(user.role).toBe('CUSTOMER');
    testUserId = user.id;

    // Duplicate registration should throw unique constraint violation
    await expect(
      prisma.user.create({
        data: {
          name: 'Duplicate Attempt',
          email: testEmail,
          passwordHash: pwdHash,
          role: 'CUSTOMER',
        },
      })
    ).rejects.toThrow();
  });

  it('generates, hashes, verifies, and single-use consumes password reset tokens', async () => {
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 3600 * 1000);

    const record = await prisma.passwordResetToken.create({
      data: {
        userId: testUserId,
        tokenHash,
        expiresAt,
      },
    });

    expect(record.id).toBeDefined();
    expect(record.usedAt).toBeNull();

    // Verify lookup by tokenHash
    const found = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    expect(found).not.toBeNull();
    expect(found?.usedAt).toBeNull();

    // Simulate consumption
    await prisma.passwordResetToken.update({
      where: { id: record.id },
      data: { usedAt: new Date() },
    });

    // Replay attempt should detect consumed token
    const consumed = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
    });
    expect(consumed?.usedAt).not.toBeNull();
  });

  it('persists customer orders and order items in PostgreSQL with ownership relation', async () => {
    const orderNumber = `TEST-${Date.now()}`;
    const idempotencyKey = `idem_${Date.now()}`;

    const sampleProduct = await prisma.product.findFirst();
    expect(sampleProduct).not.toBeNull();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        userId: testUserId,
        status: 'PENDING',
        paymentStatus: 'PENDING',
        subtotal: 100,
        discountTotal: 0,
        shippingCost: 8,
        total: 108,
        shippingName: 'Automated Test Client',
        shippingAddress1: '123 Market St',
        shippingCity: 'San Francisco',
        shippingState: 'CA',
        shippingZip: '94105',
        shippingCountry: 'United States',
        deliveryOption: 'STANDARD',
        idempotencyKey,
        items: {
          create: [
            {
              productId: sampleProduct!.id,
              name: sampleProduct!.name,
              sku: sampleProduct!.sku,
              price: sampleProduct!.price,
              quantity: 1,
              image: sampleProduct!.image,
            },
          ],
        },
      },
      include: {
        items: true,
      },
    });

    expect(order.id).toBeDefined();
    expect(order.items.length).toBe(1);
    expect(order.items[0].name).toBe(sampleProduct!.name);

    // Verify query by customer ID
    const customerOrders = await prisma.order.findMany({
      where: { userId: testUserId },
    });
    expect(customerOrders.length).toBeGreaterThanOrEqual(1);
    expect(customerOrders.some((o) => o.id === order.id)).toBe(true);
  });
});
