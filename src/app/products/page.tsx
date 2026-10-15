import type { Metadata } from 'next';
import { SAMPLE_FEATURED_PRODUCTS, SAMPLE_CATEGORIES } from '@/data/sample-data';
import { ProductCard } from '@/components/ui/ProductCard';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Products | NOVA MARKET',
  description: 'Browse our full collection of timeless design objects and lifestyle essentials.',
};

export default function ProductsPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Header */}
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Catalog • Development Sample Data
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            All Products
          </h1>
          <p className="text-sm text-zinc-600 mt-2 max-w-2xl leading-relaxed">
            Every piece in our catalog is developed in close partnership with master crafts studios and certified ethical manufacturers.
          </p>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 mb-8">
          <span className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-zinc-950 text-white cursor-pointer">
            All Categories ({SAMPLE_FEATURED_PRODUCTS.length})
          </span>
          {SAMPLE_CATEGORIES.map((cat) => (
            <span
              key={cat.id}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors cursor-pointer"
            >
              {cat.name}
            </span>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </div>
  );
}
