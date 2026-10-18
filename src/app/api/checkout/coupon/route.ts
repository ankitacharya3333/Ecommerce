import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { couponApplySchema } from '@/lib/validations';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const result = couponApplySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid coupon format', details: result.error.flatten().fieldErrors },
        { status: 400 }
      );
    }

    const { code, subtotal } = result.data;

    // Standard preset discounts if database not yet migrated with custom coupons
    if (code === 'WELCOME10') {
      const discount = Number((subtotal * 0.1).toFixed(2));
      return NextResponse.json({
        success: true,
        code: 'WELCOME10',
        type: 'PERCENTAGE',
        discount,
        message: '10% Welcome Discount applied!',
      });
    }

    if (code === 'NOVA25') {
      if (subtotal < 100) {
        return NextResponse.json(
          { error: 'NOVA25 requires a minimum order subtotal of $100.00' },
          { status: 400 }
        );
      }
      return NextResponse.json({
        success: true,
        code: 'NOVA25',
        type: 'FIXED_AMOUNT',
        discount: 25.0,
        message: '$25.00 Studio Voucher applied!',
      });
    }

    try {
      const coupon = await prisma.coupon.findUnique({
        where: { code },
      });

      if (!coupon || !coupon.active) {
        return NextResponse.json(
          { error: 'Coupon code is invalid or has expired.' },
          { status: 404 }
        );
      }

      if (coupon.expiresAt && coupon.expiresAt < new Date()) {
        return NextResponse.json(
          { error: 'This coupon has expired.' },
          { status: 400 }
        );
      }

      if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
        return NextResponse.json(
          { error: 'This coupon has reached its maximum redemption limit.' },
          { status: 400 }
        );
      }

      if (coupon.minSpend && subtotal < Number(coupon.minSpend)) {
        return NextResponse.json(
          { error: `This coupon requires a minimum spend of $${Number(coupon.minSpend).toFixed(2)}` },
          { status: 400 }
        );
      }

      let discount = 0;
      if (coupon.type === 'PERCENTAGE') {
        discount = (subtotal * Number(coupon.value)) / 100;
        if (coupon.maxDiscount && discount > Number(coupon.maxDiscount)) {
          discount = Number(coupon.maxDiscount);
        }
      } else {
        discount = Number(coupon.value);
      }

      discount = Math.min(discount, subtotal);
      discount = Number(discount.toFixed(2));

      return NextResponse.json({
        success: true,
        code: coupon.code,
        type: coupon.type,
        discount,
        message: `Coupon "${coupon.code}" applied successfully!`,
      });
    } catch {
      return NextResponse.json(
        { error: 'Invalid coupon code.' },
        { status: 404 }
      );
    }
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred verifying the coupon.' },
      { status: 500 }
    );
  }
}
