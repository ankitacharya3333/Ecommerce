'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useWishlistStore } from '@/lib/wishlist-store';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function WishlistPage() {
  const { items, removeItem, clearWishlist, getItemCount } = useWishlistStore();
  const { addItem } = useCartStore();
  const count = getItemCount();

  const handleMoveToCart = (item: (typeof items)[0]) => {
    addItem({
      id: `${item.productId}-default`,
      productId: item.productId,
      slug: item.slug,
      name: item.name,
      price: item.price,
      image: item.image,
      category: item.category,
      maxStock: 20,
    });
    removeItem(item.productId);
  };

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="border-b border-zinc-200 pb-6 mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
              Personal Collection
            </p>
            <h1 className="text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              Saved Wishlist ({count} {count === 1 ? 'item' : 'items'})
            </h1>
          </div>
          {count > 0 && (
            <button
              type="button"
              onClick={clearWishlist}
              className="text-xs text-zinc-500 hover:text-rose-600 underline"
            >
              Clear wishlist
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mx-auto mb-4">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-medium text-zinc-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-sm text-zinc-500 mb-8 leading-relaxed">
              Save items you love by tapping the heart icon on any product card or details page.
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Explore Products</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {items.map((item) => (
              <div
                key={item.productId}
                className="group flex flex-col bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-300"
              >
                <div className="relative aspect-square overflow-hidden bg-zinc-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white text-zinc-600 hover:text-rose-600 rounded-full shadow-xs transition-colors"
                    aria-label={`Remove ${item.name} from wishlist`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between gap-4">
                  <div>
                    <span className="text-xs text-zinc-500 uppercase tracking-wider">
                      {item.category}
                    </span>
                    <h3 className="font-medium text-sm text-zinc-900 mt-1 line-clamp-1 hover:underline">
                      <Link href={`/products/${item.slug}`}>{item.name}</Link>
                    </h3>
                    <div className="flex items-baseline gap-2 mt-2">
                      <span className="text-base font-semibold text-zinc-950">
                        {formatPrice(item.price)}
                      </span>
                      {item.originalPrice && (
                        <span className="text-xs text-zinc-400 line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-100 flex items-center gap-2">
                    <Button
                      onClick={() => handleMoveToCart(item)}
                      variant="primary"
                      size="sm"
                      className="flex-1"
                    >
                      <ShoppingBag className="w-3.5 h-3.5 mr-1.5" />
                      <span>Move to Cart</span>
                    </Button>
                    <Link href={`/products/${item.slug}`}>
                      <Button variant="outline" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
