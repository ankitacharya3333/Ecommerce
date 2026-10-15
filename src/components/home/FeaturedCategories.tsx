import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { SAMPLE_CATEGORIES } from '@/data/sample-data';
import { Container } from '@/components/ui/Container';

export function FeaturedCategories() {
  return (
    <section className="py-20 bg-zinc-50 border-b border-zinc-200">
      <Container>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
          <div>
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold mb-2">
              Curated Spaces
            </p>
            <h2 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/products"
            className="group inline-flex items-center text-sm font-medium text-zinc-900 hover:text-zinc-600 transition-colors"
          >
            <span>View all departments</span>
            <ArrowUpRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_CATEGORIES.map((category) => (
            <Link
              key={category.id}
              href={`/products?category=${category.slug}`}
              className="group flex flex-col overflow-hidden rounded-xl bg-white border border-zinc-200 shadow-xs hover:shadow-md transition-all duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-4/3 overflow-hidden bg-zinc-100">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-zinc-950/70 backdrop-blur-xs text-white text-[11px] font-medium rounded">
                  {category.itemCount} items
                </span>
              </div>
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-zinc-900 group-hover:text-zinc-600 transition-colors">
                    {category.name}
                  </h3>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
