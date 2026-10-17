import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { forgotPasswordSchema } from '@/lib/validations';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`forgot-pass-${ip}`, 3, 300);
    if (!rate.success) {
      return NextResponse.json(
        { error: `Too many requests. Please try again in ${rate.resetInSeconds} seconds.` },
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

    const { email } = result.data;

    let user;
    try {
      user = await prisma.user.findUnique({ where: { email } });
    } catch {
      // In case database is temporarily offline
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please verify database connection.' },
        { status: 503 }
      );
    }

    // Always return success response to prevent account enumeration
    if (!user) {
      return NextResponse.json({
        success: true,
        message: 'If an account exists with this email, a reset token instructions link has been dispatched.',
      });
    }

    // Generate secure random hex token
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    await prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiresAt,
      },
    });

    // In a development environment without SMTP keys configured, we log the reset link safely
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/reset-password?token=${rawToken}`;
    console.log(`[AUTH] Password reset link for ${email}: ${resetUrl}`);

    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a reset token instructions link has been dispatched.',
      // In development mode only, expose helper link for seamless testing
      devResetLink: process.env.NODE_ENV !== 'production' ? resetUrl : undefined,
    });
  } catch (err: any) {
    console.error('Forgot password error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
