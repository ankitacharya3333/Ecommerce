'use client';

import React from 'react';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export default function CartPage() {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    getItemCount,
  } = useCartStore();

  const subtotal = getSubtotal();
  const itemCount = getItemCount();
  const shipping = subtotal >= 120 || subtotal === 0 ? 0 : 8;
  const estimatedTotal = subtotal + shipping;

  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="border-b border-zinc-200 pb-6 mb-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Shopping Bag
          </p>
          <h1 className="text-3xl font-serif font-medium text-zinc-900 tracking-tight">
            Your Cart ({itemCount} {itemCount === 1 ? 'item' : 'items'})
          </h1>
        </div>

        {items.length === 0 ? (
          <div className="py-16 text-center max-w-md mx-auto">
            <h2 className="text-xl font-medium text-zinc-900 mb-2">
              Your cart is currently empty
            </h2>
            <p className="text-sm text-zinc-500 mb-8">
              Looks like you haven't added any items to your bag yet. Explore our curated catalog of living and workspace objects.
            </p>
            <Link href="/products">
              <Button variant="primary" size="md">
                <ArrowLeft className="w-4 h-4 mr-2" />
                <span>Return to Catalog</span>
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Items Table */}
            <div className="lg:col-span-2 space-y-6">
              <div className="divide-y divide-zinc-200 border-y border-zinc-200">
                {items.map((item) => (
                  <div key={item.id} className="py-6 flex flex-col sm:flex-row gap-6">
                    <Link
                      href={`/products/${item.slug}`}
                      className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-100 rounded-lg overflow-hidden flex-shrink-0 border border-zinc-200"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover object-center"
                      />
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-xs text-zinc-500 uppercase tracking-wider">
                              {item.category}
                            </span>
                            <h3 className="text-base font-semibold text-zinc-900 mt-0.5">
                              <Link
                                href={`/products/${item.slug}`}
                                className="hover:underline"
                              >
                                {item.name}
                              </Link>
                            </h3>
                          </div>
                          <span className="text-base font-semibold text-zinc-950">
                            {formatPrice(item.price * item.quantity)}
                          </span>
                        </div>

                        {item.selectedVariants && Object.keys(item.selectedVariants).length > 0 && (
                          <div className="text-xs text-zinc-500 mt-1">
                            {Object.entries(item.selectedVariants)
                              .map(([k, v]) => `${k}: ${v}`)
                              .join(' | ')}
                          </div>
                        )}

                        <div className="text-xs text-zinc-500 mt-0.5">
                          Unit price: {formatPrice(item.price)}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 mt-2">
                        <div className="flex items-center border border-zinc-300 rounded-md bg-zinc-50">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="w-10 text-center text-xs font-semibold text-zinc-900">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={item.quantity >= item.maxStock}
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1.5 text-zinc-600 hover:text-zinc-950 transition-colors disabled:opacity-40"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="text-xs font-medium text-zinc-500 hover:text-rose-600 flex items-center gap-1 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-2">
                <Link
                  href="/products"
                  className="text-xs text-zinc-600 hover:text-zinc-950 inline-flex items-center gap-1 font-medium"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Continue shopping</span>
                </Link>
                <button
                  type="button"
                  onClick={clearCart}
                  className="text-xs text-zinc-500 hover:text-rose-600 underline"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-zinc-50 p-6 sm:p-8 rounded-xl border border-zinc-200 space-y-6">
              <h2 className="text-lg font-medium text-zinc-900">
                Order Summary
              </h2>

              <div className="space-y-3 text-sm border-b border-zinc-200 pb-4">
                <div className="flex justify-between text-zinc-600">
                  <span>Subtotal</span>
                  <span className="font-medium text-zinc-900">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Estimated Taxes</span>
                  <span className="text-zinc-400 text-xs">Calculated at checkout</span>
                </div>
              </div>

              <div className="flex justify-between items-baseline text-base font-semibold text-zinc-950">
                <span>Estimated Total</span>
                <span>{formatPrice(estimatedTotal)}</span>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 leading-relaxed">
                <strong className="block font-semibold mb-0.5">Development Notice:</strong>
                Cart calculation and client-side persistence are fully functional. Checkout logic & payments will be connected in future development days.
              </div>

              <Link href="/checkout" className="block w-full">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-zinc-500 pt-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>30-day money-back guarantee & secure guest storage</span>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
