'use client';

import Link from 'next/link';
import { Provider } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { MapPin, CheckCircle, Clock, Award } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProviderCardProps {
  provider: Provider;
}

export function ProviderCard({ provider }: ProviderCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, transition: { duration: 0.2 } }}
      className="h-full"
    >
      <Card className="overflow-hidden hover:shadow-2xl transition-shadow border-border group h-full flex flex-col">
        <div className="flex flex-col sm:flex-row h-full">
          {/* Avatar Section */}
          <div className="sm:w-32 w-full aspect-square sm:aspect-auto bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-white dark:border-slate-900 shadow-md">
              <img
                src={provider.avatar}
                alt={provider.name}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
          </div>

          {/* Content Section */}
          <div className="flex-1 p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                      {provider.name}
                    </h3>
                    {provider.verified && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <div className="relative">
                          <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                        </div>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide capitalize">
                    {provider.category}
                  </p>
                </div>
                <Badge className="bg-primary/10 text-primary whitespace-nowrap font-semibold text-sm rounded-lg px-3 py-1.5">
                  ${provider.price}<span className="text-xs font-normal">/hr</span>
                </Badge>
              </div>

              <div className="h-px bg-border/50"></div>

              <p className="text-sm text-muted-foreground leading-relaxed">{provider.description}</p>

              <div className="space-y-3">
                <StarRating rating={provider.rating} reviews={provider.reviews} size="sm" />

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 text-primary/60" />
                    <span>{provider.distance} km</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4 text-primary/60" />
                    <span>{provider.availability}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs bg-accent/5 rounded-lg px-3 py-2 border border-accent/10">
                  <Award className="h-3.5 w-3.5 text-accent flex-shrink-0" />
                  <span className="text-foreground font-medium">{provider.completedJobs} jobs completed</span>
                </div>
              </div>
            </div>

            <Link href={`/providers/${provider.id}`} className="mt-5 w-full">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium">
                  View Profile & Book
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
