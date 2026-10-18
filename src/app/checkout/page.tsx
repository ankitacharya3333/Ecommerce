import type { Metadata } from 'next';
import { CheckoutClient } from '@/components/checkout/CheckoutClient';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Secure Checkout | NOVA MARKET',
  description: 'Complete your purchase with encrypted payment and verified order placement.',
};

export default function CheckoutPage() {
  return (
    <div className="py-12 sm:py-16">
      <Container>
        <div className="border-b border-zinc-200 pb-6 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-1">
            Order Fulfillment
          </p>
          <h1 className="text-3xl font-serif font-medium text-zinc-900 tracking-tight">
            Checkout
          </h1>
        </div>

        <CheckoutClient />
      </Container>
    </div>
  );
}
