'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  CreditCard,
  AlertCircle,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

interface PaymentCardProps {
  bookingId: string;
  serviceAmount: number;
  serviceName: string;
  providerName: string;
  serviceDate?: string;
  serviceTime?: string;
  address?: string;
  isCompleted?: boolean;
  onPaymentClick: () => void;
}

export function PaymentCard({
  bookingId,
  serviceAmount,
  serviceName,
  providerName,
  serviceDate,
  serviceTime,
  address,
  isCompleted,
  onPaymentClick,
}: PaymentCardProps) {
  const [isPaid, setIsPaid] = useState(false);

  // Check if payment already exists
  useEffect(() => {
    const transactions = JSON.parse(
      localStorage.getItem('paymentTransactions') || '[]'
    );
    const existingTransaction = transactions.find(
      (t: any) => t.bookingId === bookingId
    );
    if (existingTransaction) {
      setIsPaid(true);
    }
  }, [bookingId]);

  if (isPaid) {
    return (
      <Card className="p-6 border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/20">
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-200 dark:bg-green-900/50">
            <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-green-900 dark:text-green-100">
              Payment Completed
            </h3>
            <p className="mt-1 text-sm text-green-800 dark:text-green-200">
              Payment of ${(serviceAmount + Math.round(serviceAmount * 0.1 * 100) / 100).toFixed(2)} has been successfully processed.
            </p>
            <p className="mt-2 text-xs text-green-700 dark:text-green-300">
              Thank you for your payment. The service provider has been notified.
            </p>
          </div>
        </div>
      </Card>
    );
  }

  const tax = Math.round(serviceAmount * 0.1 * 100) / 100;
  const total = serviceAmount + tax;

  return (
    <Card className="p-6 border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <CreditCard className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground text-lg">Pay for Service</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Service is in progress. Complete payment to finalize booking.
              </p>
            </div>
          </div>
          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-950/30 dark:text-orange-400">
            Pending Payment
          </Badge>
        </div>

        {/* Service Details */}
        <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border">
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Service:</span>
            <span className="font-medium text-foreground">{serviceName}</span>
          </div>
          <div className="flex justify-between items-start text-sm">
            <span className="text-muted-foreground">Provider:</span>
            <span className="font-medium text-foreground">{providerName}</span>
          </div>
          {serviceDate && (
            <div className="flex justify-between items-start text-sm">
              <span className="text-muted-foreground">Scheduled Date:</span>
              <span className="font-medium text-foreground">{serviceDate}</span>
            </div>
          )}
          {serviceTime && (
            <div className="flex justify-between items-start text-sm">
              <span className="text-muted-foreground">Scheduled Time:</span>
              <span className="font-medium text-foreground">{serviceTime}</span>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="space-y-2 p-4 rounded-lg bg-background/50 border border-border text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Service Amount:</span>
            <span className="font-medium">${serviceAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%):</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between text-base font-bold text-primary">
            <span>Total Amount:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Info Box */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800">
          <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-blue-900 dark:text-blue-100">
            Click the "Pay Now" button below to proceed with secure online payment.
          </p>
        </div>

        {/* Payment Button */}
        <Button
          onClick={onPaymentClick}
          disabled={isCompleted}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium group"
        >
          <CreditCard className="h-4 w-4 mr-2" />
          Pay Now ${total.toFixed(2)}
          <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </Card>
  );
}
