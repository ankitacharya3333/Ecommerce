import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { AccountClient } from '@/components/account/AccountClient';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Client Account | NOVA MARKET',
  description: 'Manage your profile, account security, and active inquiries.',
};

export default async function AccountPage() {
  const session = await getSession();

  if (!session) {
    redirect('/login?callbackUrl=/account');
  }

  let dbUser: any = null;
  try {
    dbUser = await prisma.user.findUnique({
      where: { id: session.userId },
      include: {
        inquiries: {
          orderBy: { createdAt: 'desc' },
          take: 5,
        },
      },
    });
  } catch (err: any) {
    console.error('[ACCOUNT PAGE] Database fetch failed:', err.message);
  }

  const userData = {
    id: session.userId,
    name: dbUser?.name || session.name,
    email: dbUser?.email || session.email,
    role: dbUser?.role || session.role,
    createdAt: dbUser?.createdAt ? dbUser.createdAt.toISOString() : new Date().toISOString(),
    inquiries: (dbUser?.inquiries || []).map((inq: any) => ({
      id: inq.id,
      subject: inq.subject,
      category: inq.category,
      createdAt: inq.createdAt.toISOString(),
      adminNotified: inq.adminNotified,
    })),
  };

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <AccountClient user={userData} />
      </Container>
    </div>
  );
}
