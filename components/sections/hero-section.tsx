'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Search, Check } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function HeroSection() {
  const [service, setService] = useState('');
  const [location, setLocation] = useState('');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (service) params.append('service', service);
    if (location) params.append('location', location);
    window.location.href = `/providers?${params.toString()}`;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section className="relative bg-gradient-to-b from-secondary via-background to-background overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 h-64 w-64 rounded-full bg-primary/8 blur-3xl"></div>
        <div className="absolute bottom-20 left-20 h-64 w-64 rounded-full bg-accent/8 blur-3xl"></div>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <motion.div
          className="text-center space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-balance leading-tight">
              Find <span className="text-primary font-extrabold">trusted services</span> for your home
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Connect with verified local professionals for homes, apartments, shops, and malls.
            </p>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col gap-4 max-w-2xl mx-auto mt-10"
          >
            <div className="flex flex-col sm:flex-row gap-3 p-2 rounded-2xl bg-white dark:bg-slate-900/50 shadow-lg dark:shadow-xl border border-white/20 backdrop-blur-sm">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="What service do you need?"
                  className="pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder-muted-foreground"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="hidden sm:block w-px bg-border"></div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-3.5 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Your location"
                  className="pl-12 border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 text-foreground placeholder-muted-foreground"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                className="bg-primary hover:bg-primary/90 text-primary-foreground whitespace-nowrap rounded-xl font-medium px-8"
              >
                Search
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-muted-foreground">Popular:</span>
              {['Plumber', 'Electrician', 'Carpenter', 'Tailor', 'Maintenance'].map((item) => (
                <motion.button
                  key={item}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setService(item);
                  }}
                  className="px-3 py-1.5 rounded-full bg-background hover:bg-muted border border-border transition-colors text-foreground text-sm font-medium"
                >
                  {item}
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto pt-10 border-t border-border/50 mt-8"
          >
            <div className="text-center py-4">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">5000+</div>
              <p className="text-xs md:text-sm text-muted-foreground">Verified Providers</p>
            </div>
            <div className="text-center py-4">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">50K+</div>
              <p className="text-xs md:text-sm text-muted-foreground">Happy Customers</p>
            </div>
            <div className="text-center py-4">
              <div className="text-2xl md:text-3xl font-bold text-primary mb-1">4.8★</div>
              <p className="text-xs md:text-sm text-muted-foreground">Avg. Rating</p>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 pt-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-accent" />
              <span>Background Verified</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-accent" />
              <span>Tracked Requests</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Check className="h-4 w-4 text-accent" />
              <span>24/7 Support</span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
