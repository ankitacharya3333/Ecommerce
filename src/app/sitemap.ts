import { MetadataRoute } from 'next';
import { SAMPLE_PRODUCTS, SAMPLE_CATEGORIES } from '@/data/sample-data';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://novamarket.design';
  const currentDate = new Date().toISOString();

  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/products',
    '/about',
    '/contact',
    '/faq',
    '/shipping-returns',
    '/privacy-policy',
    '/terms',
    '/track-order',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Dynamic products routes
  const productRoutes: MetadataRoute.Sitemap = SAMPLE_PRODUCTS.map((prod) => ({
    url: `${baseUrl}/products/${prod.slug}`,
    lastModified: prod.createdAt,
    changeFrequency: 'daily',
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
