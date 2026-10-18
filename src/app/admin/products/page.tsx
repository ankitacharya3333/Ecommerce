import { requireAdmin } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/utils';
import { Container } from '@/components/ui/Container';
import { SAMPLE_PRODUCTS } from '@/data/sample-data';
import Link from 'next/link';
import { Package, ArrowLeft, ArrowUpRight } from 'lucide-react';

export const metadata = { title: 'Product & Inventory Management | Admin Console' };

export default async function AdminProductsPage() {
  await requireAdmin();

  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      include: { category: true },
      orderBy: { stockCount: 'asc' },
    });
  } catch {
    // Database offline
  }

  if (products.length === 0) {
    products = SAMPLE_PRODUCTS.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sku: p.sku,
      price: p.price,
      stockCount: p.stockCount,
      category: { name: p.category },
      inStock: p.inStock,
    }));
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
          <span className="text-zinc-900 font-medium">Catalog & Inventory</span>
        </div>

        <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Product Catalog & Stock Controls ({products.length} Items)
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Live inventory levels, pricing safeguards, and SKU tracking.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-zinc-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-zinc-50/80 border-b border-zinc-200 text-zinc-600 font-semibold">
                  <th className="p-4">SKU</th>
                  <th className="p-4">Item Name</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Available Inventory</th>
                  <th className="p-4">Stock Status</th>
                  <th className="p-4 text-center">Storefront</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="p-4 font-mono text-zinc-500 font-medium">{p.sku}</td>
                    <td className="p-4 font-semibold text-zinc-900">{p.name}</td>
                    <td className="p-4 text-zinc-600">{p.category?.name || 'General'}</td>
                    <td className="p-4 font-semibold text-zinc-900">{formatPrice(Number(p.price))}</td>
                    <td className="p-4">
                      <span className={`font-mono font-bold px-2 py-0.5 rounded text-xs ${
                        p.stockCount <= 5 ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-zinc-100 text-zinc-800'
                      }`}>
                        {p.stockCount} units
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        p.stockCount > 0 ? 'bg-emerald-50 text-emerald-800' : 'bg-rose-50 text-rose-800'
                      }`}>
                        {p.stockCount > 0 ? 'In Stock' : 'Depleted'}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <Link
                        href={`/products/${p.slug}`}
                        target="_blank"
                        className="inline-flex items-center gap-1 text-xs text-zinc-600 hover:text-zinc-950 underline"
                      >
                        <span>View</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Container>
    </div>
  );
}
