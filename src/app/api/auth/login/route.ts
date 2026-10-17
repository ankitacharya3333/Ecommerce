import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { loginSchema } from '@/lib/validations';
import { verifyPassword, setSessionCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // Rate limit: 5 attempts per 5 minutes per IP
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`login-${ip}`, 5, 300);
    if (!rate.success) {
      return NextResponse.json(
        { error: `Too many login attempts. Please wait ${rate.resetInSeconds} seconds before trying again.` },
        { status: 429 }
      );
    }

    const body = await request.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = result.data;

    let user;
    try {
      user = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr: any) {
      console.error('Database connection error in login:', dbErr.message);
      return NextResponse.json(
        {
          error:
            'Database service is currently unreachable. Please check DATABASE_URL.',
        },
        { status: 503 }
      );
    }

    if (!user || !user.passwordHash) {
      // Obfuscated error message to prevent account enumeration
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email address or password.' },
        { status: 401 }
      );
    }

    await setSessionCookie({
      userId: user.id,
      email: user.email,
      name: user.name || 'Client',
      role: user.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred.' },
      { status: 500 }
    );
  }
}
