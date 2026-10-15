import type { Metadata } from 'next';
import { Mail, MapPin, Clock } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { ContactForm } from '@/components/contact/ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | NOVA MARKET',
  description: 'Get in touch with the NOVA MARKET team for inquiries and assistance.',
};

export default function ContactPage() {
  return (
    <div className="py-16 sm:py-24">
      <Container className="max-w-5xl">
        <div className="border-b border-zinc-200 pb-8 mb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-2">
            Get In Touch
          </p>
          <h1 className="text-3xl sm:text-4xl font-serif font-medium text-zinc-900 tracking-tight">
            Client Assistance & Inquiries
          </h1>
          <p className="text-sm text-zinc-600 mt-2 max-w-xl">
            Whether you have questions regarding dimensions, shipping schedules, or custom trade orders, we are here to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                <Mail className="w-4 h-4 text-zinc-800" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Email Us</h2>
                <p className="text-xs text-zinc-500 mt-0.5">Direct client concierge:</p>
                <a
                  href="mailto:support@novamarket.design"
                  className="text-sm font-medium text-zinc-900 hover:underline"
                >
                  support@novamarket.design
                </a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                <MapPin className="w-4 h-4 text-zinc-800" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Studio & Showroom</h2>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  548 Market Street, Suite 4820<br />
                  San Francisco, CA 94104
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0 border border-zinc-200">
                <Clock className="w-4 h-4 text-zinc-800" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-zinc-900">Operating Hours</h2>
                <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">
                  Monday – Friday: 9am – 6pm PST<br />
                  Weekend: 10am – 4pm PST
                </p>
              </div>
            </div>

            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <strong className="font-semibold block mb-0.5">Development Notice:</strong>
              This contact form is a clean UI-only interface for Phase 1. Backend email dispatch will be connected in future development sessions.
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <ContactForm />
          </div>
        </div>
      </Container>
    </div>
  );
}
