'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import { DollarSign, CheckCircle, Clock, Briefcase, TrendingUp, AlertCircle, MapPin } from 'lucide-react';

type ProviderJob = {
  id: string;
  customerName: string;
  service: string;
  date: string;
  time: string;
  address: string;
  status: 'requested' | 'assigned' | 'accepted' | 'rejected' | 'in-progress' | 'completed' | 'cancelled';
  price: number;
  notes?: string;
};

const mapJob = (request: any): ProviderJob => {
  const scheduled = request.scheduledTime ? new Date(request.scheduledTime) : null;

  return {
    id: request._id,
    customerName: request.userId?.name || 'Customer',
    service: request.serviceId?.name || request.serviceType || 'Utility Service',
    date: scheduled ? scheduled.toLocaleDateString() : 'Instant request',
    time: scheduled ? scheduled.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
    address: request.location?.address || 'No address provided',
    status: request.status,
    price: Number(request.price || 0),
    notes: request.notes,
  };
};

export default function ProviderDashboard() {
  const [jobs, setJobs] = useState<ProviderJob[]>([]);
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadDashboard = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (!user?._id) {
        setError('Sign in as a provider to view your dashboard.');
        return;
      }

      const providerProfile = await api.getProvider(user._id);
      setProvider(providerProfile);

      const data = await api.getRequests({ providerId: providerProfile._id });
      setJobs(data.map(mapJob));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load provider dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const updateJobStatus = async (id: string, status: ProviderJob['status']) => {
    const previous = jobs;
    setJobs((current) => current.map((job) => (job.id === id ? { ...job, status } : job)));

    try {
      const updated = await api.updateRequestStatus(id, status);
      setJobs((current) => current.map((job) => (job.id === id ? mapJob(updated) : job)));
    } catch (err) {
      setJobs(previous);
      setError(err instanceof Error ? err.message : 'Unable to update job status');
    }
  };

  const incomingRequests = useMemo(() => jobs.filter((job) => job.status === 'requested'), [jobs]);
  const activeJobs = useMemo(
    () => jobs.filter((job) => ['assigned', 'accepted', 'in-progress'].includes(job.status)),
    [jobs],
  );
  const completedJobs = useMemo(() => jobs.filter((job) => job.status === 'completed'), [jobs]);
  const totalEarnings = completedJobs.reduce((sum, job) => sum + job.price, 0);
  const completionRate = jobs.length ? Math.round((completedJobs.length / jobs.length) * 100) : 0;

  const stats = [
    {
      label: 'Completed Value',
      value: `$${totalEarnings.toFixed(0)}`,
      change: `${completedJobs.length} completed jobs`,
      icon: DollarSign,
      color: 'text-accent',
    },
    {
      label: 'Active Jobs',
      value: String(activeJobs.length),
      change: `${incomingRequests.length} pending requests`,
      icon: Briefcase,
      color: 'text-primary',
    },
    {
      label: 'Total Jobs',
      value: String(provider?.totalJobs || completedJobs.length),
      change: `${completionRate}% completion rate`,
      icon: CheckCircle,
      color: 'text-accent',
    },
    {
      label: 'Average Rating',
      value: `${provider?.rating || 0}/5`,
      change: `From ${provider?.reviewCount || 0} reviews`,
      icon: TrendingUp,
      color: 'text-primary',
    },
  ];

  const renderJob = (job: ProviderJob, mode: 'incoming' | 'active') => (
    <div key={job.id} className="p-4 rounded-lg border border-border hover:bg-muted transition-colors">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-foreground">{job.service}</h3>
          <p className="text-sm text-muted-foreground">{job.customerName}</p>
        </div>
        <StatusBadge status={job.status} size="sm" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4 text-sm">
        <div>
          <p className="text-muted-foreground">Schedule</p>
          <p className="font-semibold text-foreground">{job.date}{job.time ? `, ${job.time}` : ''}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Amount</p>
          <p className="font-semibold text-primary">${job.price.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-muted-foreground">Request ID</p>
          <p className="font-semibold text-foreground">#{job.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="mb-4 flex items-start gap-2 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <span>{job.address}</span>
      </div>

      {job.notes && <p className="mb-4 rounded-md bg-background p-3 text-sm text-muted-foreground">{job.notes}</p>}

      {mode === 'incoming' ? (
        <div className="flex gap-2">
          <Button onClick={() => updateJobStatus(job.id, 'assigned')} className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground">
            Accept
          </Button>
          <Button onClick={() => updateJobStatus(job.id, 'rejected')} variant="outline" className="flex-1 border-border hover:bg-muted">
            Decline
          </Button>
        </div>
      ) : (
        <div className="flex gap-2">
          {job.status !== 'in-progress' && (
            <Button onClick={() => updateJobStatus(job.id, 'in-progress')} className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground">
              Start
            </Button>
          )}
          {job.status === 'in-progress' && (
            <Button onClick={() => updateJobStatus(job.id, 'completed')} className="flex-1">
              Complete
            </Button>
          )}
          <Link href={`/provider/jobs/${job.id}`} className="flex-1">
            <Button variant="outline" className="w-full border-border">Details</Button>
          </Link>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar type="provider" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Provider Dashboard</h1>
              <p className="text-muted-foreground">Manage requests, active jobs, and service performance</p>
            </div>
            {provider?.verification?.status && (
              <Badge className={provider.verification.status === 'approved' ? 'bg-accent/10 text-accent' : 'bg-yellow-100 text-yellow-800'}>
                Verification: {provider.verification.status}
              </Badge>
            )}
          </div>

          {error && (
            <Card className="mb-6 border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </Card>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat) => {
              const Icon = stat.icon;
              return (
                <Card key={stat.label} className="p-6 border-border">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon className={`h-6 w-6 ${stat.color}`} />
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{stat.value}</h3>
                  <p className="text-xs text-muted-foreground">{stat.change}</p>
                </Card>
              );
            })}
          </div>

          {isLoading ? (
            <Card className="p-12 text-center text-muted-foreground">Loading provider dashboard...</Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <Card className="p-8 border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Incoming Requests</h2>
                    <Badge className="bg-primary/10 text-primary">{incomingRequests.length} new</Badge>
                  </div>

                  {incomingRequests.length ? (
                    <div className="space-y-4">{incomingRequests.map((job) => renderJob(job, 'incoming'))}</div>
                  ) : (
                    <EmptyState icon={Clock} title="No incoming requests" description="New customer booking requests will appear here" />
                  )}
                </Card>

                <Card className="p-8 border-border">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold">Active Jobs</h2>
                    <Badge className="bg-primary/10 text-primary">{activeJobs.length} active</Badge>
                  </div>

                  {activeJobs.length ? (
                    <div className="space-y-4">{activeJobs.map((job) => renderJob(job, 'active'))}</div>
                  ) : (
                    <EmptyState icon={Briefcase} title="No active jobs" description="Accepted jobs will move here until completed" />
                  )}
                </Card>
              </div>

              <div className="lg:col-span-1 space-y-6">
                <Card className="p-8 border-border">
                  <h3 className="text-lg font-bold mb-4">Profile Readiness</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Services configured</span>
                      <span className="font-semibold">{provider?.services?.length || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Availability</span>
                      <span className="font-semibold capitalize">{provider?.availabilityType || 'Flexible'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Online</span>
                      <span className="font-semibold">{provider?.online ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </Card>

                <Card className="p-8 border-border bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
                  <h3 className="text-lg font-bold mb-4">Completed Value</h3>
                  <h4 className="text-3xl font-bold text-primary">${totalEarnings.toFixed(2)}</h4>
                  <p className="mt-2 text-sm text-muted-foreground">Phase 1 tracks earnings for manual settlement.</p>
                </Card>

                <Card className="p-8 border-border">
                  <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Link href="/provider/services">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">Manage Services</Button>
                    </Link>
                    <Link href="/provider/settings">
                      <Button variant="outline" className="w-full border-border">Update Availability</Button>
                    </Link>
                    <Link href="/provider/earnings">
                      <Button variant="outline" className="w-full border-border">View Earnings</Button>
                    </Link>
                  </div>
                </Card>

                {provider?.verification?.status !== 'approved' && (
                  <Card className="p-6 border-yellow-200 bg-yellow-50 text-yellow-900">
                    <div className="flex gap-3">
                      <AlertCircle className="h-5 w-5 flex-shrink-0" />
                      <p className="text-sm">
                        Your profile is pending admin verification. Customers can book approved providers only.
                      </p>
                    </div>
                  </Card>
                )}
              </div>
            </div>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
