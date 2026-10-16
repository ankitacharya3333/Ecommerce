import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from '@/data/sample-data';
import { Product, Category } from '@/lib/types';

export interface ProductFilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'rating';
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedProductsResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  limit: number;
}

/**
 * Data Access Layer for Products
 * Currently reads from clearly identified local sample dataset.
 * Designed to easily interface with Prisma/PostgreSQL in future development phases.
 */
export async function getProducts(
  params: ProductFilterParams = {}
): Promise<PaginatedProductsResult> {
  const {
    category,
    minPrice,
    maxPrice,
    sort = 'featured',
    search,
    page = 1,
    limit = 6,
  } = params;

  let filtered = [...SAMPLE_PRODUCTS];

  // 1. Search by name or description
  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  // 2. Category Filter
  if (category && category !== 'all') {
    filtered = filtered.filter(
      (p) => p.categorySlug.toLowerCase() === category.toLowerCase()
    );
  }

  // 3. Price Filter
  if (typeof minPrice === 'number' && !isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

  // 4. Sorting
  filtered.sort((a, b) => {
    switch (sort) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'rating':
        return b.rating - a.rating;
      case 'featured':
      default:
        // Featured order or preserve default list order
        return 0;
    }
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * limit;
  const paginatedProducts = filtered.slice(startIndex, startIndex + limit);

  return {
    products: paginatedProducts,
    total,
    page: validPage,
    totalPages,
    limit,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const product = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  return product || null;
}

export async function getRelatedProducts(
  currentProductSlug: string,
  categorySlug: string,
  limit: number = 3
): Promise<Product[]> {
  return SAMPLE_PRODUCTS.filter(
    (p) => p.slug !== currentProductSlug && p.categorySlug === categorySlug
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  return SAMPLE_CATEGORIES;
}
