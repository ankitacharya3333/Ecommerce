import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-24 sm:py-32 flex items-center justify-center">
      <Container className="text-center max-w-lg">
        <p className="text-sm font-semibold text-zinc-500 uppercase tracking-widest mb-2">
          404 Error
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-medium text-zinc-900 mb-4 tracking-tight">
          Page not found
        </h1>
        <p className="text-zinc-600 text-sm sm:text-base leading-relaxed mb-8">
          The page you are looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link href="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-1.5" />
              <span>Back to Home</span>
            </Button>
          </Link>
          <Link href="/products">
            <Button variant="outline" size="md">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Explore Products</span>
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
}
