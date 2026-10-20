import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Package, ArrowLeft, ArrowRight, Clock, ShieldCheck } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export const metadata: Metadata = {
  title: 'My Orders | NOVA MARKET',
  description: 'View and track all your previous purchases and fulfillment statuses.',
};

export default async function CustomerOrdersPage() {
  const session = await getSession();
  if (!session) {
    redirect('/login?callbackUrl=/account/orders');
  }

  let orders: any[] = [];
  let dbError: string | null = null;
  try {
    orders = await prisma.order.findMany({
      where: {
        OR: [
          { userId: session.userId },
          { guestEmail: session.email },
        ],
      },
      include: {
        items: true,
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  } catch (err: any) {
    console.error('[ACCOUNT ORDERS] Database query failed:', err.message);
    dbError = 'Unable to load orders from database. Please try again shortly.';
  }

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/account" className="hover:text-zinc-900">
            Account
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">Orders</span>
        </div>

        <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
              Fulfillment History
            </p>
            <h1 className="text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Your Orders ({orders.length})
            </h1>
          </div>
          <Link href="/track-order" className="text-xs text-zinc-600 hover:text-zinc-950 underline flex items-center gap-1">
            <span>Track by reference number</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {dbError ? (
          <div className="py-12 text-center max-w-md mx-auto bg-rose-50 rounded-2xl border border-rose-200 p-8 shadow-xs">
            <h2 className="text-lg font-medium text-rose-900 mb-1">Database Unavailable</h2>
            <p className="text-xs text-rose-600 mb-6 leading-relaxed">
              {dbError}
            </p>
            <Link href="/account">
              <Button variant="outline" size="md">
                <span>Return to Account</span>
              </Button>
            </Link>
          </div>
        ) : orders.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto bg-white rounded-2xl border border-zinc-200 p-8 shadow-xs">
            <div className="w-14 h-14 rounded-full bg-zinc-100 flex items-center justify-center mx-auto text-zinc-400 mb-4">
              <Package className="w-7 h-7" />
            </div>
            <h2 className="text-lg font-medium text-zinc-900 mb-1">No orders found</h2>
            <p className="text-xs text-zinc-500 mb-6 leading-relaxed">
              When you purchase living essentials or workspace tools, their fulfillment history and tracking numbers will appear here.
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                <span>Explore Catalog</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => {
              const statusColor =
                order.status === 'DELIVERED'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : order.status === 'PROCESSING' || order.status === 'SHIPPED'
                  ? 'bg-blue-50 text-blue-800 border-blue-200'
                  : order.status === 'CANCELLED'
                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                  : 'bg-zinc-100 text-zinc-800 border-zinc-200';

              const paymentBadge =
                order.paymentStatus === 'PAID'
                  ? 'text-emerald-700 font-semibold'
                  : 'text-amber-700 font-medium';

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                >
                  {/* Order Card Header */}
                  <div className="p-5 bg-zinc-50 border-b border-zinc-200 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Order Reference</span>
                        <span className="font-mono font-bold text-zinc-900">{order.orderNumber}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Placed On</span>
                        <span className="text-zinc-900">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[11px]">Total</span>
                        <span className="font-semibold text-zinc-900">{formatPrice(Number(order.total))}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusColor}`}>
                        {order.status}
                      </span>
                      <Link href={`/account/orders/${order.id}`}>
                        <Button variant="outline" size="sm" className="text-xs">
                          <span>Order Details</span>
                        </Button>
                      </Link>
                    </div>
                  </div>

                  {/* Order Card Body / Items Preview */}
                  <div className="p-5 divide-y divide-zinc-100">
                    {order.items.map((item: any) => (
                      <div key={item.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 rounded object-cover border border-zinc-200 flex-shrink-0"
                            />
                          )}
                          <div>
                            <span className="font-semibold text-zinc-900 block">{item.name}</span>
                            <span className="text-zinc-500 text-[11px]">
                              Qty: {item.quantity} • Unit Price: {formatPrice(Number(item.price))}
                            </span>
                          </div>
                        </div>

                        <span className="font-medium text-zinc-900">
                          {formatPrice(Number(item.price) * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Card Footer */}
                  <div className="px-5 py-3 bg-zinc-50/50 border-t border-zinc-100 text-[11px] text-zinc-500 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
                      <span>Payment Status: <span className={paymentBadge}>{order.paymentStatus}</span></span>
                    </span>

                    {order.trackingNumber && (
                      <span className="font-mono text-zinc-700">
                        Tracking: {order.trackingNumber}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Container>
    </div>
  );
}
