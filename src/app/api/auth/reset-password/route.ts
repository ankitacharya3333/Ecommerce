import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { resetPasswordSchema } from '@/lib/validations';
import { hashPassword } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`reset-pass-${ip}`, 5, 300);
    if (!rate.success) {
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${rate.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = resetPasswordSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { token, password } = result.data;
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const resetRecord = await prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!resetRecord || resetRecord.usedAt || resetRecord.expiresAt < new Date()) {
      return NextResponse.json(
        { error: 'Password reset link is invalid or has expired. Please request a new link.' },
        { status: 400 }
      );
    }

    const newPasswordHash = await hashPassword(password);

    // Atomically update password and consume token; prevents race condition concurrent consumption
    await prisma.$transaction(async (tx) => {
      const updatedToken = await tx.passwordResetToken.updateMany({
        where: {
          id: resetRecord.id,
          usedAt: null,
        },
        data: {
          usedAt: new Date(),
        },
      });

      if (updatedToken.count === 0) {
        throw new Error('TOKEN_ALREADY_USED');
      }

      await tx.user.update({
        where: { id: resetRecord.userId },
        data: { passwordHash: newPasswordHash },
      });
    });

    return NextResponse.json({
      success: true,
      message: 'Your password has been successfully reset. You may now log in.',
    });
  } catch (err: any) {
    if (err.message === 'TOKEN_ALREADY_USED') {
      return NextResponse.json(
        { error: 'Password reset link has already been used. Please request a new link.' },
        { status: 400 }
      );
    }
    console.error('Reset password error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
