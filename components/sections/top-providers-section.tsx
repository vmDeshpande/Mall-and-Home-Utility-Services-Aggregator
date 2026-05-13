'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { mapApiProvider } from '@/lib/provider-transform';
import type { Provider } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StarRating } from '@/components/ui/star-rating';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/ui/empty-state';
import { MapPin, CheckCircle, Search } from 'lucide-react';

export function TopProvidersSection() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await api.getProviders();
        setProviders(data.map(mapApiProvider).filter((provider: Provider) => provider.verified));
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProviders();
  }, []);

  const topProviders = useMemo(
    () =>
      [...providers]
        .sort((a, b) => b.rating - a.rating || b.completedJobs - a.completedJobs || a.price - b.price)
        .slice(0, 6),
    [providers],
  );

  return (
    <section className="py-20 bg-secondary/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold">Top Rated Providers</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Verified professionals ranked by rating, completed jobs, and pricing
          </p>
        </div>

        {isLoading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading verified providers...</Card>
        ) : topProviders.length ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {topProviders.map((provider) => (
              <Link key={provider.id} href={`/providers/${provider.id}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full cursor-pointer group border-border">
                  <div className="relative">
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      <img
                        src={provider.avatar}
                        alt={provider.name}
                        className="h-32 w-32 rounded-full object-cover border border-border"
                      />
                    </div>

                    <Badge className="absolute top-3 right-3 bg-accent text-accent-foreground flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {provider.name}
                      </h3>
                      <p className="text-sm text-muted-foreground capitalize">{provider.category}</p>
                    </div>

                    <div className="space-y-3">
                      <StarRating rating={provider.rating} reviews={provider.reviews} />

                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{provider.availability}</span>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-border">
                        <span className="text-sm text-muted-foreground">{provider.completedJobs} jobs completed</span>
                        <span className="text-lg font-bold text-primary">${provider.price}/hr</span>
                      </div>
                    </div>

                    <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      View Profile
                    </Button>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="No verified providers yet"
            description="Approved providers will appear here after admin verification"
          />
        )}

        <div className="text-center mt-12">
          <Link href="/providers">
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary/5"
            >
              View All Providers
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
