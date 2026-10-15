'use client';

import { useState } from 'react';
import Link from 'next/link';
import { X, ArrowRight } from 'lucide-react';

export function AnnouncementBar() {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <div
      role="region"
      aria-label="Announcement"
      className="bg-zinc-950 text-zinc-200 text-xs py-2 px-4 border-b border-zinc-800 transition-all duration-200"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="w-6 hidden sm:block" />
        <div className="flex-1 text-center font-medium flex items-center justify-center gap-2">
          <span>Complimentary carbon-neutral shipping on orders over $120.</span>
          <Link
            href="/shipping-returns"
            className="inline-flex items-center text-zinc-300 underline underline-offset-4 hover:text-white group"
          >
            <span>Learn more</span>
            <ArrowRight className="w-3 h-3 ml-0.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
        <button
          type="button"
          onClick={() => setIsVisible(false)}
          className="text-zinc-400 hover:text-white p-1 rounded transition-colors focus:outline-none focus:ring-1 focus:ring-zinc-400"
          aria-label="Dismiss announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
