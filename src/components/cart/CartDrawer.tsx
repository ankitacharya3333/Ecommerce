'use client';

import React from 'react';
import Link from 'next/link';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

export function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const shippingThreshold = 120;
  const progressToFreeShipping = Math.min(100, (subtotal / shippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, shippingThreshold - subtotal);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true" aria-label="Shopping Cart">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-zinc-950/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-zinc-200">
          {/* Header */}
          <div className="p-5 border-b border-zinc-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-zinc-800" />
              <h2 className="text-base font-semibold text-zinc-900">
                Shopping Cart ({itemCount})
              </h2>
            </div>
            <button
              type="button"
              onClick={closeCart}
              className="p-1.5 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-zinc-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free shipping progress bar */}
          <div className="px-5 py-3 bg-zinc-50 border-b border-zinc-200 text-xs">
            {subtotal >= shippingThreshold ? (
              <p className="text-emerald-700 font-medium">
                ✓ You have unlocked complimentary standard shipping!
              </p>
            ) : (
              <p className="text-zinc-600">
                Add <span className="font-semibold text-zinc-900">{formatPrice(remainingForFreeShipping)}</span> more for complimentary shipping.
              </p>
            )}
            <div className="w-full bg-zinc-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-zinc-900 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-zinc-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div className="w-16 h-16 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400 mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-zinc-900 mb-1">
                  Your cart is empty
                </h3>
                <p className="text-xs text-zinc-500 max-w-xs mb-6">
                  Discover our curated collection of living objects and essentials.
                </p>
                <Button
                  onClick={closeCart}
                  variant="primary"
                  size="md"
                >
                  <Link href="/products" className="inline-flex items-center gap-1.5">
                    <span>Browse Catalog</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  {/* Thumbnail */}
                  <Link
                    href={`/products/${item.slug}`}
                    onClick={closeCart}
                    className="relative w-20 h-20 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover object-center"
                    />
                  </Link>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${item.slug}`}
                          onClick={closeCart}
                          className="text-xs font-semibold text-zinc-900 hover:text-zinc-600 line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-zinc-400 hover:text-rose-600 transition-colors p-0.5"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Selected Variants */}
                      {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                        <div className="text-[11px] text-zinc-500 mt-0.5">
                          {Object.entries(item.selectedVariants)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(' • ')}
                        </div>
                      )}

                      <div className="text-xs font-medium text-zinc-900 mt-1">
                        {formatPrice(item.price)}
                      </div>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center border border-zinc-200 rounded-md bg-zinc-50">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-zinc-600 hover:text-zinc-950 transition-colors disabled:opacity-40"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="w-8 text-center text-xs font-semibold text-zinc-900">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          disabled={item.quantity >= item.maxStock}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-zinc-600 hover:text-zinc-950 transition-colors disabled:opacity-40"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs font-semibold text-zinc-950">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Subtotal & Checkout */}
          {items.length > 0 && (
            <div className="p-5 border-t border-zinc-200 bg-zinc-50 space-y-4">
              <div className="space-y-1.5 text-xs text-zinc-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-sm text-zinc-950">
                    {formatPrice(subtotal)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{subtotal >= shippingThreshold ? 'Free' : '$8.00'}</span>
                </div>
                <p className="text-[11px] text-zinc-400 pt-1">
                  Taxes and final postage calculated at checkout.
                </p>
              </div>

              <div className="space-y-2">
                <Link href="/checkout" onClick={closeCart} className="block w-full">
                  <Button variant="primary" size="md" className="w-full">
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </Link>
                <Link href="/cart" onClick={closeCart} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full">
                    View Full Cart Page
                  </Button>
                </Link>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-[11px] text-zinc-500 hover:text-rose-600 underline"
                >
                  Clear all items
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
