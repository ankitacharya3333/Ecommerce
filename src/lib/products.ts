import { prisma } from '@/lib/prisma';
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
  source: 'database' | 'sample-fallback';
}

function mapPrismaProductToAppProduct(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: p.category ? p.category.name : 'General Goods',
    categorySlug: p.category ? p.category.slug : 'general',
    price: Number(p.price),
    originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
    rating: Number(p.rating),
    reviewCount: p.reviewCount,
    image: p.image,
    images: Array.isArray(p.images) ? p.images : [p.image],
    badge: (p.badge as any) || undefined,
    description: p.description,
    longDescription: p.longDescription || undefined,
    inStock: p.inStock,
    stockCount: p.stockCount,
    sku: p.sku,
    createdAt: p.createdAt ? p.createdAt.toISOString() : new Date().toISOString(),
    variants: (p.variants as any) || undefined,
    specifications: (p.specifications as any) || undefined,
  };
}

/**
 * Data Access Layer for Products
 * Queries PostgreSQL via Prisma. If the database is not yet provisioned,
 * cleanly falls back to the identified local sample dataset so UI never breaks.
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

  try {
    const where: any = {};

    if (search && search.trim() !== '') {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (category && category !== 'all') {
      where.category = { slug: category };
    }

    if (typeof minPrice === 'number' && !isNaN(minPrice)) {
      where.price = { ...(where.price || {}), gte: minPrice };
    }

    if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
      where.price = { ...(where.price || {}), lte: maxPrice };
    }

    const orderBy: any = {};
    if (sort === 'price-asc') orderBy.price = 'asc';
    else if (sort === 'price-desc') orderBy.price = 'desc';
    else if (sort === 'newest') orderBy.createdAt = 'desc';
    else if (sort === 'rating') orderBy.rating = 'desc';
    else orderBy.createdAt = 'desc';

    const [total, dbProducts] = await Promise.all([
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        include: { category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    if (total > 0) {
      return {
        products: dbProducts.map(mapPrismaProductToAppProduct),
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
        limit,
        source: 'database',
      };
    }
  } catch (err) {
    // Database unreachable or empty table — gracefully fall back to local sample dataset
  }

  // Local sample fallback
  let filtered = [...SAMPLE_PRODUCTS];

  if (search && search.trim() !== '') {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }

  if (category && category !== 'all') {
    filtered = filtered.filter(
      (p) => p.categorySlug.toLowerCase() === category.toLowerCase()
    );
  }

  if (typeof minPrice === 'number' && !isNaN(minPrice)) {
    filtered = filtered.filter((p) => p.price >= minPrice);
  }
  if (typeof maxPrice === 'number' && !isNaN(maxPrice)) {
    filtered = filtered.filter((p) => p.price <= maxPrice);
  }

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
        return 0;
    }
  });

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const validPage = Math.max(1, Math.min(page, totalPages));
  const startIndex = (validPage - 1) * limit;

  return {
    products: filtered.slice(startIndex, startIndex + limit),
    total,
    page: validPage,
    totalPages,
    limit,
    source: 'sample-fallback',
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const p = await prisma.product.findUnique({
      where: { slug },
      include: { category: true },
    });
    if (p) return mapPrismaProductToAppProduct(p);
  } catch {
    // Database offline
  }

  const fallback = SAMPLE_PRODUCTS.find((p) => p.slug === slug);
  return fallback || null;
}

export async function getRelatedProducts(
  currentProductSlug: string,
  categorySlug: string,
  limit: number = 3
): Promise<Product[]> {
  try {
    const list = await prisma.product.findMany({
      where: {
        slug: { not: currentProductSlug },
        category: { slug: categorySlug },
      },
      include: { category: true },
      take: limit,
    });
    if (list.length > 0) return list.map(mapPrismaProductToAppProduct);
  } catch {
    // Database offline
  }

  return SAMPLE_PRODUCTS.filter(
    (p) => p.slug !== currentProductSlug && p.categorySlug === categorySlug
  ).slice(0, limit);
}

export async function getCategories(): Promise<Category[]> {
  try {
    const list = await prisma.category.findMany({
      include: { _count: { select: { products: true } } },
    });
    if (list.length > 0) {
      return list.map((c) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        image: c.image || '',
        itemCount: c._count.products,
      }));
    }
  } catch {
    // Database offline
  }

  return SAMPLE_CATEGORIES;
}
