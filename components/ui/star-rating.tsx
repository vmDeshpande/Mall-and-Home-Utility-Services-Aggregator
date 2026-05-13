import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  rating: number;
  reviews?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function StarRating({ rating, reviews, size = 'md', className }: StarRatingProps) {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className="flex items-center">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="relative">
            <Star
              className={cn(sizeClasses[size], 'text-muted-foreground')}
              fill="currentColor"
            />
            {i < fullStars && (
              <div className="absolute inset-0">
                <Star
                  className={cn(sizeClasses[size], 'text-accent')}
                  fill="currentColor"
                />
              </div>
            )}
            {hasHalfStar && i === fullStars && (
              <div className="absolute inset-0 overflow-hidden w-1/2">
                <Star
                  className={cn(sizeClasses[size], 'text-accent')}
                  fill="currentColor"
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <span className="text-sm font-medium">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="text-xs text-muted-foreground">({reviews})</span>
      )}
    </div>
  );
}
