import Link from 'next/link';
import { Logo } from '@/components/layout/Logo';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-zinc-800 text-sm mt-auto">
      <Container className="py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission column */}
          <div className="md:col-span-2 space-y-4">
            <Logo variant="light" />
            <p className="text-zinc-400 text-sm max-w-sm leading-relaxed mt-2">
              NOVA MARKET offers thoughtful living essentials, understated apparel, and enduring workspace accessories made with purpose and precision.
            </p>
            <div className="text-xs text-zinc-500 pt-2 space-y-1">
              <p>NOVA Studios Inc. • San Francisco & Tokyo</p>
              <p>support@novamarket.design</p>
            </div>
          </div>

          {/* Shop Column */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/products"
                  className="hover:text-white transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=living-decor"
                  className="hover:text-white transition-colors"
                >
                  Living & Decor
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=workspace-tech"
                  className="hover:text-white transition-colors"
                >
                  Workspace & Tech
                </Link>
              </li>
              <li>
                <Link
                  href="/products?category=apparel-accessories"
                  className="hover:text-white transition-colors"
                >
                  Apparel & Goods
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase mb-4">
              Customer Care
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/shipping-returns"
                  className="hover:text-white transition-colors"
                >
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-white transition-colors"
                >
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-white transition-colors"
                >
                  Contact Client Support
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Legal Column */}
          <div>
            <h3 className="font-semibold text-white tracking-wider text-xs uppercase mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors"
                >
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors"
                >
                  Legal Notices
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-zinc-800/80 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-zinc-500 gap-4">
          <p>© {new Date().getFullYear()} NOVA MARKET. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy-policy" className="hover:text-zinc-300">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-zinc-300">
              Terms
            </Link>
            <Link href="/shipping-returns" className="hover:text-zinc-300">
              Fulfillment
            </Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
