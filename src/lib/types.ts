export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  itemCount: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  image: string;
  badge?: 'New' | 'Bestseller' | 'Sale' | 'Featured';
  description: string;
  inStock: boolean;
}

export interface Benefit {
  id: string;
  title: string;
  description: string;
  icon: 'truck' | 'refresh-cw' | 'shield-check' | 'headphones';
}
