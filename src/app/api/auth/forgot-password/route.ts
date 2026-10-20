import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'local';
    const rate = checkRateLimit(`forgot-pass-${ip}`, 3, 300);

    if (!rate.success) {
      return NextResponse.json(
        {
          error: `Too many requests. Please try again in ${rate.resetInSeconds} seconds.`,
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = forgotPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      );
    }

    const email = result.data.email.trim().toLowerCase();

    const apiKey = process.env.RESEND_API_KEY;
    const fromEmail = process.env.RESEND_FROM_EMAIL;
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Require email configuration in every environment.
    if (!apiKey || !fromEmail || !appUrl) {
      console.error('[FORGOT PASSWORD] Missing email configuration:', {
        hasApiKey: Boolean(apiKey),
        hasFromEmail: Boolean(fromEmail),
        hasAppUrl: Boolean(appUrl),
      });

      return NextResponse.json(
        { error: 'Password reset service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    // Keep the response generic to protect account privacy.
    if (!user) {
      console.log('[FORGOT PASSWORD] No matching user found.');

      return NextResponse.json({
        success: true,
        message:
          'If an account exists with this email, a reset link will be sent.',
      });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    const baseUrl = (appUrl || 'http://localhost:3000').replace(/\/+$/, '');
    const resetUrl = `${baseUrl}/reset-password?token=${rawToken}`;
    const isDevelopment = process.env.NODE_ENV !== 'production';

    // In development mode, allow local testing without requiring Resend or a verified domain
    if (isDevelopment) {
      // If Resend is configured, we can attempt dispatch but do not fail if unverified/rejected
      if (apiKey && fromEmail) {
        try {
          const resend = new Resend(apiKey);
          await resend.emails.send({
            from: fromEmail,
            to: user.email,
            subject: 'Reset your NOVA MARKET password (Development)',
            text: `Reset your password using this link: ${resetUrl}`,
          });
        } catch (emailErr) {
          console.log('[FORGOT PASSWORD - DEV] Resend dispatch bypassed/unverified domain:', emailErr);
        }
      }

      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset link will be sent.',
        devToken: rawToken,
        devResetLink: resetUrl,
      });
    }

    // Production mode: Resend configuration is strictly required
    if (!apiKey || !fromEmail) {
      console.error('[FORGOT PASSWORD] Production missing Resend configuration:', {
        hasApiKey: Boolean(apiKey),
        hasFromEmail: Boolean(fromEmail),
      });

      return NextResponse.json(
        { error: 'Password reset service is temporarily unavailable.' },
        { status: 503 }
      );
    }

    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: user.email,
      subject: 'Reset your NOVA MARKET password',
      text: `Reset your password using this link: ${resetUrl}`,
    });

    if (error) {
      console.error('[FORGOT PASSWORD] Resend delivery error:', error);
      await prisma.passwordResetToken.deleteMany({
        where: { tokenHash },
      }).catch(() => {});

      return NextResponse.json(
        { error: 'Unable to send the reset email.' },
        { status: 503 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset link will be sent.',
    });
  } catch (err) {
    console.error('[FORGOT PASSWORD] Unexpected error:', err);

    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
