'use client';

import { Search, CheckCircle, Calendar, Zap } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: Search,
    title: 'Find Services',
    description: 'Search for the service you need and browse verified professionals',
  },
  {
    icon: CheckCircle,
    title: 'Check Reviews',
    description: 'Read ratings and reviews from other customers',
  },
  {
    icon: Calendar,
    title: 'Request Service',
    description: 'Choose instant or scheduled service and submit the request',
  },
  {
    icon: Zap,
    title: 'Service Complete',
    description: 'Get your service done and share your experience',
  },
];

export function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    <section className="py-20 md:py-28 bg-gradient-to-b from-background via-background to-secondary/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center space-y-4 mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your home services done in just a few simple steps
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
        >
          {/* Desktop connecting line */}
          <div className="hidden lg:block absolute top-1/3 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary transform -translate-y-1/2 pointer-events-none">
            <motion.div
              className="h-full bg-gradient-to-r from-primary via-accent to-primary"
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1, delay: 0.5 }}
              viewport={{ once: true, margin: '-100px' }}
            />
          </div>

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                className="relative"
                variants={itemVariants}
              >
                <Card className="p-8 text-center border-border h-full bg-card/50 hover:bg-card backdrop-blur transition-all hover:shadow-lg hover:border-primary/30">
                  <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mx-auto mb-6 group-hover:from-primary/30 group-hover:to-accent/30 transition-colors relative">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary to-accent opacity-0 group-hover:opacity-10 transition-opacity"></div>
                    <Icon className="h-8 w-8 text-primary relative" />
                  </div>

                  <div className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full h-7 w-7 flex items-center justify-center text-xs font-bold font-mono">
                    {index + 1}
                  </div>

                  <h3 className="text-lg font-semibold mb-3 text-foreground">{step.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>

                  {index < steps.length - 1 && (
                    <div className="lg:hidden flex justify-center mt-6 mb-2">
                      <motion.div
                        className="h-6 w-1 bg-gradient-to-b from-primary to-accent rounded-full"
                        initial={{ height: 0 }}
                        whileInView={{ height: 24 }}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        viewport={{ once: true, margin: '-100px' }}
                      />
                    </div>
                  )}
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
