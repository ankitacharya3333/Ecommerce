'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ShoppingBag,
  Plus,
  Minus,
  Check,
} from 'lucide-react';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { ProductCard } from '@/components/ui/ProductCard';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';

interface ProductDetailsClientProps {
  product: Product;
  relatedProducts: Product[];
}

export function ProductDetailsClient({
  product,
  relatedProducts,
}: ProductDetailsClientProps) {
  const [selectedImage, setSelectedImage] = useState(
    product.images?.[0] || product.image
  );
  const [quantity, setQuantity] = useState(1);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(
    () => {
      const initial: Record<string, string> = {};
      product.variants?.forEach((v) => {
        if (v.options.length > 0) {
          initial[v.name] = v.options[0];
        }
      });
      return initial;
    }
  );
  const [addedNotice, setAddedNotice] = useState(false);

  const { addItem } = useCartStore();
  const { isInWishlist, toggleItem } = useWishlistStore();

  const isFavorited = isInWishlist(product.id);

  const handleVariantSelect = (variantName: string, optionValue: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: optionValue,
    }));
  };

  const handleAddToCart = () => {
    // Generate unique composite item ID based on chosen variant options
    const variantSuffix = Object.entries(selectedVariants)
      .map(([k, v]) => `${k}:${v}`)
      .join('-');
    const cartItemId = variantSuffix
      ? `${product.id}-${variantSuffix}`
      : `${product.id}-default`;

    addItem(
      {
        id: cartItemId,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: selectedImage,
        category: product.category,
        maxStock: product.stockCount,
        selectedVariants,
      },
      quantity
    );

    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleToggleWishlist = () => {
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

  return (
    <div className="space-y-16 sm:space-y-24">
      {/* Product Hero Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
        {/* Left Column: Image Gallery */}
        <div className="space-y-4">
          {/* Main Large Display Image */}
          <div className="relative aspect-square rounded-2xl bg-zinc-100 overflow-hidden border border-zinc-200">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-cover object-center transition-all duration-300"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge variant={product.badge === 'Sale' ? 'accent' : 'default'}>
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Thumbnails Row */}
          {product.images && product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(imgUrl)}
                  className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImage === imgUrl
                      ? 'border-zinc-950 ring-2 ring-zinc-950/20'
                      : 'border-zinc-200 hover:border-zinc-400 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={`View photo ${idx + 1} of ${product.name}`}
                >
                  <img
                    src={imgUrl}
                    alt={`${product.name} view ${idx + 1}`}
                    className="w-full h-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Product Purchasing & Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between text-xs text-zinc-500 mb-2">
              <Link
                href={`/products?category=${product.categorySlug}`}
                className="hover:text-zinc-900 transition-colors uppercase tracking-wider font-medium"
              >
                {product.category}
              </Link>
              <span className="text-[11px] text-zinc-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-serif font-medium text-zinc-900 tracking-tight">
              {product.name}
            </h1>

            {/* Ratings summary */}
            <div className="flex items-center gap-2 mt-2">
              <div className="flex items-center text-amber-500">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span className="text-xs font-semibold text-zinc-900 ml-1">
                  {product.rating}
                </span>
              </div>
              <span className="text-zinc-300">•</span>
              <span className="text-xs text-zinc-500">
                {product.reviewCount} verified client reviews
              </span>
            </div>
          </div>

          {/* Price display */}
          <div className="flex items-baseline gap-3 pb-4 border-b border-zinc-200">
            <span className="text-3xl font-semibold text-zinc-950">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-base text-zinc-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
            {product.originalPrice && (
              <Badge variant="accent">
                Save {formatPrice(product.originalPrice - product.price)}
              </Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-zinc-600 text-sm leading-relaxed">
            {product.longDescription || product.description}
          </p>

          {/* Variants Selectors */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              {product.variants.map((variant) => (
                <div key={variant.id} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-900">{variant.name}:</span>
                    <span className="text-zinc-600">
                      {selectedVariants[variant.name]}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {variant.options.map((option) => {
                      const isSelected = selectedVariants[variant.name] === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => handleVariantSelect(variant.name, option)}
                          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-all ${
                            isSelected
                              ? 'bg-zinc-900 text-white border-zinc-900 shadow-xs'
                              : 'bg-white text-zinc-700 border-zinc-300 hover:border-zinc-400'
                          }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Stock status */}
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                product.inStock ? 'bg-emerald-500' : 'bg-rose-500'
              }`}
            />
            {product.inStock ? (
              <span className="text-zinc-700">
                In stock • <span className="font-medium text-emerald-700">{product.stockCount} units remaining</span>
              </span>
            ) : (
              <span className="text-rose-600 font-medium">Currently unavailable</span>
            )}
          </div>

          {/* Quantity and Actions */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center border border-zinc-300 rounded-lg bg-zinc-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1 || !product.inStock}
                  className="p-1.5 text-zinc-600 hover:text-zinc-950 disabled:opacity-30 transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-10 text-center text-sm font-semibold text-zinc-900">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stockCount, q + 1))}
                  disabled={quantity >= product.stockCount || !product.inStock}
                  className="p-1.5 text-zinc-600 hover:text-zinc-950 disabled:opacity-30 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Cart Button */}
              <Button
                type="button"
                variant="primary"
                size="lg"
                disabled={!product.inStock}
                onClick={handleAddToCart}
                className="flex-1"
              >
                <ShoppingBag className="w-4 h-4 mr-2" />
                <span>{product.inStock ? 'Add to Shopping Bag' : 'Sold Out'}</span>
              </Button>

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={handleToggleWishlist}
                className={`p-3 rounded-lg border transition-colors ${
                  isFavorited
                    ? 'bg-rose-50 border-rose-300 text-rose-600'
                    : 'bg-white border-zinc-300 text-zinc-600 hover:border-zinc-400 hover:text-rose-600'
                }`}
                aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
              >
                <Heart
                  className={`w-5 h-5 ${isFavorited ? 'fill-rose-500 text-rose-500' : ''}`}
                />
              </button>
            </div>

            {/* Added confirmation toast/notice */}
            {addedNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Added {quantity} × "{product.name}" to your bag.</span>
                </div>
                <Link href="/cart" className="font-semibold underline hover:text-emerald-950">
                  View bag
                </Link>
              </div>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-zinc-200 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-zinc-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-zinc-800" />
              <span>Free shipping over $120</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-zinc-800" />
              <span>30-day trial returns</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-zinc-800" />
              <span>2-year studio warranty</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications Table */}
      {product.specifications && product.specifications.length > 0 && (
        <div className="pt-12 border-t border-zinc-200">
          <h2 className="text-xl font-serif font-medium text-zinc-900 mb-6">
            Technical Specifications & Craftsmanship
          </h2>
          <div className="bg-zinc-50 rounded-xl border border-zinc-200 divide-y divide-zinc-200 max-w-3xl">
            {product.specifications.map((spec, i) => (
              <div key={i} className="grid grid-cols-1 sm:grid-cols-3 p-4 text-xs">
                <span className="font-semibold text-zinc-900">{spec.label}</span>
                <span className="sm:col-span-2 text-zinc-600 mt-1 sm:mt-0">
                  {spec.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="pt-12 border-t border-zinc-200">
          <div className="flex items-baseline justify-between mb-8">
            <h2 className="text-xl sm:text-2xl font-serif font-medium text-zinc-900">
              Complementary Objects
            </h2>
            <Link
              href={`/products?category=${product.categorySlug}`}
              className="text-xs font-semibold text-zinc-700 hover:text-zinc-950 underline"
            >
              More in {product.category}
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
