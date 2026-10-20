import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import {
  Package,
  ShoppingBag,
  Users,
  DollarSign,
  TrendingUp,
  Inbox,
  Tag,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Admin Operations Dashboard | NOVA MARKET',
};

export default async function AdminDashboardPage() {
  const session = await requireAdmin();

  // Real database metrics aggregation
  let totalRevenue = 0;
  let orderCount = 0;
  let productCount = 0;
  let customerCount = 0;
  let inquiryCount = 0;
  let couponCount = 0;
  let recentOrders: any[] = [];
  let lowStockProducts: any[] = [];

  try {
    const [
      orders,
      products,
      users,
      inquiries,
      coupons,
    ] = await Promise.all([
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        include: { user: true, items: true },
        take: 6,
      }),
      prisma.product.findMany({
        orderBy: { stockCount: 'asc' },
        take: 5,
      }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.inquiry.count({ where: { adminNotified: 'PENDING' } }),
      prisma.coupon.count({ where: { active: true } }),
    ]);

    orderCount = await prisma.order.count();
    productCount = await prisma.product.count();
    customerCount = users;
    inquiryCount = inquiries;
    couponCount = coupons;
    recentOrders = orders;
    lowStockProducts = products.filter((p) => p.stockCount <= 10);

    const revenueResult = await prisma.order.aggregate({
      where: { paymentStatus: 'PAID' },
      _sum: { total: true },
    });
    totalRevenue = Number(revenueResult._sum.total || 0);
  } catch (err: any) {
    console.error('[ADMIN DASHBOARD] Database aggregation failed:', err.message);
    throw new Error('Failed to load administrative analytics from database.');
  }

  return (
    <div className="py-10 bg-zinc-50 min-h-screen">
      <Container>
        {/* Admin Navigation Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-zinc-200 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-zinc-950 text-white uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-zinc-500">Authenticated as {session.name} ({session.email})</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight mt-1">
              Store Operations & Governance
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/admin/orders"
              className="px-3 py-1.5 rounded-lg border border-zinc-300 bg-white text-xs font-semibold text-zinc-800 hover:bg-zinc-50"
            >
              Manage Orders
            </Link>
            <Link
              href="/admin/products"
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-xs font-semibold text-white hover:bg-zinc-800"
            >
              Inventory & Catalog
            </Link>
          </div>
        </div>

        {/* Real KPI Metrics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Settled Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-bold text-zinc-950">{formatPrice(totalRevenue)}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Verified via payment gateways</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Orders</span>
              <ShoppingBag className="w-4 h-4 text-zinc-800" />
            </div>
            <div className="text-2xl font-bold text-zinc-950">{orderCount}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Lifetime customer purchases</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Catalog SKUs</span>
              <Package className="w-4 h-4 text-zinc-800" />
            </div>
            <div className="text-2xl font-bold text-zinc-950">{productCount}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Active inventory objects</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between text-zinc-500 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">Registered Clients</span>
              <Users className="w-4 h-4 text-zinc-800" />
            </div>
            <div className="text-2xl font-bold text-zinc-950">{customerCount}</div>
            <p className="text-[11px] text-zinc-400 mt-1">Verified customer accounts</p>
          </div>
        </div>

        {/* Dashboard Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Orders Panel */}
          <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-2xl border border-zinc-200 shadow-xs">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-4">
              <h2 className="text-base font-semibold text-zinc-900 flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 text-zinc-700" />
                <span>Recent Customer Orders</span>
              </h2>
              <Link href="/admin/orders" className="text-xs text-zinc-600 hover:text-zinc-950 underline flex items-center gap-1">
                <span>View all orders</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <p className="text-xs text-zinc-400 py-8 text-center">
                No orders recorded in PostgreSQL yet. Complete a checkout test to observe real-time entries.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-100 text-zinc-500">
                      <th className="pb-3 font-semibold">Order</th>
                      <th className="pb-3 font-semibold">Customer</th>
                      <th className="pb-3 font-semibold">Status</th>
                      <th className="pb-3 font-semibold">Payment</th>
                      <th className="pb-3 font-semibold text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {recentOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-zinc-50/60 transition-colors">
                        <td className="py-3 font-mono font-bold text-zinc-900">
                          <Link href={`/admin/orders/${ord.id}`} className="hover:underline">
                            {ord.orderNumber}
                          </Link>
                        </td>
                        <td className="py-3 text-zinc-700">{ord.shippingName}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-zinc-100 text-zinc-800">
                            {ord.status}
                          </span>
                        </td>
                        <td className="py-3">
                          <span className={`text-[11px] font-medium ${
                            ord.paymentStatus === 'PAID' ? 'text-emerald-700 font-semibold' : 'text-amber-700'
                          }`}>
                            {ord.paymentStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold text-zinc-900">
                          {formatPrice(Number(ord.total))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Right Column: Inventory & Fast Actions */}
          <div className="space-y-6">
            {/* Inventory Alerts */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-4">
              <h2 className="text-sm font-semibold text-zinc-900 flex items-center justify-between">
                <span>Stock Watchlist</span>
                <span className="text-[10px] text-zinc-400 uppercase tracking-wider">Live Counts</span>
              </h2>

              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-zinc-400">All catalog stock levels are currently healthy.</p>
              ) : (
                <div className="divide-y divide-zinc-100 text-xs">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between">
                      <div className="truncate max-w-[170px]">
                        <span className="font-semibold text-zinc-900 block truncate">{p.name}</span>
                        <span className="text-[10px] text-zinc-400 font-mono">SKU: {p.sku}</span>
                      </div>
                      <span className={`font-mono font-bold px-2 py-0.5 rounded ${
                        p.stockCount <= 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {p.stockCount} left
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Operational Shortcuts */}
            <div className="bg-white p-6 rounded-2xl border border-zinc-200 shadow-xs space-y-3 text-xs">
              <h3 className="font-semibold text-zinc-900 text-sm">Administrative Modules</h3>
              <div className="space-y-2">
                <Link
                  href="/admin/products"
                  className="p-2.5 rounded-lg border border-zinc-200 hover:border-zinc-400 flex items-center justify-between transition-colors font-medium text-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-zinc-600" />
                    <span>Product Catalog & Stock Management</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>

                <Link
                  href="/admin/orders"
                  className="p-2.5 rounded-lg border border-zinc-200 hover:border-zinc-400 flex items-center justify-between transition-colors font-medium text-zinc-800"
                >
                  <span className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-zinc-600" />
                    <span>Order Fulfillment & Tracking Dispatch</span>
                  </span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-zinc-400" />
                </Link>

                <div className="p-3 bg-zinc-50 rounded-lg text-zinc-500 text-[11px] leading-relaxed">
                  <ShieldCheck className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                  All administrative mutations require verified server-side JWT session role verification.
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
