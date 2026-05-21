/**
 * Payment Transaction Management Utility
 * Handles mock payment transactions, validation, and persistence
 * Production-ready utility functions for payment operations
 */

export interface PaymentTransaction {
  id: string;
  bookingId: string;
  amount: number;
  serviceAmount: number;
  tax: number;
  cardLast4: string;
  timestamp: string;
  status: 'completed' | 'failed' | 'pending';
  serviceName: string;
  providerName: string;
  metadata?: Record<string, any>;
}

export interface PaymentRequest {
  bookingId: string;
  serviceAmount: number;
  serviceName: string;
  providerName: string;
  serviceDate?: string;
  serviceTime?: string;
  address?: string;
}

const STORAGE_KEY = 'paymentTransactions';
const BOOKING_STORAGE_KEY = 'confirmedBooking';

/**
 * Get all payment transactions from localStorage
 */
export function getAllTransactions(): PaymentTransaction[] {
  try {
    const transactions = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(transactions) ? transactions : [];
  } catch (error) {
    console.error('Error retrieving transactions:', error);
    return [];
  }
}

/**
 * Get a specific payment transaction by booking ID
 */
export function getTransactionByBookingId(bookingId: string): PaymentTransaction | null {
  const transactions = getAllTransactions();
  return transactions.find((t) => t.bookingId === bookingId) || null;
}

/**
 * Check if a booking has been paid
 */
export function isBookingPaid(bookingId: string): boolean {
  const transaction = getTransactionByBookingId(bookingId);
  return transaction?.status === 'completed';
}

/**
 * Save a payment transaction
 */
export function saveTransaction(transaction: PaymentTransaction): void {
  try {
    const transactions = getAllTransactions();
    const existingIndex = transactions.findIndex((t) => t.bookingId === transaction.bookingId);

    if (existingIndex >= 0) {
      transactions[existingIndex] = transaction;
    } else {
      transactions.push(transaction);
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (error) {
    console.error('Error saving transaction:', error);
  }
}

/**
 * Update booking with payment information
 */
export function updateBookingWithPayment(bookingId: string, transactionId: string, paidAmount: number): void {
  try {
    const booking = JSON.parse(localStorage.getItem(BOOKING_STORAGE_KEY) || '{}');
    booking.paymentStatus = 'completed';
    booking.transactionId = transactionId;
    booking.paidAmount = paidAmount;
    booking.paymentDate = new Date().toISOString();
    localStorage.setItem(BOOKING_STORAGE_KEY, JSON.stringify(booking));
  } catch (error) {
    console.error('Error updating booking:', error);
  }
}

/**
 * Get payment summary for admin/analytics
 */
export function getPaymentSummary() {
  const transactions = getAllTransactions();
  const completed = transactions.filter((t) => t.status === 'completed');

  return {
    totalTransactions: transactions.length,
    completedTransactions: completed.length,
    failedTransactions: transactions.filter((t) => t.status === 'failed').length,
    totalAmount: completed.reduce((sum, t) => sum + t.amount, 0),
    totalTax: completed.reduce((sum, t) => sum + t.tax, 0),
    avgTransactionAmount: completed.length > 0 ? completed.reduce((sum, t) => sum + t.amount, 0) / completed.length : 0,
  };
}

/**
 * Get transactions within a date range
 */
export function getTransactionsByDateRange(startDate: Date, endDate: Date): PaymentTransaction[] {
  const transactions = getAllTransactions();
  return transactions.filter((t) => {
    const txDate = new Date(t.timestamp);
    return txDate >= startDate && txDate <= endDate;
  });
}

/**
 * Get transactions by payment status
 */
export function getTransactionsByStatus(status: 'completed' | 'failed' | 'pending'): PaymentTransaction[] {
  return getAllTransactions().filter((t) => t.status === status);
}

/**
 * Mock payment processing (for development)
 * Returns success with 90% probability
 */
export async function processMockPayment(
  bookingId: string,
  cardNumber: string,
  expiryDate: string,
  cvv: string,
  cardholderName: string,
  amount: number,
  serviceName: string,
  providerName: string
): Promise<{ success: boolean; transactionId?: string; error?: string }> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  // Mock validation
  if (!cardNumber || cardNumber.replace(/\s/g, '').length !== 16) {
    return { success: false, error: 'Invalid card number' };
  }

  if (!expiryDate || !/^\d{2}\/\d{2}$/.test(expiryDate)) {
    return { success: false, error: 'Invalid expiry date' };
  }

  if (!cvv || cvv.length !== 3) {
    return { success: false, error: 'Invalid CVV' };
  }

  // Mock success with 90% probability
  if (Math.random() > 0.1) {
    const transactionId = `TXN${Date.now()}`;
    const transaction: PaymentTransaction = {
      id: transactionId,
      bookingId,
      amount,
      serviceAmount: Math.round(amount / 1.1 * 100) / 100,
      tax: amount - Math.round(amount / 1.1 * 100) / 100,
      cardLast4: cardNumber.slice(-4),
      timestamp: new Date().toISOString(),
      status: 'completed',
      serviceName,
      providerName,
    };

    saveTransaction(transaction);
    updateBookingWithPayment(bookingId, transactionId, amount);

    return { success: true, transactionId };
  } else {
    return { success: false, error: 'Card declined. Please try another card.' };
  }
}

/**
 * Clear all transactions (admin/testing only)
 */
export function clearAllTransactions(): void {
  if (process.env.NODE_ENV === 'development') {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Export transactions as CSV (for admin/reporting)
 */
export function exportTransactionsAsCSV(): string {
  const transactions = getAllTransactions();

  if (transactions.length === 0) {
    return '';
  }

  const headers = Object.keys(transactions[0]).join(',');
  const rows = transactions.map((t) =>
    Object.values(t)
      .map((v) => (typeof v === 'string' ? `"${v}"` : v))
      .join(',')
  );

  return [headers, ...rows].join('\n');
}
