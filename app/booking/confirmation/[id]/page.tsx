'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Calendar,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  MessageSquare,
  Phone,
} from 'lucide-react';

export default function BookingConfirmationPage() {
  const params = useParams<{ id: string }>();
  const [storedBooking, setStoredBooking] = useState<any>(null);
  const bookingId = params.id;

  useEffect(() => {
    const stored = localStorage.getItem('confirmedBooking');
    if (stored) setStoredBooking(JSON.parse(stored));
  }, []);

  const booking = useMemo(
    () => ({
      id: bookingId,
      service: storedBooking?.serviceType || 'Service Request',
      provider: storedBooking?.providerName || 'Selected provider',
      providerAvatar:
        storedBooking?.providerAvatar ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Provider',
      date: storedBooking?.date || 'Scheduled date',
      time: storedBooking?.time || '',
      location: storedBooking?.location || 'Service location',
      amount: Number(storedBooking?.total ?? 0),
    }),
    [bookingId, storedBooking],
  );

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
        >
          <motion.div variants={itemVariants}>
            <div className="flex justify-center mb-6">
              <CheckCircle className="h-20 w-20 text-accent" />
            </div>
            <h1 className="text-4xl font-bold text-foreground mb-2">
              Request Submitted
            </h1>
            <p className="text-lg text-muted-foreground">
              The provider can now accept, reject, and update this service request.
            </p>
          </motion.div>
        </motion.div>

        <div className="space-y-6">
          <motion.div variants={itemVariants} initial="hidden" animate="visible">
            <Card className="p-8 border-border bg-gradient-to-br from-accent/5 to-primary/5">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-1">
                    {booking.service}
                  </h2>
                  <p className="text-muted-foreground">with {booking.provider}</p>
                </div>
                <Badge className="bg-primary/15 text-primary">Requested</Badge>
              </div>

              <div className="space-y-4 mb-6 pb-6 border-b border-border/30">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date & Time</p>
                    <p className="font-semibold">{booking.date} at {booking.time}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Service Location</p>
                    <p className="font-semibold">{booking.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Current Status</p>
                    <p className="font-semibold">Awaiting provider response</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Price</p>
                    <p className="font-semibold text-lg">${booking.amount.toFixed(2)}</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">
                Request Reference
              </p>
              <p className="font-mono text-lg font-bold">REQ-{booking.id}</p>
            </Card>
          </motion.div>

          <Card className="p-6 border-border">
            <h3 className="text-lg font-semibold mb-4">Your Service Provider</h3>
            <div className="flex items-start gap-4 mb-6">
              <img
                src={booking.providerAvatar}
                alt={booking.provider}
                className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
              />
              <div>
                <h4 className="font-semibold text-lg">{booking.provider}</h4>
                <p className="text-sm text-muted-foreground">
                  Verified utility service professional
                </p>
                <p className="text-sm text-muted-foreground">
                  Transparent pricing and tracked service status
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Phone className="h-4 w-4 mr-2" />
                Contact after acceptance
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Message provider
              </Button>
            </div>
          </Card>

          <Card className="p-6 border-border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                  No Payment Collected
                </h4>
                <p className="text-sm text-green-800 dark:text-green-300">
                  Phase 1 records the service request and tracking workflow only.
                  Payment and invoices are future enhancements.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-border">
            <h3 className="text-lg font-semibold mb-4">What Happens Next?</h3>
            <div className="space-y-3">
              {[
                'Provider accepts or rejects the request.',
                'Accepted jobs move to assigned and in-progress status.',
                'After completion, you can review the provider.',
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-primary font-bold text-sm">
                    {index + 1}
                  </span>
                  <p className="text-sm text-muted-foreground pt-0.5">{step}</p>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Link href={`/tracking/${booking.id}`} className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90">
                Track Service <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Link href="/dashboard" className="flex-1">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
