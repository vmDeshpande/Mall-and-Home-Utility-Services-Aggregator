'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import { api } from '@/lib/api';
import { TrendingUp, Download, Wallet, Clock, CheckCircle, Briefcase } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

type ProviderRequest = {
  _id: string;
  status: string;
  price?: number;
  createdAt?: string;
  completedAt?: string;
  scheduledTime?: string;
  serviceType?: string;
  serviceId?: { name?: string };
  userId?: { name?: string };
};

const monthKey = (date: Date) => `${date.getFullYear()}-${date.getMonth()}`;
const monthLabel = (date: Date) => date.toLocaleString(undefined, { month: 'short' });

export default function EarningsPage() {
  const [requests, setRequests] = useState<ProviderRequest[]>([]);
  const [provider, setProvider] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadEarnings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?._id) {
          setError('Sign in as a provider to view earnings.');
          return;
        }

        const providerProfile = await api.getProvider(user._id);
        setProvider(providerProfile);
        const data = await api.getRequests({ providerId: providerProfile._id });
        setRequests(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unable to load earnings');
      } finally {
        setIsLoading(false);
      }
    };

    loadEarnings();
  }, []);

  const completedRequests = useMemo(
    () => requests.filter((request) => request.status === 'completed'),
    [requests],
  );

  const activeRequests = useMemo(
    () => requests.filter((request) => ['assigned', 'accepted', 'in-progress'].includes(request.status)),
    [requests],
  );

  const totalEarnings = completedRequests.reduce((sum, request) => sum + Number(request.price || 0), 0);
  const pendingValue = activeRequests.reduce((sum, request) => sum + Number(request.price || 0), 0);
  const now = new Date();
  const thisMonthEarnings = completedRequests
    .filter((request) => {
      const date = new Date(request.completedAt || request.createdAt || '');
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    })
    .reduce((sum, request) => sum + Number(request.price || 0), 0);

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, index) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { key: monthKey(date), month: monthLabel(date), earnings: 0 };
    });

    completedRequests.forEach((request) => {
      const date = new Date(request.completedAt || request.createdAt || '');
      const item = months.find((month) => month.key === monthKey(date));
      if (item) item.earnings += Number(request.price || 0);
    });

    return months;
  }, [completedRequests]);

  const serviceBreakdown = useMemo(() => {
    const totals = completedRequests.reduce<Record<string, number>>((acc, request) => {
      const name = request.serviceId?.name || request.serviceType || 'Utility Service';
      acc[name] = (acc[name] || 0) + Number(request.price || 0);
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [completedRequests]);

  const exportReport = () => {
    const header = 'Request ID,Customer,Service,Completed,Amount,Status';
    const rows = completedRequests.map((request) =>
      [
        request._id,
        request.userId?.name || 'Customer',
        request.serviceId?.name || request.serviceType || 'Utility Service',
        request.completedAt ? new Date(request.completedAt).toLocaleDateString() : '',
        Number(request.price || 0).toFixed(2),
        request.status,
      ].join(','),
    );
    const csv = [header, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'provider-earnings.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background md:flex-row">
      <Sidebar type="provider" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Earnings</h1>
              <p className="text-muted-foreground">Completed job value and manual settlement reporting</p>
            </div>
            <Button onClick={exportReport} disabled={!completedRequests.length}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>

          {error && (
            <Card className="mb-6 border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
              {error}
            </Card>
          )}

          {isLoading ? (
            <Card className="p-12 text-center text-muted-foreground">Loading earnings...</Card>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card className="p-6 border-border">
                  <p className="text-sm text-muted-foreground mb-2">Total Completed Value</p>
                  <p className="text-3xl font-bold text-foreground mb-2">${totalEarnings.toFixed(2)}</p>
                  <p className="text-xs text-accent">All completed jobs</p>
                </Card>
                <Card className="p-6 border-border">
                  <p className="text-sm text-muted-foreground mb-2">This Month</p>
                  <p className="text-3xl font-bold text-foreground mb-2">${thisMonthEarnings.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{completedRequests.length} completed total</p>
                </Card>
                <Card className="p-6 border-border bg-accent/5 border-accent/30">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Pending Job Value</p>
                      <p className="text-3xl font-bold text-foreground">${pendingValue.toFixed(2)}</p>
                    </div>
                    <Wallet className="h-8 w-8 text-accent opacity-50" />
                  </div>
                </Card>
                <Card className="p-6 border-border">
                  <p className="text-sm text-muted-foreground mb-2">Rating</p>
                  <p className="text-3xl font-bold text-foreground mb-2">{provider?.rating || 0}/5</p>
                  <p className="text-xs text-muted-foreground">{provider?.reviewCount || 0} reviews</p>
                </Card>
              </div>

              <div className="mb-8 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm text-blue-900 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-100">
                Phase 1 does not process online payments. This page tracks completed service value for admin/manual settlement.
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <Card className="p-6 border-border">
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    Monthly Completed Value
                  </h2>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                      <XAxis dataKey="month" stroke="var(--muted-foreground)" />
                      <YAxis stroke="var(--muted-foreground)" />
                      <Tooltip />
                      <Line type="monotone" dataKey="earnings" stroke="var(--primary)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>

                <Card className="p-6 border-border">
                  <h2 className="text-lg font-semibold mb-4">Service Breakdown</h2>
                  {serviceBreakdown.length ? (
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={serviceBreakdown}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                        <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                        <YAxis stroke="var(--muted-foreground)" />
                        <Tooltip />
                        <Bar dataKey="value" fill="var(--accent)" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-[300px] items-center justify-center text-muted-foreground">
                      No completed jobs yet.
                    </div>
                  )}
                </Card>
              </div>

              <Card className="p-6 border-border">
                <h2 className="text-lg font-semibold mb-6">Completed Transactions</h2>
                {completedRequests.length ? (
                  <div className="space-y-3">
                    {completedRequests.map((request) => (
                      <Link
                        key={request._id}
                        href={`/provider/jobs/${request._id}`}
                        className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-muted"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-foreground">{request.serviceId?.name || request.serviceType || 'Utility Service'}</p>
                          <p className="text-sm text-muted-foreground">{request.userId?.name || 'Customer'}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-foreground">+${Number(request.price || 0).toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {request.completedAt ? new Date(request.completedAt).toLocaleDateString() : 'Completed'}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="grid gap-4 py-8 text-center text-muted-foreground">
                    <CheckCircle className="mx-auto h-10 w-10 opacity-50" />
                    <p>Completed jobs will appear here once customers finish service requests.</p>
                    <Link href="/provider/requests">
                      <Button variant="outline">View Requests</Button>
                    </Link>
                  </div>
                )}
              </Card>

              <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card className="p-5">
                  <div className="flex items-center gap-3">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Active Jobs</p>
                      <p className="font-semibold">{activeRequests.length}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Pending Settlement</p>
                      <p className="font-semibold">${pendingValue.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm text-muted-foreground">Verification</p>
                      <Badge variant="outline" className="mt-1 capitalize">{provider?.verification?.status || 'pending'}</Badge>
                    </div>
                  </div>
                </Card>
              </div>
            </>
          )}
        </div>

        <Footer />
      </main>
    </div>
  );
}
