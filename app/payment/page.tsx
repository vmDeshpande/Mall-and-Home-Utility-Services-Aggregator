'use client';

import { Suspense } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Footer } from '@/components/layout/footer';
import { Loader2 } from 'lucide-react';
import PaymentPageContent from './payment-content';

// Loading fallback
function PaymentPageLoader() {
  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center border-border">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading payment...</p>
        </Card>
      </div>
    </main>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<PaymentPageLoader />}>
      <PaymentPageContent />
    </Suspense>
  );
}
