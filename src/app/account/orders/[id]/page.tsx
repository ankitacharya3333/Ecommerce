import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeft, Truck, Package, Clock, ShieldCheck, MapPin } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Order Details | NOVA MARKET' };
}

export default async function OrderDetailPage({ params }: OrderDetailPageProps) {
  const { id } = await params;
  const session = await getSession();

  if (!session) {
    redirect(`/login?callbackUrl=/account/orders/${id}`);
  }

  let order: any = null;
  try {
    order = await prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
      },
    });
  } catch {
    // Database offline
  }

  if (!order) {
    notFound();
  }

  // Strict resource ownership enforcement:
  // Non-admin users can ONLY view their own orders!
  const isOwner = order.userId === session.userId || order.guestEmail === session.email;
  const isAdmin = session.role === 'ADMIN';

  if (!isOwner && !isAdmin) {
    redirect('/account/orders');
  }

  return (
    <div className="py-12 sm:py-16">
      <Container className="max-w-4xl">
        <div className="flex items-center gap-2 text-xs text-zinc-500 mb-6">
          <Link href="/account/orders" className="hover:text-zinc-900 flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to orders</span>
          </Link>
          <span>/</span>
          <span className="font-mono text-zinc-900">{order.orderNumber}</span>
        </div>

        {/* Order Header Card */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-serif font-medium text-zinc-900 tracking-tight">
                Order #{order.orderNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-zinc-100 text-zinc-800 uppercase tracking-wider">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-zinc-500 mt-1">
              Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
            </p>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-xs text-zinc-500 block">Total Amount</span>
            <span className="text-2xl font-bold text-zinc-950">{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Items Table */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs">
              <h2 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                <Package className="w-4 h-4 text-zinc-700" />
                <span>Purchased Living Essentials</span>
              </h2>

              <div className="divide-y divide-zinc-100">
                {order.items.map((item: any) => (
                  <div key={item.id} className="py-4 flex items-center justify-between gap-4 text-xs">
                    <div className="flex items-center gap-3">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 rounded-lg object-cover border border-zinc-200 flex-shrink-0"
                        />
                      )}
                      <div>
                        <span className="font-semibold text-zinc-900 text-sm block">{item.name}</span>
                        <span className="text-zinc-500 text-[11px] block mt-0.5">
                          SKU: {item.sku}
                        </span>
                        {item.selectedVariants && (
                          <span className="text-zinc-400 text-[11px]">
                            {Object.entries(item.selectedVariants)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' • ')}
                          </span>
                        )}
                        <span className="text-zinc-700 text-xs block mt-1">
                          {item.quantity} × {formatPrice(Number(item.price))}
                        </span>
                      </div>
                    </div>

                    <span className="text-sm font-semibold text-zinc-950">
                      {formatPrice(Number(item.price) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Order financial totals breakdown */}
              <div className="mt-6 pt-4 border-t border-zinc-200 space-y-2 text-xs">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPrice(Number(order.subtotal))}</span>
                </div>
                {Number(order.discountTotal) > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount Applied ({order.couponCode || 'Promo'})</span>
                    <span>-{formatPrice(Number(order.discountTotal))}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600">
                  <span>Shipping & Delivery</span>
                  <span>{Number(order.shippingCost) === 0 ? 'Free' : formatPrice(Number(order.shippingCost))}</span>
                </div>
                <div className="flex justify-between font-bold text-sm text-zinc-950 pt-2 border-t border-zinc-100">
                  <span>Total</span>
                  <span>{formatPrice(Number(order.total))}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Shipping & Payment details */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4 text-zinc-700" />
                <span>Shipping Address</span>
              </h3>
              <p className="text-zinc-700 leading-relaxed">
                <strong>{order.shippingName}</strong><br />
                {order.shippingAddress1}<br />
                {order.shippingAddress2 && <>{order.shippingAddress2}<br /></>}
                {order.shippingCity}, {order.shippingState} {order.shippingZip}<br />
                {order.shippingCountry}
              </p>
              {order.shippingPhone && (
                <p className="text-zinc-500 pt-1">Phone: {order.shippingPhone}</p>
              )}
            </div>

            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-900 flex items-center gap-1.5 text-sm">
                <ShieldCheck className="w-4 h-4 text-zinc-700" />
                <span>Payment & Security</span>
              </h3>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Payment Status:</span>
                <span className="font-semibold text-zinc-900">{order.paymentStatus}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-100">
                <span className="text-zinc-500">Delivery Speed:</span>
                <span className="font-medium text-zinc-900">{order.deliveryOption}</span>
              </div>
              {order.trackingNumber && (
                <div className="py-2 bg-zinc-50 p-3 rounded-lg border border-zinc-200">
                  <span className="text-zinc-500 block text-[11px]">Carrier Tracking Code:</span>
                  <span className="font-mono font-bold text-zinc-900">{order.trackingNumber}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
