import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'About Our Philosophy | NOVA MARKET',
  description: 'Learn about the ethos and design standards behind NOVA MARKET.',
};

export default function AboutPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-4xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">
          Our Story & Ethos
        </p>
        <h1 className="text-3xl sm:text-5xl font-serif font-medium text-zinc-900 tracking-tight mb-8">
          We believe in enduring simplicity and mindful utility.
        </h1>

        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6 text-base leading-relaxed">
          <p>
            Founded in 2024, NOVA MARKET was created with an uncompromising thesis: that the objects filling our physical living spaces profoundly shape how we think, rest, and create.
          </p>
          <p>
            Rather than cycling through fleeting trends and disposable consumerism, we partner with small-batch workshops, ceramicists, and textile mills around the world. Every piece is selected for structural durability, tactile satisfaction, and quiet, unpretentious beauty.
          </p>

          <div className="my-12 grid grid-cols-1 sm:grid-cols-3 gap-6 border-y border-zinc-200 py-8">
            <div>
              <h3 className="text-2xl font-serif font-medium text-zinc-900 mb-1">100%</h3>
              <p className="text-xs text-zinc-500">Traceable ethical raw materials</p>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-medium text-zinc-900 mb-1">Zero</h3>
              <p className="text-xs text-zinc-500">Single-use plastic in packaging</p>
            </div>
            <div>
              <h3 className="text-2xl font-serif font-medium text-zinc-900 mb-1">Lifetime</h3>
              <p className="text-xs text-zinc-500">Commitment to repairability</p>
            </div>
          </div>

          <h2 className="text-2xl font-serif font-medium text-zinc-900 pt-4 mb-3">
            Design Principles
          </h2>
          <p>
            We adhere strictly to Dieter Rams' tenet that good design is as little design as possible. Stripped of unnecessary branding and ephemeral stylistic flourishes, our goods let natural grain, honest metal finishes, and intentional proportions speak for themselves.
          </p>
        </div>
      </Container>
    </div>
  );
}
