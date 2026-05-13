'use client';

import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { api } from '@/lib/api';
import { mapApiProvider } from '@/lib/provider-transform';
import type { Provider } from '@/lib/types';
import { ProviderCard } from '@/components/cards/provider-card';
import { FilterSidebar } from '@/components/forms/filter-sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Search } from 'lucide-react';

export default function ProvidersPage() {
  const [allProviders, setAllProviders] = useState<Provider[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200);
  const [sortBy, setSortBy] = useState<'rating' | 'price' | 'distance'>('rating');
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await api.getProviders();
        const mapped = data
          .map(mapApiProvider)
          .filter((provider: Provider) => provider.verified);

        setAllProviders(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadProviders();
  }, []);

  const filteredAndSortedProviders = useMemo(() => {
    let filtered = [...allProviders];

    if (selectedCategory) {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter((p) => p.rating >= selectedRating && p.price <= maxPrice);

    filtered.sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price') return a.price - b.price;
      return a.distance - b.distance;
    });

    return filtered;
  }, [allProviders, selectedCategory, selectedRating, maxPrice, sortBy]);

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Find Service Providers</h1>
          <p className="text-muted-foreground">
            {filteredAndSortedProviders.length} providers available
          </p>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="md:hidden flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:bg-muted transition-colors"
          >
            <Filter className="h-5 w-5" />
            Filters
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Sort by:</span>
            <div className="flex gap-2">
              {(['rating', 'price', 'distance'] as const).map((option) => (
                <button
                  key={option}
                  onClick={() => setSortBy(option)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    sortBy === option
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-border hover:bg-muted'
                  }`}
                >
                  {option === 'rating' && 'Highest Rated'}
                  {option === 'price' && 'Lowest Price'}
                  {option === 'distance' && 'Nearest'}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
            />
          </div>

          {/* Mobile Filters */}
          {filterOpen && (
            <FilterSidebar
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              selectedRating={selectedRating}
              setSelectedRating={setSelectedRating}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              isOpen={filterOpen}
              onClose={() => setFilterOpen(false)}
            />
          )}

          {/* Provider List */}
          <div className="flex-1 min-w-0">
            {filteredAndSortedProviders.length === 0 ? (
              <EmptyState
                icon={Search}
                title="No providers found"
                description="Try adjusting your filters to find more providers"
              />
            ) : (
              <div className="space-y-4">
                {filteredAndSortedProviders.map((provider) => (
                  <ProviderCard key={provider.id} provider={provider} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
