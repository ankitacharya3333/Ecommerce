import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getProductBySlug, getRelatedProducts } from '@/lib/products';
import { ProductDetailsClient } from '@/components/catalog/ProductDetailsClient';
import { Container } from '@/components/ui/Container';

interface ProductDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | NOVA MARKET',
    };
  }

  return {
    title: `${product.name} | NOVA MARKET`,
    description: product.description,
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(
    product.slug,
    product.categorySlug,
    3
  );

  return (
    <div className="py-12 sm:py-16">
      <Container>
        {/* Breadcrumb nav */}
        <nav
          aria-label="Breadcrumb"
          className="text-xs text-zinc-500 mb-8 flex items-center space-x-2"
        >
          <a href="/" className="hover:text-zinc-900">
            Home
          </a>
          <span>/</span>
          <a href="/products" className="hover:text-zinc-900">
            Products
          </a>
          <span>/</span>
          <a
            href={`/products?category=${product.categorySlug}`}
            className="hover:text-zinc-900"
          >
            {product.category}
          </a>
          <span>/</span>
          <span className="text-zinc-900 font-medium truncate max-w-[200px]">
            {product.name}
          </span>
        </nav>

        {/* Product details client interactivity */}
        <ProductDetailsClient
          product={product}
          relatedProducts={relatedProducts}
        />
      </Container>
    </div>
  );
}
