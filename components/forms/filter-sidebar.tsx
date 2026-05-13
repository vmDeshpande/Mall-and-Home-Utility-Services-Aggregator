'use client';

import { Dispatch, SetStateAction } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { categories } from '@/lib/catalog';
import { Slider } from '@/components/ui/slider';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  selectedCategory: string | null;
  setSelectedCategory: Dispatch<SetStateAction<string | null>>;
  selectedRating: number;
  setSelectedRating: Dispatch<SetStateAction<number>>;
  maxPrice: number;
  setMaxPrice: Dispatch<SetStateAction<number>>;
  onClose?: () => void;
  isOpen?: boolean;
}

export function FilterSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedRating,
  setSelectedRating,
  maxPrice,
  setMaxPrice,
  onClose,
  isOpen = true,
}: FilterSidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-16 left-0 w-64 bg-background border-r border-border overflow-y-auto transition-transform md:relative md:inset-auto md:transform-none md:sticky md:top-16 z-50',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-6 space-y-8">
          <div className="flex items-center justify-between md:hidden">
            <h3 className="font-semibold">Filters</h3>
            <button onClick={onClose} className="p-1 hover:bg-muted rounded">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Service Category</h3>
            <div className="space-y-3">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                  selectedCategory === null
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-muted'
                )}
              >
                All Categories
              </button>

              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedCategory === category.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-sm">Minimum Rating</h3>
            <div className="space-y-3">
              {[5, 4, 3, 2, 1].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className={cn(
                    'w-full text-left px-3 py-2 rounded-lg text-sm transition-colors',
                    selectedRating === rating
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted'
                  )}
                >
                  {rating}★ & up
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">Max Price</h3>
              <span className="text-sm font-medium text-primary">${maxPrice}</span>
            </div>
            <Slider
              defaultValue={[maxPrice]}
              max={200}
              min={0}
              step={10}
              onValueChange={(value) => setMaxPrice(value[0])}
              className="w-full"
            />
          </div>

          {/* Reset Filters */}
          <Button
            variant="outline"
            className="w-full"
            onClick={() => {
              setSelectedCategory(null);
              setSelectedRating(0);
              setMaxPrice(200);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </aside>
    </>
  );
}
