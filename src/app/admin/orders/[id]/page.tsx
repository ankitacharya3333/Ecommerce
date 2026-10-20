import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Package, MapPin, ShieldCheck } from 'lucide-react';
import { AdminOrderStatusClient } from '@/components/admin/AdminOrderStatusClient';

interface AdminOrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export const metadata = { title: 'Order Details | Admin Console' };

export default async function AdminOrderDetailPage({ params }: AdminOrderDetailPageProps) {
  await requireAdmin();
  const { id } = await params;

  let order: any = null;
  let dbFailure = false;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        inventoryLogs: true,
      },
    });
  } catch (err: any) {
    console.error('[ADMIN ORDER DETAIL] Database query failed:', err.message);
    dbFailure = true;
  }

  if (dbFailure) {
    throw new Error('Database service is currently unreachable. Please verify database connectivity.');
  }

  if (!order) {
    notFound();
  }

  return (
    <div className="py-10 bg-zinc-50 min-h-screen">
      <Container className="max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/admin/orders" className="hover:text-zinc-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Orders List</span>
          </Link>
          <span>/</span>
          <span className="font-mono text-zinc-900">{order.orderNumber}</span>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-serif font-medium text-zinc-900">
              Admin Inspection • #{order.orderNumber}
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Customer: {order.shippingName} ({order.guestEmail || 'Registered User'})
            </p>
          </div>
          <span className="text-2xl font-bold text-zinc-950">{formatPrice(Number(order.total))}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            {/* Status Modification Form Client Component */}
            <AdminOrderStatusClient
              orderId={order.id}
              initialStatus={order.status}
              initialTracking={order.trackingNumber || ''}
            />

            {/* Items Table */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
              <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-700" />
                <span>Order Items</span>
              </h2>
              <div className="divide-y divide-zinc-100 text-xs">
                {order.items.map((i: any) => (
                  <div key={i.id} className="py-3 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-zinc-900 block">{i.name}</span>
                      <span className="text-[11px] text-zinc-400 font-mono">SKU: {i.sku}</span>
                    </div>
                    <span>{i.quantity} × {formatPrice(Number(i.price))}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs text-xs space-y-2">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-zinc-700" />
                <span>Shipping Address</span>
              </h3>
              <p className="text-zinc-600 leading-relaxed">
                {order.shippingName}<br />
                {order.shippingAddress1}<br />
                {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                {order.shippingCountry}
              </p>
              {order.shippingPhone && <p className="text-zinc-500">Phone: {order.shippingPhone}</p>}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs text-xs space-y-2">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
                <span>Payment Provider Data</span>
              </h3>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Status:</span>
                <span className="font-semibold text-zinc-900">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Speed:</span>
                <span className="font-medium text-zinc-900">{order.deliveryOption}</span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
