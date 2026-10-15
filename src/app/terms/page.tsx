import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Terms of Service | NOVA MARKET',
  description: 'Terms governing the use of the NOVA MARKET digital platform and products.',
};

export default function TermsPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Legal Agreements
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Terms of Service
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Last modified: October 15, 2026. Please review these operational terms.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <h2 className="text-xl font-serif font-medium text-zinc-900">1. Acceptance of Terms</h2>
          <p>
            By accessing or purchasing from NOVA MARKET, you agree to comply with and be bound by these Terms of Service. If you disagree with any part of these terms, please refrain from using our services.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">2. Product Specifications & Pricing</h2>
          <p>
            We strive to display accurate descriptions, dimensions, and color representations of our goods. Because many products utilize natural materials like organic linens, full-grain leathers, and kiln-fired ceramics, slight organic variations in tone and texture are an intended mark of authenticity.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">3. Intellectual Property</h2>
          <p>
            All brand assets, photography, graphic designs, typography treatments, and software code on NOVA MARKET are the exclusive intellectual property of NOVA Studios Inc. and protected under international copyright laws.
          </p>
        </div>
      </Container>
    </div>
  );
}
