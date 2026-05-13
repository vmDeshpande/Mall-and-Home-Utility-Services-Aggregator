'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/ui/star-rating';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  Clock,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  DollarSign,
} from 'lucide-react';
const timelineSteps = [
  {
    status: 'requested',
    label: 'Service Requested',
    icon: Clock,
  },
  {
    status: 'assigned',
    label: 'Provider Accepted',
    icon: CheckCircle2,
  },
  {
    status: 'in-progress',
    label: 'Service In Progress',
    icon: Clock,
  },
  {
    status: 'completed',
    label: 'Service Completed',
    icon: CheckCircle2,
  },
];

export default function TrackingPage() {
  const params = useParams<{ id: string }>();
  const [storedBooking, setStoredBooking] = useState<any>(null);
  const [remoteBooking, setRemoteBooking] = useState<any>(null);

  useEffect(() => {
    const stored = localStorage.getItem('confirmedBooking');
    if (stored) setStoredBooking(JSON.parse(stored));

    api.getRequest(params.id).then(setRemoteBooking).catch(() => null);
  }, []);

  const booking = useMemo(() => {
    if (remoteBooking) {
      const scheduled = remoteBooking.scheduledTime ? new Date(remoteBooking.scheduledTime) : null;

      return {
        id: remoteBooking._id,
        providerId: remoteBooking.providerId?._id || remoteBooking.providerId,
        serviceId: remoteBooking.serviceId?._id || remoteBooking.serviceId,
        date: scheduled ? scheduled.toLocaleDateString() : 'Instant request',
        time: scheduled
          ? scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          : '',
        address: remoteBooking.location?.address || 'Service address',
        status: remoteBooking.status,
        totalPrice: Number(remoteBooking.price ?? 0),
        createdAt: remoteBooking.createdAt,
        provider: remoteBooking.providerId,
      };
    }

    return {
      id: params.id,
      providerId: storedBooking?.providerId || '',
      serviceId: storedBooking?.serviceId || '',
      date: storedBooking?.date || 'Scheduled date',
      time: storedBooking?.time || '',
      address: storedBooking?.location || 'Service address',
      status: 'requested' as const,
      totalPrice: Number(storedBooking?.total ?? 0),
      createdAt: new Date().toISOString(),
    };
  }, [params.id, storedBooking, remoteBooking]);

  const remoteProvider = (booking as any).provider;
  const provider =
    (remoteProvider
      ? {
          id: remoteProvider._id,
          name: remoteProvider.userId?.name || 'Service Provider',
          avatar: remoteProvider.userId?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg',
          rating: remoteProvider.rating || 0,
          category: remoteProvider.services?.[0]?.serviceId?.name || 'utility',
          availability: remoteProvider.online ? 'Available now' : remoteProvider.availabilityType,
          completedJobs: remoteProvider.totalJobs || 0,
          phone: remoteProvider.userId?.phone,
          email: remoteProvider.userId?.email,
        }
      : null) ||
    {
      id: booking.providerId,
      name: storedBooking?.providerName || 'Service Provider',
      avatar:
        storedBooking?.providerAvatar ||
        'https://api.dicebear.com/7.x/avataaars/svg?seed=Provider',
      rating: 0,
      category: 'utility',
      availability: 'Awaiting provider response',
      completedJobs: 0,
    };

  const trackingStatus = booking.status === 'accepted' ? 'assigned' : booking.status;
  const currentStepIndex = Math.max(0, timelineSteps.findIndex((step) => step.status === trackingStatus));
  const canContactProvider = ['assigned', 'accepted', 'in-progress', 'completed'].includes(booking.status);
  const progress = ((currentStepIndex + 1) / timelineSteps.length) * 100;

  return (
    <main className="bg-background min-h-screen">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Service Tracking</h1>
          <p className="text-muted-foreground">Booking ID: #{booking.id}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Timeline */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-border mb-8">
              <h2 className="text-2xl font-bold mb-8">Service Status</h2>

              {/* Progress Bar */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-semibold text-foreground">Overall Progress</h3>
                    <p className="text-sm text-muted-foreground">
                      {currentStepIndex + 1} of {timelineSteps.length} steps
                    </p>
                  </div>
                  <span className="text-lg font-bold text-primary">{Math.round(progress)}%</span>
                </div>
                <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Timeline */}
              <div className="space-y-6">
                {timelineSteps.map((step, index) => {
                  const StepIcon = step.icon;
                  const isCompleted = index <= currentStepIndex;
                  const isCurrent = index === currentStepIndex;

                  return (
                    <div key={step.status} className="flex gap-6">
                      {/* Timeline Dot */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all ${
                            isCompleted
                              ? 'bg-accent border-accent text-accent-foreground'
                              : 'border-muted bg-muted text-muted-foreground'
                          }`}
                        >
                          <StepIcon className="h-5 w-5" />
                        </div>
                        {index < timelineSteps.length - 1 && (
                          <div
                            className={`w-1 h-16 mt-2 rounded-full ${
                              index < currentStepIndex
                                ? 'bg-accent'
                                : 'bg-muted'
                            }`}
                          ></div>
                        )}
                      </div>

                      {/* Timeline Content */}
                      <div className="pb-6 pt-1 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className={`font-semibold text-lg ${
                              isCurrent
                                ? 'text-primary'
                                : isCompleted
                                  ? 'text-foreground'
                                  : 'text-muted-foreground'
                            }`}>
                              {step.label}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1">
                              {isCurrent && 'In progress...'}
                              {isCompleted && !isCurrent && 'Completed'}
                              {!isCompleted && 'Pending'}
                            </p>
                          </div>
                          {isCompleted && (
                            <Badge className={
                              isCurrent
                                ? 'bg-primary/20 text-primary'
                                : 'bg-accent/10 text-accent'
                            }>
                              {isCurrent ? 'Active' : 'Done'}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Service Details */}
            <Card className="p-8 border-border">
              <h2 className="text-2xl font-bold mb-6">Service Details</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Service Date</label>
                    <p className="font-semibold text-foreground">{booking.date}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground block mb-2">Service Time</label>
                    <p className="font-semibold text-foreground">{booking.time}</p>
                  </div>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Service Address
                  </label>
                  <p className="font-semibold text-foreground">{booking.address}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2 flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Amount
                  </label>
                  <p className="text-2xl font-bold text-primary">${booking.totalPrice}</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Provider Info Sidebar */}
          <div className="lg:col-span-1">
            {/* Provider Card */}
            <Card className="p-8 border-border mb-8">
              <h3 className="text-xl font-bold mb-6">Service Provider</h3>

              <div className="flex flex-col items-center gap-4 mb-6 pb-6 border-b border-border">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="h-20 w-20 rounded-full object-cover border-4 border-primary"
                />
                <div className="text-center">
                  <h4 className="font-bold text-lg text-foreground">{provider.name}</h4>
                  <p className="text-sm text-muted-foreground capitalize">{provider.category}</p>
                  <StarRating rating={provider.rating} size="sm" className="justify-center mt-2" />
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Availability</p>
                    <p className="font-semibold text-sm text-foreground">{provider.availability}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted">
                  <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Jobs Completed</p>
                    <p className="font-semibold text-sm text-foreground">{provider.completedJobs}</p>
                  </div>
                </div>
              </div>
            </Card>

            {/* Contact Card */}
            <Card className="p-8 border-border mb-8">
              <h3 className="text-lg font-bold mb-4">Contact Provider</h3>
              <div className="space-y-3">
                {!canContactProvider ? (
                  <div className="rounded-lg border border-border bg-muted p-4 text-sm text-muted-foreground">
                    Provider contact is available after the provider accepts your request.
                  </div>
                ) : (provider as any).phone ? (
                  <>
                    <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                      <a href={`sms:${(provider as any).phone}`}>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Send Message
                      </a>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-border">
                      <a href={`tel:${(provider as any).phone}`}>
                        <Phone className="h-5 w-5 mr-2" />
                        Call Provider
                      </a>
                    </Button>
                  </>
                ) : (provider as any).email ? (
                  <Button asChild className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    <a href={`mailto:${(provider as any).email}?subject=Service request ${booking.id}`}>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Email Provider
                    </a>
                  </Button>
                ) : (
                  <>
                    <Button disabled className="w-full">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      No Message Contact
                    </Button>
                    <Button disabled variant="outline" className="w-full border-border">
                      <Phone className="h-5 w-5 mr-2" />
                      No Phone Available
                    </Button>
                  </>
                )}
              </div>
            </Card>

            {/* Quick Actions */}
            {booking.status === 'completed' && (
              <Card className="p-8 border-border">
                <h3 className="text-lg font-bold mb-4">Rate Service</h3>
                <Link href={`/providers/${provider.id}?booking=${booking.id}`} className="w-full block">
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                    Open Provider Profile
                  </Button>
                </Link>
              </Card>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
