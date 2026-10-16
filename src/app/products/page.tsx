import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getProducts, getCategories } from '@/lib/products';
import { ProductsClient } from '@/components/catalog/ProductsClient';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Catalog & Essentials | NOVA MARKET',
  description: 'Explore our complete collection of crafted objects, apparel, and workspace tools.',
};

interface ProductsPageProps {
  searchParams: Promise<{
    category?: string;
    sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    page?: string;
  }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const resolvedParams = await searchParams;

  const minPrice = resolvedParams.minPrice ? parseFloat(resolvedParams.minPrice) : undefined;
  const maxPrice = resolvedParams.maxPrice ? parseFloat(resolvedParams.maxPrice) : undefined;
  const page = resolvedParams.page ? parseInt(resolvedParams.page, 10) : 1;

  const [paginatedResult, categories] = await Promise.all([
    getProducts({
      category: resolvedParams.category,
      sort: resolvedParams.sort,
      search: resolvedParams.search,
      minPrice,
      maxPrice,
      page,
      limit: 6,
    }),
    getCategories(),
  ]);

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
              Curated Catalog • Development Sample Inventory
            </p>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            All Products
          </h1>
          <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
            Every piece in our catalog is developed in close partnership with master crafts studios and certified ethical manufacturers.
          </p>
        </div>

        {/* Catalog Client with Suspense boundary */}
        <Suspense
          fallback={
            <div className="py-20 text-center text-xs text-zinc-500">
              Loading curated goods...
            </div>
          }
        >
          <ProductsClient
            initialProducts={paginatedResult.products}
            categories={categories}
            total={paginatedResult.total}
            page={paginatedResult.page}
            totalPages={paginatedResult.totalPages}
          />
        </Suspense>
      </Container>
    </div>
  );
}
