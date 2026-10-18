import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

/**
 * Server-side Role-Based Authorization
 * Enforces that only authenticated users with ADMIN role can invoke the protected administrative handler.
 * Prevents unauthorized access even if front-end links are discovered.
 */
export async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/admin');
  }

  if (session.role !== 'ADMIN') {
    redirect('/account');
  }

  return session;
}
