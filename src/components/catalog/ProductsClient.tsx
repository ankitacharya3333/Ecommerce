'use client';

import React, { useTransition } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Search,
  SlidersHorizontal,
  X,
  ArrowUpDown,
  RotateCcw,
  PackageOpen,
} from 'lucide-react';
import { Product, Category } from '@/lib/types';
import { ProductCard } from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/Button';

interface ProductsClientProps {
  initialProducts: Product[];
  categories: Category[];
  total: number;
  page: number;
  totalPages: number;
}

export function ProductsClient({
  initialProducts,
  categories,
  total,
  page,
  totalPages,
}: ProductsClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentCategory = searchParams.get('category') || 'all';
  const currentSort = searchParams.get('sort') || 'featured';
  const currentSearch = searchParams.get('search') || '';
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';

  const [mobileFilterOpen, setMobileFilterOpen] = React.useState(false);
  const [searchInput, setSearchInput] = React.useState(currentSearch);
  const [minPriceInput, setMinPriceInput] = React.useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = React.useState(currentMaxPrice);

  // Sync inputs if URL params change externally
  React.useEffect(() => {
    setSearchInput(currentSearch);
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentSearch, currentMinPrice, currentMaxPrice]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    // Reset to page 1 whenever search, filter, or sorting changes (unless explicitly setting page)
    if (!('page' in newParams)) {
      params.set('page', '1');
    }

    Object.entries(newParams).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ search: searchInput.trim() });
  };

  const handlePriceFilterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPriceInput ? minPriceInput : null,
      maxPrice: maxPriceInput ? maxPriceInput : null,
    });
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    startTransition(() => {
      router.push('/products');
    });
  };

  const hasActiveFilters = Boolean(
    (currentCategory && currentCategory !== 'all') ||
      currentSearch ||
      currentMinPrice ||
      currentMaxPrice ||
      (currentSort && currentSort !== 'featured')
  );

  return (
    <div>
      {/* Top Bar with Search & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 mb-8 border-b border-zinc-200">
        {/* Search bar inside catalog */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
          <input
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Filter by name, material, keyword..."
            className="w-full bg-white text-zinc-900 text-sm pl-10 pr-9 py-2 rounded-lg border border-zinc-300 focus:outline-none focus:ring-2 focus:ring-zinc-950/20 focus:border-zinc-900 transition-all placeholder:text-zinc-400"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                updateFilters({ search: null });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 p-0.5"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        <div className="flex items-center justify-between md:justify-end gap-3">
          {/* Mobile filter toggle button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="lg:hidden inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-zinc-800 bg-white border border-zinc-300 rounded-lg hover:bg-zinc-50"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-zinc-900" />
            )}
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <label htmlFor="sort-select" className="text-xs text-zinc-500 whitespace-nowrap hidden sm:inline">
              Sort by:
            </label>
            <div className="relative">
              <select
                id="sort-select"
                value={currentSort}
                onChange={(e) => updateFilters({ sort: e.target.value })}
                className="appearance-none bg-white border border-zinc-300 text-zinc-900 text-xs font-medium py-2 pl-3 pr-8 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-950/20 cursor-pointer"
              >
                <option value="featured">Featured Curations</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Top Rated</option>
              </select>
              <ArrowUpDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters Desktop */}
        <aside
          className={`lg:block ${
            mobileFilterOpen ? 'block' : 'hidden'
          } space-y-6 lg:space-y-8`}
        >
          {/* Active Filters Summary & Clear */}
          {hasActiveFilters && (
            <div className="p-4 rounded-xl bg-zinc-100/70 border border-zinc-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-zinc-900">Active Filters</span>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-zinc-600 hover:text-rose-600 underline flex items-center gap-1 text-[11px]"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {currentCategory && currentCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700">
                    Category: {currentCategory}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-zinc-950"
                      onClick={() => updateFilters({ category: null })}
                    />
                  </span>
                )}
                {currentSearch && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700">
                    "{currentSearch}"
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-zinc-950"
                      onClick={() => {
                        setSearchInput('');
                        updateFilters({ search: null });
                      }}
                    />
                  </span>
                )}
                {(currentMinPrice || currentMaxPrice) && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-white border border-zinc-200 text-zinc-700">
                    ${currentMinPrice || '0'} - ${currentMaxPrice || '∞'}
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-zinc-950"
                      onClick={() => {
                        setMinPriceInput('');
                        setMaxPriceInput('');
                        updateFilters({ minPrice: null, maxPrice: null });
                      }}
                    />
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Department Categories */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Categories
            </h3>
            <ul className="space-y-1.5 text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => updateFilters({ category: 'all' })}
                  className={`w-full text-left py-1.5 px-2.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                    currentCategory === 'all'
                      ? 'bg-zinc-900 text-white font-medium'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                  }`}
                >
                  <span>All Departments</span>
                  <span className="text-[11px] opacity-70">12</span>
                </button>
              </li>
              {categories.map((cat) => {
                const isActive = currentCategory === cat.slug;
                return (
                  <li key={cat.id}>
                    <button
                      type="button"
                      onClick={() => updateFilters({ category: cat.slug })}
                      className={`w-full text-left py-1.5 px-2.5 rounded-md text-xs transition-colors flex items-center justify-between ${
                        isActive
                          ? 'bg-zinc-900 text-white font-medium'
                          : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900'
                      }`}
                    >
                      <span>{cat.name}</span>
                      <span className="text-[11px] opacity-70">{cat.itemCount}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Price Range Filter Form */}
          <div className="pt-4 border-t border-zinc-200">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-900 mb-3">
              Price Range ($)
            </h3>
            <form onSubmit={handlePriceFilterSubmit} className="space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="0"
                  placeholder="Min"
                  value={minPriceInput}
                  onChange={(e) => setMinPriceInput(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
                <span className="text-zinc-400 text-xs">—</span>
                <input
                  type="number"
                  min="0"
                  placeholder="Max"
                  value={maxPriceInput}
                  onChange={(e) => setMaxPriceInput(e.target.value)}
                  className="w-full text-xs px-2.5 py-1.5 rounded-md border border-zinc-300 focus:outline-none focus:ring-1 focus:ring-zinc-950"
                />
              </div>
              <Button type="submit" variant="secondary" size="sm" className="w-full text-xs">
                Apply Price Filter
              </Button>
            </form>
          </div>
        </aside>

        {/* Product Grid Area */}
        <div className="lg:col-span-3">
          {isPending && (
            <div className="mb-4 text-xs text-zinc-500 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-zinc-900 animate-ping" />
              <span>Updating results...</span>
            </div>
          )}

          {initialProducts.length === 0 ? (
            /* Empty Results State */
            <div className="py-20 text-center rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 p-8">
              <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto text-zinc-500 mb-4">
                <PackageOpen className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-zinc-900 mb-1">
                No matching products found
              </h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto mb-6 leading-relaxed">
                We couldn't find items matching your current search parameters or price boundaries.
              </p>
              <Button onClick={handleResetFilters} variant="primary" size="sm">
                Clear Filters & Show All
              </Button>
            </div>
          ) : (
            <>
              {/* Product Card Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="mt-12 pt-8 border-t border-zinc-200 flex items-center justify-between">
                  <p className="text-xs text-zinc-500">
                    Showing page <span className="font-semibold text-zinc-900">{page}</span> of{' '}
                    <span className="font-semibold text-zinc-900">{totalPages}</span> ({total} items)
                  </p>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page <= 1 || isPending}
                      onClick={() => updateFilters({ page: String(page - 1) })}
                    >
                      Previous
                    </Button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }).map((_, i) => {
                        const pageNum = i + 1;
                        return (
                          <button
                            key={pageNum}
                            type="button"
                            onClick={() => updateFilters({ page: String(pageNum) })}
                            className={`w-8 h-8 rounded-md text-xs font-medium transition-colors ${
                              page === pageNum
                                ? 'bg-zinc-900 text-white'
                                : 'text-zinc-700 hover:bg-zinc-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={page >= totalPages || isPending}
                      onClick={() => updateFilters({ page: String(page + 1) })}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
