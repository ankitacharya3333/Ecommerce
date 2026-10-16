'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Eye, Heart, ShoppingBag } from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { isInWishlist, toggleItem } = useWishlistStore();
  const { addItem } = useCartStore();

  const isFavorited = isInWishlist(product.id);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      image: product.image,
      category: product.category,
      inStock: product.inStock,
      addedAt: new Date().toISOString(),
    });
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(
      {
        id: `${product.id}-default`,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: product.image,
        category: product.category,
        maxStock: product.stockCount || 10,
      },
      1
    );
  };

  return (
    <div className="group flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300">
      {/* Product Image Container */}
      <div className="relative aspect-square overflow-hidden bg-zinc-100">
        <Link href={`/products/${product.slug}`} className="block w-full h-full">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badge indicator */}
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 pointer-events-none">
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

        {/* Wishlist toggle button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-zinc-600 hover:text-rose-600 shadow-xs transition-colors"
          aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorited ? 'fill-rose-500 text-rose-500' : ''
            }`}
          />
        </button>

        {/* Quick action overlay buttons */}
        <div className="absolute inset-x-3 bottom-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            type="button"
            onClick={handleQuickAdd}
            className="flex-1 py-2 px-3 bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1.5 shadow-md cursor-pointer transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
          <Link
            href={`/products/${product.slug}`}
            className="py-2 px-3 bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-medium rounded-lg text-center flex items-center justify-center gap-1 shadow-md border border-zinc-200"
            aria-label={`View details for ${product.name}`}
          >
            <Eye className="w-3.5 h-3.5" />
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
            <Link href={`/products/${product.slug}`}>{product.name}</Link>
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
          <span className="text-[11px] text-emerald-700 font-medium">
            {product.inStock ? 'In stock' : 'Out of stock'}
          </span>
        </div>
      </div>
    </div>
  );
}
