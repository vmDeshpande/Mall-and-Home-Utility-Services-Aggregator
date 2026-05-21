'use client';

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  CreditCard,
  Lock,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId: string;
  serviceAmount: number;
  serviceName: string;
  providerName: string;
  serviceDate?: string;
  serviceTime?: string;
  address?: string;
}

interface PaymentState {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
  isProcessing: boolean;
  paymentStatus: 'idle' | 'processing' | 'success' | 'error';
  errorMessage: string;
}

export function PaymentModal({
  isOpen,
  onClose,
  bookingId,
  serviceAmount,
  serviceName,
  providerName,
  serviceDate,
  serviceTime,
  address,
}: PaymentModalProps) {
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

        // Auto close modal after success
        setTimeout(() => {
          onClose();
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

  const handleCloseModal = () => {
    if (!state.isProcessing) {
      setState({
        cardNumber: '',
        expiryDate: '',
        cvv: '',
        cardholderName: '',
        isProcessing: false,
        paymentStatus: 'idle',
        errorMessage: '',
      });
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleCloseModal}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <CreditCard className="h-6 w-6 text-primary" />
            Secure Payment
          </DialogTitle>
          <DialogDescription>
            Complete your payment to confirm the service
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="space-y-4">
            <div className="bg-muted/50 rounded-lg p-4 space-y-3">
              <h3 className="font-semibold text-foreground text-lg">Order Summary</h3>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Service</span>
                  <span className="font-medium text-foreground">{serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Provider</span>
                  <span className="font-medium text-foreground">{providerName}</span>
                </div>
                {serviceDate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Date</span>
                    <span className="font-medium text-foreground">{serviceDate}</span>
                  </div>
                )}
                {serviceTime && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Time</span>
                    <span className="font-medium text-foreground">{serviceTime}</span>
                  </div>
                )}
                {address && (
                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">Location</span>
                    <span className="font-medium text-foreground text-right max-w-[150px]">
                      {address}
                    </span>
                  </div>
                )}
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${serviceAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold text-primary border-t border-border pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <Badge className="w-full justify-center py-2 bg-green-100 text-green-800 dark:bg-green-950/30 dark:text-green-400">
                <Lock className="h-3 w-3 mr-1" />
                Secure Transaction
              </Badge>
            </div>

            {/* Booking ID */}
            <div className="text-xs text-muted-foreground">
              <span className="font-medium">Booking ID:</span> #{bookingId}
            </div>
          </div>

          {/* Payment Form */}
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
                  Payment successful! Your booking is confirmed.
                </AlertDescription>
              </Alert>
            )}

            {/* Card Number */}
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
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseModal}
                disabled={state.isProcessing}
                className="flex-1"
              >
                Cancel
              </Button>
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
        </div>
      </DialogContent>
    </Dialog>
  );
}
