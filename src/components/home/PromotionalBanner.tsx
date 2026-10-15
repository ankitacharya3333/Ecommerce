import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function PromotionalBanner() {
  return (
    <section className="py-16 bg-zinc-950 text-white relative overflow-hidden">
      {/* Decorative subtle ambient circle */}
      <div className="absolute -right-20 -top-20 w-96 h-96 bg-zinc-800/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-96 h-96 bg-zinc-800/20 rounded-full blur-3xl pointer-events-none" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700 text-xs font-medium text-zinc-300 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Limited Studio Release</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif font-medium tracking-tight mb-4 text-white">
            Designed for endurance, made without compromise.
          </h2>

          <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Discover our curated archive of limited seasonal creations. Each item is produced in small, numbered runs using sustainably certified materials.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <Button
                variant="secondary"
                size="md"
                className="bg-white text-zinc-950 hover:bg-zinc-100"
              >
                <span>Shop Private Edition</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="md"
                className="text-white border-zinc-700 hover:border-zinc-500 hover:bg-zinc-900"
              >
                Read Material Standards
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
