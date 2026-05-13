'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { fallbackServices } from '@/lib/catalog';
import { api } from '@/lib/api';
import { mapApiProvider } from '@/lib/provider-transform';
import type { Provider } from '@/lib/types';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, Clock, MapPin, ClipboardCheck } from 'lucide-react';

type SavedAddress = {
  label?: string;
  address: string;
  isDefault?: boolean;
};

function BookingPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const providerId = searchParams.get('provider');
  const [provider, setProvider] = useState<Provider | null>(null);

  const [selectedService, setSelectedService] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [address, setAddress] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const [data, profile] = await Promise.all([
          api.getProviders(),
          user?._id ? api.getProfile(user._id).catch(() => user) : Promise.resolve(user),
        ]);
        const mapped = data.map(mapApiProvider);
        const found = mapped.find((item: Provider) => item.id === providerId);
        if (found) setProvider(found);

        const addresses = Array.isArray(profile?.addresses)
          ? profile.addresses.filter((item: SavedAddress) => item?.address)
          : [];
        setSavedAddresses(addresses);

        const defaultAddress = addresses.find((item: SavedAddress) => item.isDefault) || addresses[0];
        if (defaultAddress?.address) setAddress(defaultAddress.address);
      } catch (err) {
        console.error(err);
      }
    };

    loadInitialData();
  }, [providerId]);

  const providerServices = useMemo(
    () =>
      provider?.services?.length
        ? provider.services
        : provider
          ? fallbackServices.filter((s) => s.category === provider.category)
          : [],
    [provider],
  );

  const selectedServiceData = providerServices.find((s) => s.id === selectedService);
  const servicePrice = selectedServiceData?.price || 0;
  const subtotal = servicePrice;
  const tax = Math.round(subtotal * 0.1 * 100) / 100;
  const total = subtotal + tax;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const objectIdPattern = /^[a-f\d]{24}$/i;
    const bookingDraft = {
      providerId,
      providerName: provider?.name,
      providerAvatar: provider?.avatar,
      serviceId: selectedService,
      serviceType: selectedServiceData?.name,
      scheduledTime: new Date(`${selectedDate}T${selectedTime}`).toISOString(),
      date: selectedDate,
      time: selectedTime,
      location: address,
      notes,
      subtotal,
      tax,
      total,
      status: 'requested',
    };

    let bookingId = `REQ${Math.random().toString(36).slice(2, 10).toUpperCase()}`;

    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');

      if (
        user?._id &&
        objectIdPattern.test(providerId || '') &&
        objectIdPattern.test(selectedService)
      ) {
        const created = await api.createRequest({
          userId: user._id,
          providerId,
          serviceId: selectedService,
          serviceType: selectedServiceData?.name,
          scheduledTime: bookingDraft.scheduledTime,
          location: { address },
          price: total,
          notes,
        });

        bookingId = created._id || bookingId;
      }
    } catch (err) {
      console.error(err);
    }

    localStorage.setItem(
      'confirmedBooking',
      JSON.stringify({ ...bookingDraft, bookingId }),
    );

    setIsSubmitting(false);
    router.push(`/booking/confirmation/${bookingId}`);
  };

  if (!provider) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center border-border">
          <h1 className="text-2xl font-bold mb-2">Provider not found</h1>
          <p className="text-muted-foreground mb-6">The provider you&apos;re looking for doesn&apos;t exist.</p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <a href="/providers">Back to providers</a>
          </Button>
        </Card>
        <Footer />
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-2">Book a Service</h1>
        <p className="text-muted-foreground mb-12">Complete your booking with the selected provider</p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-border">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Service Selection */}
                <div className="space-y-4">
                  <h2 className="text-xl font-bold">1. Select Service</h2>
                  <div className="space-y-3">
                    {providerServices.map((service) => (
                      <label
                        key={service.id}
                        className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                          selectedService === service.id
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="service"
                          value={service.id}
                          checked={selectedService === service.id}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-4 h-4"
                        />
                        <div className="ml-4 flex-1">
                          <div className="font-semibold text-foreground">{service.name}</div>
                          <p className="text-sm text-muted-foreground">{service.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">Duration: {service.duration}</p>
                        </div>
                        <div className="text-lg font-bold text-primary">${service.price}</div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Date & Time */}
                <div className="space-y-4 border-t border-border pt-8">
                  <h2 className="text-xl font-bold">2. Choose Date & Time</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="date" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Date
                      </Label>
                      <Input
                        id="date"
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        required
                        className="border-border"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="time" className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        Time
                      </Label>
                      <Input
                        id="time"
                        type="time"
                        value={selectedTime}
                        onChange={(e) => setSelectedTime(e.target.value)}
                        required
                        className="border-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="space-y-4 border-t border-border pt-8">
                  <h2 className="text-xl font-bold">3. Service Address</h2>
                  <div className="space-y-2">
                    <Label htmlFor="address" className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Full Address
                    </Label>
                    {savedAddresses.length > 0 && (
                      <Select value={address} onValueChange={setAddress}>
                        <SelectTrigger className="border-border">
                          <SelectValue placeholder="Use a saved address" />
                        </SelectTrigger>
                        <SelectContent>
                          {savedAddresses.map((item, index) => (
                            <SelectItem key={`${item.address}-${index}`} value={item.address}>
                              {item.label || `Saved address ${index + 1}`} - {item.address}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                    <Input
                      id="address"
                      placeholder={savedAddresses.length ? 'Edit selected address or enter another address' : 'Enter your service address'}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="border-border"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Additional Notes (Optional)</Label>
                    <textarea
                      id="notes"
                      placeholder="Any specific instructions or requirements?"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-3 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary bg-background"
                      rows={4}
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="border-t border-border pt-8">
                  <Button
                    type="submit"
                    disabled={!selectedService || !selectedDate || !selectedTime || !address || isSubmitting}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting request...' : 'Submit Service Request'}
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Summary Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 border-border sticky top-24">
              <h3 className="text-xl font-bold mb-6">Booking Summary</h3>

              {/* Provider Info */}
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-border">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-foreground">{provider.name}</h4>
                  <StarRating rating={provider.rating} size="sm" className="text-xs" />
                </div>
              </div>

              {/* Order Details */}
              <div className="space-y-4 mb-6 pb-6 border-b border-border">
                {selectedServiceData && (
                  <>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium text-foreground">{selectedServiceData.name}</span>
                    </div>
                    {selectedDate && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date:</span>
                        <span className="font-medium text-foreground">
                          {new Date(selectedDate).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {selectedTime && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Time:</span>
                        <span className="font-medium text-foreground">{selectedTime}</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 mb-6 pb-6 border-b border-border">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="space-y-3">
                <h4 className="font-semibold text-sm flex items-center gap-2">
                  <ClipboardCheck className="h-4 w-4" />
                  Request Type
                </h4>
                <Badge className="bg-primary/10 text-primary w-full justify-center py-2">
                  Provider approval required
                </Badge>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}

export default function BookingPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-background" />}>
      <BookingPageContent />
    </Suspense>
  );
}
