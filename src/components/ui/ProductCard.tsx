import Link from 'next/link';
import { Star, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Badge indicator */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10">
            <Badge
              variant={
                product.badge === 'Sale'
                  ? 'accent'
                  : product.badge === 'New'
                  ? 'secondary'
                  : 'default'
              }
            >
              {product.badge}
            </Badge>
          </div>
        )}

        {/* Quick action button */}
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <Link
            href={`/products?item=${product.id}`}
            className="w-full py-2 px-3 bg-zinc-950/90 hover:bg-zinc-950 backdrop-blur-xs text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 shadow-md"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>View Details</span>
          </Link>
        </div>
      </div>

      {/* Product Content */}
      <div className="p-4 flex flex-col flex-1 justify-between gap-3">
        <div>
          <div className="flex items-center justify-between text-xs text-zinc-500 mb-1">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-zinc-700">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span className="font-medium text-[11px]">{product.rating}</span>
              <span className="text-zinc-400 text-[10px]">({product.reviewCount})</span>
            </div>
          </div>

          <h3 className="font-medium text-sm text-zinc-900 group-hover:text-zinc-700 transition-colors line-clamp-1">
            <Link href={`/products?item=${product.id}`}>{product.name}</Link>
          </h3>
          <p className="text-xs text-zinc-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-baseline justify-between pt-2 border-t border-zinc-100">
          <div className="flex items-baseline gap-2">
            <span className="text-base font-semibold text-zinc-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-zinc-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 font-medium">In stock</span>
        </div>
      </div>
    </div>
  );
}
