'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  className?: string;
  isExpandedMobile?: boolean;
  onCloseMobile?: () => void;
}

export function SearchBar({
  className,
  isExpandedMobile = false,
  onCloseMobile,
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
      if (onCloseMobile) onCloseMobile();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative w-full', className)}
      role="search"
    >
      <label htmlFor="search-input" className="sr-only">
        Search store products
      </label>
      <div className="relative flex items-center">
        <Search className="absolute left-3 w-4 h-4 text-zinc-400 pointer-events-none" />
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, materials..."
          className="w-full bg-zinc-100 text-zinc-900 text-sm pl-9 pr-8 py-2 rounded-lg border border-transparent transition-all placeholder:text-zinc-500 hover:bg-zinc-100/80 focus:bg-white focus:border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950/10"
        />
        {query && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-2.5 p-1 text-zinc-400 hover:text-zinc-600 rounded-full"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </form>
  );
}
