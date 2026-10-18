import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { orderStatusUpdateSchema } from '@/lib/validations';

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getSession();

  // Server-side authorization check: Admin only
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Forbidden: Admin role required.' }, { status: 403 });
  }

  const { id } = await params;
  const body = await request.json();
  const result = orderStatusUpdateSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: 'Invalid order update fields.', details: result.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { status, trackingNumber } = result.data;

  try {
    const existingOrder = await prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json({ error: 'Order not found.' }, { status: 404 });
    }

    // Inventory handling: If transitioning to CANCELLED from an active state, restock items!
    if (status === 'CANCELLED' && existingOrder.status !== 'CANCELLED') {
      await prisma.$transaction(async (tx) => {
        for (const item of existingOrder.items) {
          if (item.productId) {
            const updatedProduct = await tx.product.update({
              where: { id: item.productId },
              data: { stockCount: { increment: item.quantity } },
            });

            await tx.inventoryAuditLog.create({
              data: {
                productId: item.productId,
                orderId: existingOrder.id,
                type: 'CANCELLATION_RESTOCK',
                quantity: item.quantity,
                newStock: updatedProduct.stockCount,
                reason: `Order #${existingOrder.orderNumber} cancelled by admin; items restocked.`,
              },
            });
          }
        }

        await tx.order.update({
          where: { id },
          data: {
            status: 'CANCELLED',
            trackingNumber: trackingNumber || existingOrder.trackingNumber,
          },
        });
      });
    } else {
      await prisma.order.update({
        where: { id },
        data: {
          status,
          trackingNumber: trackingNumber || null,
        },
      });
    }

    return NextResponse.json({ success: true, message: 'Order updated successfully.' });
  } catch (err: any) {
    console.error('Admin order update error:', err);
    return NextResponse.json(
      { error: err.message || 'Failed to update order.' },
      { status: 500 }
    );
  }
}
