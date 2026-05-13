'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { Calendar, Clock, DollarSign, Mail, MapPin, MessageSquare, Phone, User } from 'lucide-react';

export default function ProviderJobDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [job, setJob] = useState<any>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadJob = async () => {
      try {
        const data = await api.getRequest(params.id);
        setJob(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load job details');
      } finally {
        setIsLoading(false);
      }
    };

    loadJob();
  }, [params.id]);

  const updateStatus = async (status: string) => {
    try {
      const updated = await api.updateRequestStatus(params.id, status);
      setJob(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update job status');
    }
  };

  const scheduled = job?.scheduledTime ? new Date(job.scheduledTime) : null;
  const customer = job?.userId || {};
  const service = job?.serviceId || {};
  const history = job
    ? [
        { label: 'Requested', value: job.requestedAt || job.createdAt },
        { label: 'Accepted / Assigned', value: job.acceptedAt },
        { label: 'Last Updated', value: job.updatedAt },
        { label: 'Completed', value: job.completedAt },
      ].filter((item) => item.value)
    : [];

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar type="provider" />

      <main className="flex-1">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Job #{params.id.slice(-6).toUpperCase()}</p>
              <h1 className="text-3xl font-bold">Job Details</h1>
            </div>
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </Card>
          )}

          {isLoading ? (
            <Card className="p-12 text-center text-muted-foreground">Loading job details...</Card>
          ) : !job ? (
            <Card className="p-12 text-center text-muted-foreground">Job not found.</Card>
          ) : (
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
              <div className="space-y-8 lg:col-span-2">
                <Card className="p-8">
                  <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <h2 className="text-2xl font-bold">{service.name || job.serviceType || 'Utility Service'}</h2>
                      <p className="text-muted-foreground">{job.notes || 'No additional customer notes.'}</p>
                    </div>
                    <StatusBadge status={job.status} />
                  </div>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        Scheduled Date
                      </div>
                      <p className="font-semibold">{scheduled ? scheduled.toLocaleDateString() : 'Instant request'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        Scheduled Time
                      </div>
                      <p className="font-semibold">
                        {scheduled ? scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'As soon as possible'}
                      </p>
                    </div>
                    <div className="rounded-lg border border-border p-4 md:col-span-2">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        Service Address
                      </div>
                      <p className="font-semibold">{job.location?.address || 'No address provided'}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        Service Value
                      </div>
                      <p className="text-xl font-bold text-primary">${Number(job.price || 0).toFixed(2)}</p>
                    </div>
                    <div className="rounded-lg border border-border p-4">
                      <div className="mb-2 text-sm text-muted-foreground">Request Type</div>
                      <p className="font-semibold capitalize">{job.requestType || 'scheduled'}</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-8">
                  <h2 className="mb-4 text-xl font-bold">Job Actions</h2>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    {job.status === 'requested' && (
                      <>
                        <Button onClick={() => updateStatus('assigned')} className="bg-accent hover:bg-accent/90">
                          Accept Job
                        </Button>
                        <Button onClick={() => updateStatus('rejected')} variant="destructive">
                          Reject Job
                        </Button>
                      </>
                    )}
                    {['assigned', 'accepted'].includes(job.status) && (
                      <Button onClick={() => updateStatus('in-progress')}>Start Job</Button>
                    )}
                    {job.status === 'in-progress' && (
                      <Button onClick={() => updateStatus('completed')}>Mark Complete</Button>
                    )}
                    <Link href="/provider/requests">
                      <Button variant="outline" className="w-full">All Requests</Button>
                    </Link>
                  </div>
                </Card>

                <Card className="p-8">
                  <h2 className="mb-6 text-xl font-bold">Job History</h2>
                  <div className="space-y-4">
                    {history.map((item) => (
                      <div key={item.label} className="flex gap-4">
                        <div className="mt-1 h-3 w-3 rounded-full bg-primary" />
                        <div>
                          <p className="font-semibold">{item.label}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(item.value).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              <div className="space-y-6">
                <Card className="p-8">
                  <h2 className="mb-6 text-xl font-bold">Customer</h2>
                  <div className="mb-6 flex items-center gap-4">
                    <img
                      src={customer.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer._id || params.id}`}
                      alt={customer.name || 'Customer'}
                      className="h-14 w-14 rounded-full border border-border object-cover"
                    />
                    <div>
                      <p className="font-semibold">{customer.name || 'Customer'}</p>
                      <p className="text-sm text-muted-foreground">{customer.email || 'No email provided'}</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {customer.phone ? (
                      <>
                        <Button asChild className="w-full">
                          <a href={`tel:${customer.phone}`}>
                            <Phone className="h-4 w-4" />
                            Call Customer
                          </a>
                        </Button>
                        <Button asChild variant="outline" className="w-full">
                          <a href={`sms:${customer.phone}`}>
                            <MessageSquare className="h-4 w-4" />
                            Message Customer
                          </a>
                        </Button>
                      </>
                    ) : (
                      <Button disabled variant="outline" className="w-full">
                        <Phone className="h-4 w-4" />
                        No Phone Available
                      </Button>
                    )}
                    {customer.email && (
                      <Button asChild variant="outline" className="w-full">
                        <a href={`mailto:${customer.email}?subject=Service request ${params.id.slice(-6).toUpperCase()}`}>
                          <Mail className="h-4 w-4" />
                          Email Customer
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>

                <Card className="p-8">
                  <h2 className="mb-4 text-xl font-bold">Provider Notes</h2>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div className="flex gap-2">
                      <User className="mt-0.5 h-4 w-4" />
                      Confirm address and access details before travelling.
                    </div>
                    <div className="flex gap-2">
                      <Clock className="mt-0.5 h-4 w-4" />
                      Update the job status so the customer tracking page stays accurate.
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
