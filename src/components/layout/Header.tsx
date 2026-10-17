'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X,
} from 'lucide-react';
import { Logo } from '@/components/layout/Logo';
import { SearchBar } from '@/components/layout/SearchBar';
import { Container } from '@/components/ui/Container';
import { useCartStore } from '@/lib/cart-store';
import { useWishlistStore } from '@/lib/wishlist-store';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/products', label: 'Products' },
  { href: '/about', label: 'About Us' },
  { href: '/contact', label: 'Contact' },
  { href: '/faq', label: 'FAQ' },
];

export function Header() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { getItemCount, toggleCart } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const cartCount = mounted ? getItemCount() : 0;
  const wishlistCount = mounted ? getWishlistCount() : 0;

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-zinc-200 transition-colors">
      <Container>
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          {/* Mobile hamburger button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
                if (mobileSearchOpen) setMobileSearchOpen(false);
              }}
              className="p-2 -ml-2 text-zinc-700 hover:text-zinc-950 focus:outline-none focus:ring-2 focus:ring-zinc-950 rounded-md"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Brand Logo */}
          <div className="flex-shrink-0">
            <Logo />
          </div>

          {/* Desktop Navigation Links */}
          <nav
            aria-label="Main Navigation"
            className="hidden md:flex items-center space-x-1 lg:space-x-2"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'px-3.5 py-1.5 text-sm font-medium rounded-md transition-colors',
                    isActive
                      ? 'text-zinc-950 bg-zinc-100 font-semibold'
                      : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-50'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Desktop Search Bar */}
          <div className="hidden lg:block w-72">
            <SearchBar />
          </div>

          {/* Header Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Mobile Search Toggle */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(!mobileSearchOpen);
                if (mobileMenuOpen) setMobileMenuOpen(false);
              }}
              className="lg:hidden p-2 text-zinc-700 hover:text-zinc-950 rounded-full hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-950"
              aria-label="Search items"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Account Icon */}
            <Link
              href="/account"
              className="p-2 text-zinc-700 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950"
              aria-label="Customer Account"
            >
              <User className="w-5 h-5" />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="p-2 text-zinc-700 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 relative"
              aria-label={`Wishlist (${wishlistCount} items)`}
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with live drawer toggle */}
            <button
              type="button"
              onClick={toggleCart}
              className="p-2 text-zinc-700 hover:text-zinc-950 rounded-full hover:bg-zinc-100 transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-950 relative cursor-pointer"
              aria-label={`Shopping Cart (${cartCount} items)`}
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-zinc-950 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-in zoom-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Drawer */}
        {mobileSearchOpen && (
          <div className="lg:hidden py-3 border-t border-zinc-100">
            <SearchBar onCloseMobile={() => setMobileSearchOpen(false)} />
          </div>
        )}

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-200 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    'block px-3 py-2 text-base font-medium rounded-lg transition-colors',
                    isActive
                      ? 'bg-zinc-100 text-zinc-950 font-semibold'
                      : 'text-zinc-700 hover:bg-zinc-50 hover:text-zinc-950'
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-4 border-t border-zinc-200/60 mt-3 px-3 flex flex-col gap-2">
              <Link
                href="/cart"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-700 hover:text-zinc-950 font-medium flex items-center justify-between"
              >
                <span>Shopping Cart</span>
                <span className="text-zinc-500">({cartCount})</span>
              </Link>
              <Link
                href="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-700 hover:text-zinc-950 font-medium flex items-center justify-between"
              >
                <span>Wishlist</span>
                <span className="text-zinc-500">({wishlistCount})</span>
              </Link>
              <Link
                href="/shipping-returns"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800"
              >
                Shipping & Returns Policy
              </Link>
              <Link
                href="/privacy-policy"
                onClick={() => setMobileMenuOpen(false)}
                className="text-xs text-zinc-500 hover:text-zinc-800"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        )}
      </Container>
    </header>
  );
}
