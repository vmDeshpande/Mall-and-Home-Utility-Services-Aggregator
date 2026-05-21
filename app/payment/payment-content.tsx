'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Footer } from '@/components/layout/footer';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react';

interface PaymentState {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isProcessing: boolean;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage: string;
}

export default function PaymentPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const bookingId = searchParams.get('bookingId');
  const serviceAmount = Number(searchParams.get('amount') || '0');
  const serviceName = searchParams.get('service') || 'Service';
  const providerName = searchParams.get('provider') || 'Service Provider';
  const serviceDate = searchParams.get('date') || '';
  const serviceTime = searchParams.get('time') || '';
  const address = searchParams.get('address') || '';

  const [state, setState] = useState<PaymentState>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    isProcessing: false,
    paymentStatus: 'idle',
    errorMessage: '',
  });

  // Calculate tax and total
  const tax = Math.round(serviceAmount * 0.1 * 100) / 100;
  const total = serviceAmount + tax;

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    return value
      .replace(/\s/g, '')
      .replace(/(\d{4})/g, '$1 ')
      .trim();
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    if (formatted.replace(/\s/g, '').length <= 16) {
      setState({...state, cardNumber: formatted});
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatExpiryDate(e.target.value);
    setState({...state, expiryDate: formatted});
  };

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 3) {
      setState({...state, cvv: value});
    }
  };

  const validatePaymentForm = (): boolean => {
    if (!state.cardNumber || state.cardNumber.replace(/\s/g, '').length !== 16) {
      setState({
        ...state,
        paymentStatus: 'error',
        errorMessage: 'Please enter a valid 16-digit card number',
      });
      return false;
    }

    if (!state.expiryDate || !/^\d{2}\/\d{2}$/.test(state.expiryDate)) {
      setState({
        ...state,
        paymentStatus: 'error',
        errorMessage: 'Please enter a valid expiry date (MM/YY)',
      });
      return false;
    }

    if (!state.cvv || state.cvv.length !== 3) {
      setState({
        ...state,
        paymentStatus: 'error',
        errorMessage: 'Please enter a valid 3-digit CVV',
      });
      return false;
    }

    if (!state.cardholderName.trim()) {
      setState({
        ...state,
        paymentStatus: 'error',
        errorMessage: 'Please enter the cardholder name',
      });
      return false;
    }

    return true;
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validatePaymentForm()) {
      return;
    }

    setState({...state, isProcessing: true, paymentStatus: 'processing'});

    // Mock payment processing with delay
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock payment success (90% success rate)
      if (Math.random() > 0.1) {
        // Store payment transaction
        const transaction = {
          id: `TXN${Date.now()}`,
          bookingId,
          amount: total,
          serviceAmount,
          tax,
          cardLast4: state.cardNumber.slice(-4),
          timestamp: new Date().toISOString(),
          status: 'completed',
          serviceName,
          providerName,
        };

        // Save to localStorage for persistence
        const existingTransactions = JSON.parse(
          localStorage.getItem('paymentTransactions') || '[]'
        );
        existingTransactions.push(transaction);
        localStorage.setItem('paymentTransactions', JSON.stringify(existingTransactions));

        // Update booking with payment info
        const confirmedBooking = JSON.parse(
          localStorage.getItem('confirmedBooking') || '{}'
        );
        confirmedBooking.paymentStatus = 'completed';
        confirmedBooking.transactionId = transaction.id;
        confirmedBooking.paidAmount = total;
        localStorage.setItem('confirmedBooking', JSON.stringify(confirmedBooking));

        setState({
          ...state,
          isProcessing: false,
          paymentStatus: 'success',
          errorMessage: '',
        });

        // Redirect after success
        setTimeout(() => {
          router.push(`/tracking/${bookingId}`);
        }, 2000);
      } else {
        // Mock payment failure
        throw new Error('Card declined. Please try another card.');
      }
    } catch (error) {
      setState({
        ...state,
        isProcessing: false,
        paymentStatus: 'error',
        errorMessage:
          error instanceof Error ? error.message : 'Payment failed. Please try again.',
      });
    }
  };

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <Link href={`/tracking/${bookingId}`}>
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Tracking
            </Button>
          </Link>
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <CreditCard className="h-8 w-8 text-primary" />
            Secure Payment
          </h1>
          <p className="text-muted-foreground">
            Complete your payment to confirm the service booking
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-4">
            <Card className="p-6 border-border">
              <h2 className="text-lg font-bold mb-4">Order Summary</h2>

              <div className="space-y-3 mb-4 p-4 rounded-lg bg-muted/50">
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Service:</span>
                  <span className="font-medium text-foreground">{serviceName}</span>
                </div>
                <div className="flex justify-between items-start">
                  <span className="text-muted-foreground">Provider:</span>
                  <span className="font-medium text-foreground">{providerName}</span>
                </div>
                {serviceDate && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Date:</span>
                    <span className="font-medium text-foreground">{serviceDate}</span>
                  </div>
                )}
                {serviceTime && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Time:</span>
                    <span className="font-medium text-foreground">{serviceTime}</span>
                  </div>
                )}
                {address && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-foreground text-right max-w-[200px]">
                      {address}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal:</span>
                  <span className="font-medium">${serviceAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%):</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-border pt-3">
                  <span>Total Amount:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Badge className="w-full justify-center py-2 mt-4 bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                <Lock className="h-3 w-3 mr-1" />
                Secure Transaction
              </Badge>
            </Card>

            <Card className="p-6 border-border">
              <h3 className="font-medium mb-3">Booking Details</h3>
              <div className="text-xs text-muted-foreground space-y-2">
                <div>
                  <span className="font-medium">Booking ID:</span> #{bookingId}
                </div>
                <div className="pt-2 border-t border-border">
                  <p className="text-xs mb-2 font-medium">Payment Security</p>
                  <ul className="space-y-1 text-xs">
                    <li>✓ SSL Encrypted</li>
                    <li>✓ PCI DSS Compliant</li>
                    <li>✓ Secure Connection</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          {/* Payment Form */}
          <Card className="p-6 border-border">
            <form onSubmit={handlePaymentSubmit} className="space-y-6">
              {/* Error/Success Messages */}
              {state.paymentStatus === 'error' && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{state.errorMessage}</AlertDescription>
                </Alert>
              )}

              {state.paymentStatus === 'success' && (
                <Alert className="border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
                  <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                  <AlertDescription className="text-green-800 dark:text-green-100">
                    Payment successful! Your booking is confirmed. Redirecting...
                  </AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="cardNumber" className="text-sm font-medium">
                  Card Number
                </Label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    value={state.cardNumber}
                    onChange={handleCardNumberChange}
                    disabled={state.isProcessing}
                    maxLength={19}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {state.cardNumber.replace(/\s/g, '').length} of 16 digits
                </p>
              </div>

              {/* Expiry and CVV */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="expiryDate" className="text-sm font-medium">
                    Expiry Date
                  </Label>
                  <Input
                    id="expiryDate"
                    placeholder="MM/YY"
                    value={state.expiryDate}
                    onChange={handleExpiryDateChange}
                    disabled={state.isProcessing}
                    maxLength={5}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cvv" className="text-sm font-medium">
                    CVV
                  </Label>
                  <Input
                    id="cvv"
                    type="password"
                    placeholder="***"
                    value={state.cvv}
                    onChange={handleCVVChange}
                    disabled={state.isProcessing}
                    maxLength={3}
                  />
                </div>
              </div>

              {/* Cardholder Name */}
              <div className="space-y-2">
                <Label htmlFor="cardholderName" className="text-sm font-medium">
                  Cardholder Name
                </Label>
                <Input
                  id="cardholderName"
                  placeholder="John Doe"
                  value={state.cardholderName}
                  onChange={(e) => setState({...state, cardholderName: e.target.value})}
                  disabled={state.isProcessing}
                />
              </div>

              {/* Security Info */}
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 text-xs text-blue-900 dark:text-blue-100">
                <Lock className="h-4 w-4 flex-shrink-0 mt-0.5" />
                <span>
                  Your payment information is encrypted and secure. We never store full card details.
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Link href={`/tracking/${bookingId}`} className="flex-1">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={state.isProcessing}
                    className="w-full"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  disabled={state.isProcessing || state.paymentStatus === 'success'}
                  className="flex-1 bg-primary hover:bg-primary/90"
                >
                  {state.isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : state.paymentStatus === 'success' ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 mr-2" />
                      Payment Complete
                    </>
                  ) : (
                    <>
                      <Lock className="h-4 w-4 mr-2" />
                      Pay ${total.toFixed(2)}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>

      <Footer />
    </main>
  );
}
