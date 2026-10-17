import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { contactInquirySchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  sendInquiryNotificationToAdmin,
  sendCustomerInquiryConfirmation,
  ADMIN_EMAIL,
} from '@/lib/email';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    // 1. Abuse protection and rate limiting (3 inquiries per 10 minutes per IP)
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`inquiry-${ip}`, 3, 600);
    if (!rate.success) {
      return NextResponse.json(
        {
          error: `Rate limit exceeded. Please wait ${rate.resetInSeconds} seconds before sending another message.`,
        },
        { status: 429 }
      );
    }

    // 2. Server-side validation using Zod
    const body = await request.json();
    const result = contactInquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Please correct the highlighted fields in the form.',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, subject, category, orderNumber, message } = result.data;
    const session = await getSession();

    // 3. Save Inquiry to PostgreSQL database
    let savedInquiry;
    try {
      savedInquiry = await prisma.inquiry.create({
        data: {
          name,
          email,
          subject,
          category,
          orderNumber: orderNumber || null,
          message,
          userId: session?.userId || null,
          adminNotified: 'PENDING',
          customerNotified: 'PENDING',
        },
      });
    } catch (dbErr: any) {
      console.error('Database error saving inquiry:', dbErr.message);
      return NextResponse.json(
        {
          error:
            'Failed to record inquiry in the database. Please ensure your PostgreSQL connection is active.',
        },
        { status: 503 }
      );
    }

    // 4. Attempt to notify Administrator (rmnrr333@gmail.com)
    const adminNotificationResult = await sendInquiryNotificationToAdmin({
      inquiryId: savedInquiry.id,
      name,
      email,
      category,
      subject,
      orderNumber,
      message,
    });

    // 5. Attempt to send confirmation to Customer
    const customerNotificationResult = await sendCustomerInquiryConfirmation({
      name,
      email,
      subject,
    });

    // 6. Record exact email delivery statuses back into the database
    try {
      await prisma.inquiry.update({
        where: { id: savedInquiry.id },
        data: {
          adminNotified: adminNotificationResult.success ? 'SENT' : 'FAILED',
          customerNotified: customerNotificationResult.success ? 'SENT' : 'FAILED',
          adminErrorLog: adminNotificationResult.error || null,
        },
      });
    } catch (logErr) {
      console.error('Failed to update email log status in inquiry record:', logErr);
    }

    // 7. Transparent response distinguishing database recording from email transmission
    return NextResponse.json({
      success: true,
      inquiryId: savedInquiry.id,
      savedToDatabase: true,
      emailDelivery: {
        adminRecipient: ADMIN_EMAIL,
        adminDelivered: adminNotificationResult.success,
        customerDelivered: customerNotificationResult.success,
        providerConfigured: adminNotificationResult.providerConfigured,
        notice: !adminNotificationResult.providerConfigured
          ? 'Inquiry safely recorded in database. Note: RESEND_API_KEY is not yet configured in environment variables, so transactional email delivery was bypassed.'
          : adminNotificationResult.success
          ? 'Inquiry recorded and notification email successfully dispatched to administrator.'
          : `Inquiry recorded in database, but notification to administrator encountered an error: ${adminNotificationResult.error}`,
      },
    });
  } catch (err: any) {
    console.error('Contact inquiry error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred while processing your inquiry.' },
      { status: 500 }
    );
  }
}
