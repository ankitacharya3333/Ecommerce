import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { ShoppingBag, ArrowLeft, Eye } from 'lucide-react';

export const metadata = { title: 'Order Management | Admin Console' };

export default async function AdminOrdersPage() {
  await requireAdmin();

  let orders: any[] = [];

  try {
    orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true, payments: true },
    });
  } catch (error) {
    console.error('Admin orders fetch failed:', error);
    throw error;
  }

  return (
    <div className="py-10 bg-zinc-50 min-h-screen">
      <Container>
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/admin" className="hover:text-zinc-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Admin Dashboard</span>
          </Link>
          <span>/</span>
          <span className="text-zinc-900 font-medium">Orders</span>
        </div>

        <div className="border-b border-zinc-200 pb-6 mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Order Fulfillment & Management ({orders.length})
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Inspect order histories, adjust processing states, and append carrier tracking codes.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-12 text-center text-xs text-zinc-400">
              No orders have been recorded in the database yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-600 font-semibold">
                    <th className="p-4">Reference</th>
                    <th className="p-4">Recipient</th>
                    <th className="p-4">Delivery Speed</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Payment</th>
                    <th className="p-4 text-right">Amount</th>
                    <th className="p-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {orders.map((o) => (
                    <tr key={o.id} className="hover:bg-zinc-50/50 transition-colors">
                      <td className="p-4 font-mono font-bold text-zinc-900">{o.orderNumber}</td>
                      <td className="p-4 text-zinc-700">{o.shippingName}</td>
                      <td className="p-4 text-zinc-500">{o.deliveryOption}</td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800">
                          {o.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`text-[11px] font-medium ${o.paymentStatus === 'PAID' ? 'text-emerald-700 font-semibold' : 'text-amber-700'
                          }`}>
                          {o.paymentStatus}
                        </span>
                      </td>
                      <td className="p-4 text-right font-semibold text-zinc-900">
                        {formatPrice(Number(o.total))}
                      </td>
                      <td className="p-4 text-center">
                        <Link
                          href={`/admin/orders/${o.id}`}
                          className="inline-flex items-center gap-1 text-xs text-zinc-700 hover:text-zinc-950 underline font-medium"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Inspect</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}
