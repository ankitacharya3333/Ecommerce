import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';

export const metadata: Metadata = {
  title: 'Privacy Policy | NOVA MARKET',
  description: 'How NOVA MARKET collects, protects, and respects your personal information.',
};

export default function PrivacyPolicyPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-3xl">
        <div className="border-b border-zinc-200 pb-8 mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Transparency
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-sm text-zinc-600 mt-2">
            Effective Date: October 15, 2026. Your privacy and digital autonomy are respected here.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none text-zinc-600 space-y-6 text-sm sm:text-base leading-relaxed">
          <p>
            At NOVA MARKET ("we", "our", or "us"), we value your privacy. We strictly avoid selling customer data, behavioral ad trackers, or third-party data broker monetization.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">1. Information We Collect</h2>
          <p>
            We collect information you explicitly provide when subscribing to newsletters, contacting support, or browsing our store catalog. This includes contact details, transactional preferences, and standard technical browser telemetry required for site delivery.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">2. Use of Information</h2>
          <p>
            Your information is used solely to provide order processing, customer support, and direct updates regarding collection drops you specifically subscribed to.
          </p>

          <h2 className="text-xl font-serif font-medium text-zinc-900 pt-4">3. Data Security & Storage</h2>
          <p>
            All network communication is strictly encrypted using TLS 1.3. We adhere to industry standards including GDPR and CCPA compliance.
          </p>
        </div>
      </Container>
    </div>
  );
}
