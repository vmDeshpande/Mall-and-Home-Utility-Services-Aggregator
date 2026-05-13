'use client';

import Link from 'next/link';
import { categories } from '@/lib/catalog';
import {
  Droplets,
  Zap,
  Hammer,
  Scissors,
  Wrench,
  ArrowRight,
} from 'lucide-react';
import { motion } from 'framer-motion';

const iconMap = {
  Droplets,
  Zap,
  Hammer,
  Scissors,
  Wrench,
};

export function CategoryGrid() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-20 md:py-28 bg-gradient-to-b from-background to-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center space-y-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">Browse Services</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Find expert professionals for every service you need
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {categories.map((category) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap];

            return (
              <motion.div
                key={category.id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
              >
                <Link
                  href={`/providers?category=${category.id}`}
                  className="group relative overflow-hidden rounded-2xl bg-card/50 border border-border backdrop-blur hover:bg-card p-8 transition-all hover:shadow-xl hover:border-primary/30 cursor-pointer h-full flex flex-col"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  <div className="relative space-y-4 flex-1 flex flex-col">
                    <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300 group-hover:shadow-lg">
                      <IconComponent className="h-8 w-8 text-primary group-hover:scale-110 transition-transform duration-300" />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                        {category.name}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                        {category.description}
                      </p>
                    </div>

                    <motion.div
                      className="pt-2 flex items-center text-primary text-sm font-medium"
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      Explore
                      <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
