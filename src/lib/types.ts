export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface ProductVariant {
  id: string;
  name: string; // e.g., "Color", "Size", "Finish"
  options: string[]; // e.g., ["Smoked Oak", "Natural Ash", "Walnut"]
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  images: string[];
  badge?: 'New' | 'Bestseller' | 'Sale' | 'Featured';
  description: string;
  longDescription?: string;
  inStock: boolean;
  stockCount: number;
  sku: string;
  createdAt: string; // ISO date string for sorting newest
  variants?: ProductVariant[];
  specifications?: ProductSpecification[];
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: 'truck' | 'refresh-cw' | 'shield-check' | 'headphones';
}

// Cart types
export interface CartItem {
  id: string; // composite key: `${productId}-${selectedVariantString}`
  productId: string;
  slug: string;
  name: string;
  price: number;
  image: string;
  category: string;
  quantity: number;
  maxStock: number;
  selectedVariants?: Record<string, string>;
}

// Wishlist types
export interface WishlistItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  inStock: boolean;
  addedAt: string;
}
