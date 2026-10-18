import { NextResponse } from 'next/server';
import { stripe } from '@/lib/payments';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      {
        error:
          'Stripe webhook listener is active, but STRIPE_WEBHOOK_SECRET is unconfigured in .env.',
      },
      { status: 400 }
    );
  }

  const signature = request.headers.get('stripe-signature');
  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header.' },
      { status: 400 }
    );
  }

  let event: any;
  try {
    const rawBody = await request.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err: any) {
    console.error('Webhook signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 }
    );
  }

  // Idempotent webhook event handling
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const orderId = session.client_reference_id || session.metadata?.orderId;

        if (orderId) {
          await prisma.$transaction([
            prisma.order.update({
              where: { id: orderId },
              data: {
                paymentStatus: 'PAID',
                status: 'PROCESSING',
              },
            }),
            prisma.payment.updateMany({
              where: { orderId },
              data: {
                status: 'PAID',
                transactionId: session.payment_intent as string,
                sessionId: session.id,
                rawResponse: session as any,
              },
            }),
          ]);
          console.log(`[STRIPE WEBHOOK] Order #${orderId} marked as PAID.`);
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const intent = event.data.object;
        const orderId = intent.metadata?.orderId;
        if (orderId) {
          await prisma.order.update({
            where: { id: orderId },
            data: { paymentStatus: 'FAILED' },
          });
        }
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (dbErr: any) {
    console.error('Database error in webhook handler:', dbErr.message);
    return NextResponse.json(
      { error: 'Internal processing error.' },
      { status: 500 }
    );
  }
}
