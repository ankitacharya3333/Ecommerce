import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderNumber = searchParams.get('orderNumber');
    const email = searchParams.get('email');

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order reference number and email address are required.' },
        { status: 400 }
      );
    }

    const order = await prisma.order.findFirst({
      where: {
        orderNumber: orderNumber.trim(),
        OR: [
          { guestEmail: { equals: email.trim(), mode: 'insensitive' } },
          { user: { email: { equals: email.trim(), mode: 'insensitive' } } },
        ],
      },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        paymentStatus: true,
        total: true,
        shippingCity: true,
        shippingCountry: true,
        deliveryOption: true,
        trackingNumber: true,
        createdAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'No order was found matching the provided reference number and email address.' },
        { status: 404 }
      );
    }

    return NextResponse.json({ order });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to query order tracking.' },
      { status: 500 }
    );
  }
}
