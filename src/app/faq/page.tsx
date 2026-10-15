import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Frequently Asked Questions | NOVA MARKET',
  description: 'Answers to common questions regarding ordering, product care, shipping, and warranty.',
};

const FAQS = [
  {
    q: 'What makes NOVA MARKET products distinct?',
    a: 'We work directly with independent artisan workshops and certified green manufacturers. We produce small-batch runs using authentic, enduring raw materials—such as solid hardwoods, high-density stonewares, and heavy canvas—designed to patina gracefully over time.',
  },
  {
    q: 'How long does shipping take?',
    a: 'Standard orders within North America and Europe typically ship within 1–2 business days and arrive in 3–5 business days. Express overnight delivery options are also selectable at checkout.',
  },
  {
    q: 'What is your return policy?',
    a: 'We offer a straightforward 30-day return policy. Items must be in original condition and packaging. Return shipping within North America is fully covered with our prepaid label.',
  },
  {
    q: 'Are your packaging materials recyclable?',
    a: 'Yes, 100% of our packaging is biodegradable, recycled paperboard, or compostable plant-based mailers. We do not use petroleum-based bubble wrap or single-use plastic films.',
  },
  {
    q: 'Do you offer warranty or repair services?',
    a: 'All NOVA MARKET hardware, tech accessories, and leather goods come with a 2-year manufacturer warranty against craftsmanship defects. We also provide replacement modular parts to prolong each item’s life.',
  },
];

export default function FAQPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Help Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Find immediate answers regarding orders, materials, maintenance, and store policies.
          </p>
        </div>

        <div className="space-y-6">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl bg-white border border-zinc-200 shadow-xs"
            >
              <h2 className="text-base font-semibold text-zinc-900 mb-2">
                {faq.q}
              </h2>
              <p className="text-sm text-zinc-600 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
