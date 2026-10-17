import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { newsletterSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`newsletter-${ip}`, 5, 300);
    if (!rate.success) {
      return NextResponse.json(
        { error: 'Too many subscription requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = newsletterSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Please enter a valid email address with affirmative consent.',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, consent } = result.data;

    try {
      const existing = await prisma.newsletterSubscriber.findUnique({
        where: { email },
      });

      if (existing) {
        if (!existing.active) {
          await prisma.newsletterSubscriber.update({
            where: { email },
            data: { active: true },
          });
        }
        return NextResponse.json({
          success: true,
          message: 'You are already subscribed to the NOVA MARKET dispatches.',
          alreadySubscribed: true,
        });
      }

      await prisma.newsletterSubscriber.create({
        data: {
          email,
          consent,
          active: true,
          source: 'newsletter_form',
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Thank you for joining our community. Your subscription has been confirmed.',
      });
    } catch (dbErr: any) {
      console.error('Database error in newsletter subscription:', dbErr.message);
      return NextResponse.json(
        { error: 'Subscription service temporarily unavailable. Please verify database connection.' },
        { status: 503 }
      );
    }
  } catch (err: any) {
    console.error('Newsletter error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
