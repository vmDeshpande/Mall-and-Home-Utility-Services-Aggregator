'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StatusBadge } from '@/components/ui/status-badge';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { Users, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';

const statusColors = ['#3b82f6', '#8b5cf6', '#f59e0b', '#10b981', '#ef4444', '#64748b'];

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const summary = analytics?.summary || {};
  const bookingTrendData = analytics?.trend || [];
  const statusData = (analytics?.statusDistribution || []).map((item: any, index: number) => ({
    ...item,
    name: item.name.replaceAll('-', ' '),
    fill: statusColors[index % statusColors.length],
  }));
  const revenueData = (analytics?.categoryBreakdown || []).map((item: any) => ({
    category: item.name,
    revenue: item.value,
  }));
  const stats = [
    {
      label: 'Total Bookings',
      value: summary.totalRequests || 0,
      change: 'All service requests',
      icon: Briefcase,
      color: 'text-primary',
    },
    {
      label: 'Verified Providers',
      value: summary.verifiedProviders || 0,
      change: `${summary.totalProviders || 0} registered`,
      icon: Users,
      color: 'text-accent',
    },
    {
      label: 'Completed Services',
      value: summary.completedRequests || 0,
      change: `${summary.completionRate || 0}% completion rate`,
      icon: CheckCircle,
      color: 'text-accent',
    },
    {
      label: 'Pending Requests',
      value: summary.pendingRequests || 0,
      change: 'Awaiting provider action',
      icon: AlertCircle,
      color: 'text-primary',
    },
  ];
  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background">
      <Sidebar type="admin" />

      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Platform overview and analytics</p>
          </div>

          {/* Stats Grid */}
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

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Booking Trends */}
            <Card className="p-8 border-border">
              <h2 className="text-xl font-bold mb-6">Booking Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={bookingTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#4f46e5"
                    strokeWidth={2}
                    dot={{ fill: '#4f46e5', r: 4 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="#10b981"
                    strokeWidth={2}
                    dot={{ fill: '#10b981', r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            {/* Status Distribution */}
            <Card className="p-8 border-border">
              <h2 className="text-xl font-bold mb-6">Service Status Distribution</h2>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry: any) => `${entry.name}: ${entry.value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {statusData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Revenue by Category */}
          <Card className="p-8 border-border mb-8">
            <h2 className="text-xl font-bold mb-6">Revenue by Category</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="revenue" fill="#4f46e5" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Recent Bookings */}
          <Card className="p-8 border-border">
            <h2 className="text-xl font-bold mb-6">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">ID</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Address</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-right py-3 px-4 font-semibold text-foreground">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {(analytics?.recentRequests || []).map((booking: any) => (
                    <tr key={booking._id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="py-3 px-4 font-semibold text-foreground">#{booking._id.slice(-6).toUpperCase()}</td>
                      <td className="py-3 px-4 text-muted-foreground">
                        {booking.scheduledTime
                          ? new Date(booking.scheduledTime).toLocaleDateString()
                          : new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground line-clamp-1">
                        {booking.location?.address || 'No address'}
                      </td>
                      <td className="py-3 px-4">
                        <StatusBadge status={booking.status} size="sm" />
                      </td>
                      <td className="py-3 px-4 text-right font-semibold text-primary">
                        ${Number(booking.price || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        <Footer />
      </main>
    </div>
  );
}
