'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { Calendar, Clock, MapPin, Search, Star, Heart, MessageSquare, AlertCircle } from 'lucide-react';

type RequestStatus = 'requested' | 'assigned' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';

type ServiceBooking = {
  id: string;
  providerId: string;
  providerName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: RequestStatus;
  totalPrice: number;
  avatar: string;
};

const formatRequest = (request: any): ServiceBooking => {
  const scheduled = request.scheduledTime ? new Date(request.scheduledTime) : null;
  const provider = request.providerId;

  return {
    id: request._id,
    providerId: provider?._id || provider,
    providerName: provider?.userId?.name || 'Waiting for provider',
    service: request.serviceId?.name || request.serviceType || 'Utility Service',
    date: scheduled ? scheduled.toLocaleDateString() : 'Instant request',
    time: scheduled ? scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    address: request.location?.address || 'No address provided',
    status: request.status,
    totalPrice: Number(request.price || 0),
    avatar:
      provider?.userId?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider?._id || request._id}`,
  };
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('active');
  const [bookings, setBookings] = useState<ServiceBooking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?._id) {
          setError('Sign in to view your service bookings.');
          return;
        }

        const data = await api.getRequests({ userId: user._id });
        setBookings(data.map(formatRequest));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load bookings');
      } finally {
        setIsLoading(false);
      }
    };

    loadBookings();
  }, []);

  const activeBookings = useMemo(
    () => bookings.filter((booking) => ['requested', 'assigned', 'accepted', 'in-progress'].includes(booking.status)),
    [bookings],
  );
  const pastServices = useMemo(
    () => bookings.filter((booking) => booking.status === 'completed'),
    [bookings],
  );
  const closedServices = useMemo(
    () => bookings.filter((booking) => ['rejected', 'cancelled'].includes(booking.status)),
    [bookings],
  );

  const renderBooking = (booking: ServiceBooking, mode: 'active' | 'past' | 'closed') => (
    <Card key={booking.id} className="p-6 hover:shadow-lg transition-shadow border-border">
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex gap-4 flex-1 min-w-0">
          <img
            src={booking.avatar}
            alt={booking.providerName}
            className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
          />
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="font-semibold text-lg text-foreground">{booking.service}</h3>
              <StatusBadge status={booking.status} size="sm" />
            </div>
            <p className="text-muted-foreground mb-3">{booking.providerName}</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {booking.date}{booking.time ? ` at ${booking.time}` : ''}
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span className="truncate">{booking.address}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full md:w-auto flex flex-col items-stretch md:items-end gap-3">
          <div className="text-lg font-bold text-foreground">${booking.totalPrice.toFixed(2)}</div>
          <div className="flex gap-2 flex-col md:flex-row">
            <Link href={`/tracking/${booking.id}`}>
              <Button size="sm" variant="outline" className="w-full md:w-auto">
                Track
              </Button>
            </Link>
            {mode === 'past' ? (
              <Link href={`/providers/${booking.providerId}?booking=${booking.id}`}>
                <Button size="sm" className="w-full md:w-auto">
                  <Star className="h-4 w-4 mr-2" />
                  Review
                </Button>
              </Link>
            ) : (
              <Button size="sm" variant="ghost" className="text-muted-foreground w-full md:w-auto" disabled>
                <MessageSquare className="h-4 w-4 mr-2" />
                Contact
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-lg text-muted-foreground">Track active services and review completed jobs</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/providers">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Book a Service
              </Button>
            </Link>
            <Link href="/profile">
              <Button variant="outline" className="border-border">
                My Profile
              </Button>
            </Link>
          </div>
        </div>

        {error && (
          <Card className="mb-6 border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
            {error}
          </Card>
        )}

        {isLoading ? (
          <Card className="p-12 text-center text-muted-foreground">Loading your bookings...</Card>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="active">
                Active <span className="ml-2 text-xs font-bold">{activeBookings.length}</span>
              </TabsTrigger>
              <TabsTrigger value="past">
                Completed <span className="ml-2 text-xs font-bold">{pastServices.length}</span>
              </TabsTrigger>
              <TabsTrigger value="closed">
                Closed <span className="ml-2 text-xs font-bold">{closedServices.length}</span>
              </TabsTrigger>
              <TabsTrigger value="favorites">Favorites</TabsTrigger>
            </TabsList>

            <TabsContent value="active" className="space-y-4">
              {activeBookings.length ? (
                activeBookings.map((booking) => renderBooking(booking, 'active'))
              ) : (
                <EmptyState icon={Search} title="No active bookings" description="Book a service to start tracking it here" />
              )}
            </TabsContent>

            <TabsContent value="past" className="space-y-4">
              {pastServices.length ? (
                pastServices.map((booking) => renderBooking(booking, 'past'))
              ) : (
                <EmptyState icon={Clock} title="No completed services" description="Completed jobs will appear here for reviews and history" />
              )}
            </TabsContent>

            <TabsContent value="closed" className="space-y-4">
              {closedServices.length ? (
                closedServices.map((booking) => renderBooking(booking, 'closed'))
              ) : (
                <EmptyState icon={AlertCircle} title="No closed requests" description="Rejected or cancelled requests will appear here" />
              )}
            </TabsContent>

            <TabsContent value="favorites" className="space-y-4">
              <Card className="p-12 text-center border-border">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">No saved favorites</h3>
                <p className="text-muted-foreground mb-6">Save trusted providers for quick future bookings</p>
                <Link href="/providers">
                  <Button className="bg-primary hover:bg-primary/90">Browse Providers</Button>
                </Link>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </main>
  );
}
