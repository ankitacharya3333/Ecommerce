import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { checkoutFormSchema } from '@/lib/validations';
import { getSession } from '@/lib/auth';
import { initiatePayment } from '@/lib/payments';
import { sendOrderConfirmationEmail, sendAdminNewOrderAlert } from '@/lib/email';
import { SAMPLE_PRODUCTS } from '@/data/sample-data';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = checkoutFormSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Please verify the submitted checkout information.',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const {
      email,
      firstName,
      lastName,
      address1,
      address2,
      city,
      state,
      postalCode,
      country,
      phone,
      deliveryOption,
      paymentMethod,
      couponCode,
      items,
      idempotencyKey,
    } = result.data;

    // Check for authenticated customer session
    const session = await getSession();
    if (!session) {
      return NextResponse.json(
        {
          error: 'You must be logged in to place an order.'
        },
        { status: 401 }
      );
    }

    // 1. Idempotency Check: Prevent duplicate order processing for identical checkout action
    try {
      const existingOrder = await prisma.order.findUnique({
        where: { idempotencyKey },
        include: { items: true, payments: true },
      });

      if (existingOrder) {
        return NextResponse.json({
          success: true,
          duplicatePrevented: true,
          orderId: existingOrder.id,
          orderNumber: existingOrder.orderNumber,
          redirectUrl: `/order-confirmation?orderId=${existingOrder.id}`,
        });
      }
    } catch {
      // Continue if table not yet migrated
    }

    // 2. Server-side product price revalidation and inventory check
    // We NEVER trust client-submitted prices. We revalidate against database or official dataset.
    const resolvedItems: Array<{
      productId: string;
      name: string;
      sku: string;
      price: number;
      quantity: number;
      image: string;
      selectedVariants?: Record<string, string>;
    }> = [];

    let calculatedSubtotal = 0;

    for (const item of items) {
      let product: any = null;
      try {
        product = await prisma.product.findUnique({
          where: { id: item.productId },
        });
      } catch {
        // Fallback
      }

      if (!product) {
        product = SAMPLE_PRODUCTS.find((p) => p.id === item.productId);
      }

      if (!product) {
        return NextResponse.json(
          { error: `Item with ID ${item.productId} is no longer available in our catalog.` },
          { status: 400 }
        );
      }

      // Check stock
      if (product.stockCount < item.quantity) {
        return NextResponse.json(
          {
            error: `Insufficient inventory for "${product.name}". Only ${product.stockCount} units remaining.`,
          },
          { status: 400 }
        );
      }

      const itemPrice = Number(product.price);
      calculatedSubtotal += itemPrice * item.quantity;

      resolvedItems.push({
        productId: product.id,
        name: product.name,
        sku: product.sku,
        price: itemPrice,
        quantity: item.quantity,
        image: product.image,
        selectedVariants: item.selectedVariants,
      });
    }

    // 3. Shipping Calculation
    let shippingCost = calculatedSubtotal >= 120 ? 0 : 8.0;
    if (deliveryOption === 'EXPRESS') {
      shippingCost += 18.0; // Express surcharge
    } else if (deliveryOption === 'CARBON_NEUTRAL') {
      shippingCost += 2.5; // Offset contribution
    }

    // 4. Coupon Calculation
    let discountTotal = 0;
    if (couponCode) {
      const upper = couponCode.toUpperCase();
      if (upper === 'WELCOME10') {
        discountTotal = Number((calculatedSubtotal * 0.1).toFixed(2));
      } else if (upper === 'NOVA25' && calculatedSubtotal >= 100) {
        discountTotal = 25.0;
      }
    }

    const calculatedTotal = Math.max(
      0,
      Number((calculatedSubtotal - discountTotal + shippingCost).toFixed(2))
    );

    // 5. Generate human-readable Order Number
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const orderNumber = `NVA-${new Date().getFullYear()}-${randomHex}`;

    // 6. Execute atomic database transaction (Order + Items + Stock decrement + Audit Log)
    let createdOrderId = `order_${randomHex}`;
    let dbSuccess = false;

    try {
      const order = await prisma.$transaction(async (tx) => {
        // a. Create Order
        const newOrder = await tx.order.create({
          data: {
            orderNumber,
            userId: session?.userId || null,
            guestEmail: email,
            status: 'PENDING',
            paymentStatus: 'PENDING',
            subtotal: calculatedSubtotal,
            discountTotal,
            shippingCost,
            total: calculatedTotal,
            couponCode: couponCode || null,
            shippingName: `${firstName} ${lastName}`.trim(),
            shippingAddress1: address1,
            shippingAddress2: address2 || null,
            shippingCity: city,
            shippingState: state,
            shippingZip: postalCode,
            shippingCountry: country,
            shippingPhone: phone,
            deliveryOption,
            idempotencyKey,
            items: {
              create: resolvedItems.map((i) => ({
                productId: i.productId,
                name: i.name,
                sku: i.sku,
                price: i.price,
                quantity: i.quantity,
                image: i.image,
                selectedVariants: i.selectedVariants ? (i.selectedVariants as any) : undefined,
              })),
            },
          },
        });

        // b. Atomically Decrement Inventory & Record Audit Log
        for (const item of resolvedItems) {
          const updatedProduct = await tx.product.update({
            where: { id: item.productId },
            data: {
              stockCount: { decrement: item.quantity },
            },
          });

          await tx.inventoryAuditLog.create({
            data: {
              productId: item.productId,
              orderId: newOrder.id,
              type: 'PURCHASE',
              quantity: -item.quantity,
              newStock: updatedProduct.stockCount,
              reason: `Customer purchase in order #${orderNumber}`,
            },
          });
        }

        // c. Create Initial Payment Record
        await tx.payment.create({
          data: {
            orderId: newOrder.id,
            provider: paymentMethod,
            status: 'PENDING',
            amount: calculatedTotal,
            currency: 'USD',
          },
        });

        return newOrder;
      });

      createdOrderId = order.id;
      dbSuccess = true;
    } catch (dbErr: any) {
      console.error('ORDER CREATION FAILED');
      console.error(dbErr);

      return NextResponse.json(
        {
          error: 'Order creation failed',
          details: dbErr.message,
        },
        { status: 500 }
      );
    }

    // 7. Initiate Payment Provider Boundary
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const paymentResult = await initiatePayment({
      orderId: createdOrderId,
      orderNumber,
      amount: calculatedTotal,
      customerEmail: email,
      provider: paymentMethod,
      returnUrl: `${appUrl}/order-confirmation`,
      cancelUrl: `${appUrl}/checkout`,
    });

    // 8. Dispatch notification dispatches
    await Promise.allSettled([
      sendOrderConfirmationEmail({
        orderNumber,
        customerEmail: email,
        customerName: `${firstName} ${lastName}`.trim(),
        total: calculatedTotal,
        items: resolvedItems,
        shippingAddress: `${address1}, ${city}, ${state} ${postalCode}, ${country}`,
      }),
      sendAdminNewOrderAlert({
        orderNumber,
        total: calculatedTotal,
        customerEmail: email,
        itemCount: resolvedItems.reduce((acc, i) => acc + i.quantity, 0),
      }),
    ]);

    return NextResponse.json({
      success: true,
      orderId: createdOrderId,
      orderNumber,
      dbRecorded: dbSuccess,
      payment: paymentResult,
      redirectUrl: paymentResult.redirectUrl || `/order-confirmation?orderId=${createdOrderId}&orderNumber=${orderNumber}`,
    });
  } catch (err: any) {
    console.error('Checkout processing error:', err);
    return NextResponse.json(
      { error: err.message || 'An internal error occurred during checkout processing.' },
      { status: 500 }
    );
  }
}
