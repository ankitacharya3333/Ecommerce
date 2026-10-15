import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Shipping & Returns | NOVA MARKET',
  description: 'Details on shipping rates, delivery estimates, international duties, and return terms.',
};

export default function ShippingReturnsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Fulfillment & Care
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Shipping & Returns Policy
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Last updated: October 2026. Transparent and predictable shipping timelines worldwide.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-serif font-medium text-zinc-900">1. Domestic Delivery (US & Canada)</h2>
          <p>
            We offer complimentary standard shipping on all orders over $120. For orders under $120, a flat shipping rate of $8 applies. Orders are dispatched within 24–48 hours from our fulfillment hub in California.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">2. International Fulfillment</h2>
          <p>
            We ship to over 45 countries via DHL Express Worldwide. International shipping rates are calculated dynamically at checkout based on weight and country. All international shipments are delivered with duties and taxes pre-cleared whenever feasible.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">3. 30-Day Guaranteed Returns</h2>
          <p>
            If you are not thoroughly satisfied with your purchase, you may initiate a return or exchange within 30 days of receiving your package. Items must be unused, in their original condition, and packed in original protective packaging.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">4. Damages in Transit</h2>
          <p>
            In the rare event of damage during shipment, please contact our concierge team at support@novamarket.design within 48 hours of receipt with a photo of the package and item. We will dispatch an immediate replacement at zero cost.
          </p>
        </div>
      </Container>
    </div>
  );
}
