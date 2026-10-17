import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { registerSchema } from '@/lib/validations';
import { hashPassword, setSessionCookie } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export async function POST(request: Request) {
  try {
    // 1. IP / Rate limiting (5 registrations per 15 minutes)
    const ip = request.headers.get('x-forwarded-for') || 'local';
    const rate = checkRateLimit(`register-${ip}`, 5, 900);
    if (!rate.success) {
      return NextResponse.json(
        { error: `Too many registration attempts. Please try again in ${rate.resetInSeconds} seconds.` },
        { status: 429 }
      );
    }

    // 2. Body parsing and Zod validation
    const body = await request.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: result.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { name, email, password } = result.data;

    // 3. Check for existing user
    let existingUser;
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      });
    } catch (dbErr: any) {
      console.error('Database connection error in register:', dbErr.message);
      return NextResponse.json(
        {
          error:
            'Database service is currently unreachable. Please verify your PostgreSQL connection in DATABASE_URL.',
        },
        { status: 503 }
      );
    }

    if (existingUser) {
      return NextResponse.json(
        {
          error: 'An account with this email address already exists. Please sign in instead.',
        },
        { status: 409 }
      );
    }

    // 4. Secure password hashing
    const passwordHash = await hashPassword(password);

    // 5. Create user in PostgreSQL
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: 'CUSTOMER',
      },
    });

    // 6. Set HTTP-only session cookie
    await setSessionCookie({
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name || 'Client',
      role: newUser.role,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err: any) {
    console.error('Registration error:', err);
    return NextResponse.json(
      { error: 'An unexpected internal error occurred during registration.' },
      { status: 500 }
    );
  }
}
