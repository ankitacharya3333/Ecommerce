import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-zinc-900 text-white">
      {/* Background with subtle gradient & image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=2000&q=80"
          alt="Architectural living space with refined interior decor"
          className="w-full h-full object-cover object-center opacity-40 brightness-75 scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-zinc-950/95 via-zinc-950/70 to-transparent" />
      </div>

      <Container className="relative z-10 py-24 sm:py-32 lg:py-40">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wide uppercase text-zinc-300 mb-6 backdrop-blur-sm">
            <span>Autumn / Winter Collection 2026</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-normal tracking-tight text-white leading-[1.1] mb-6">
            Objects of permanence for the modern home.
          </h1>
          
          <p className="text-base sm:text-lg text-zinc-300 font-light leading-relaxed mb-10 max-w-xl">
            Thoughtfully crafted living objects, understated apparel, and ergonomic desk gear designed to age with grace and bring quiet delight to your everyday rituals.
          </p>

          <div className="flex flex-wrap items-center gap-4">
            <Link href="/products">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-zinc-950 hover:bg-zinc-100 font-semibold"
              >
                <span>Explore the Collection</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="text-white border-zinc-500 hover:border-white hover:bg-white/10"
              >
                Our Philosophy
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
