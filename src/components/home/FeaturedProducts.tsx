import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { SAMPLE_FEATURED_PRODUCTS } from '@/data/sample-data';
import { ProductCard } from '@/components/ui/ProductCard';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export function FeaturedProducts() {
  return (
    <section className="py-20 bg-white">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
                Curated Selection • Development Sample Data
              </p>
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Featured Essentials
            </h2>
          </div>
          <Link href="/products">
            <Button variant="outline" size="sm">
              <span>View Complete Catalog</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SAMPLE_FEATURED_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </Container>
    </section>
  );
}
