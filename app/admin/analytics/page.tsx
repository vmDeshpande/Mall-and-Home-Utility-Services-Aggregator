'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { api } from '@/lib/api';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import {
  TrendingUp,
  Users,
  Briefcase,
  DollarSign,
  BarChart3,
  Calendar,
  Download,
  Filter,
} from 'lucide-react';

// Mock data for analytics
const bookingTrendData = [
  { month: 'Jan', bookings: 120, completed: 110, cancelled: 10 },
  { month: 'Feb', bookings: 150, completed: 140, cancelled: 10 },
  { month: 'Mar', bookings: 200, completed: 185, cancelled: 15 },
  { month: 'Apr', bookings: 280, completed: 260, cancelled: 20 },
  { month: 'May', bookings: 320, completed: 300, cancelled: 20 },
  { month: 'Jun', bookings: 380, completed: 350, cancelled: 30 },
];

const revenueData = [
  { month: 'Jan', revenue: 4200 },
  { month: 'Feb', revenue: 5300 },
  { month: 'Mar', revenue: 7100 },
  { month: 'Apr', revenue: 9900 },
  { month: 'May', revenue: 11300 },
  { month: 'Jun', revenue: 13400 },
];

const categoryBreakdown = [
  { name: 'Plumbing', value: 28, fill: '#4F46E5' },
  { name: 'Electrician', value: 25, fill: '#10B981' },
  { name: 'Carpentry', value: 15, fill: '#EF4444' },
  { name: 'Tailor', value: 20, fill: '#F59E0B' },
  { name: 'Maintenance', value: 12, fill: '#8B5CF6' },
];

const providerGrowth = [
  { month: 'Jan', providers: 45, active: 38 },
  { month: 'Feb', providers: 62, active: 51 },
  { month: 'Mar', providers: 95, active: 78 },
  { month: 'Apr', providers: 145, active: 118 },
  { month: 'May', providers: 198, active: 162 },
  { month: 'Jun', providers: 267, active: 218 },
];

const statCards = [
  {
    title: 'Total Bookings',
    value: '1,450',
    change: '+12.5%',
    icon: Briefcase,
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950/30',
  },
  {
    title: 'Total Revenue',
    value: '$51,200',
    change: '+23.4%',
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950/30',
  },
  {
    title: 'Active Providers',
    value: '218',
    change: '+8.2%',
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950/30',
  },
  {
    title: 'Completion Rate',
    value: '94.8%',
    change: '+2.1%',
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-50 dark:bg-orange-950/30',
  },
];

export default function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('6m');
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch(console.error);
  }, []);

  const summary = analytics?.summary || {};
  const liveBookingTrendData = analytics?.trend?.length ? analytics.trend : bookingTrendData;
  const liveRevenueData = analytics?.trend?.length
    ? analytics.trend.map((item: any) => ({ month: item.month, revenue: item.revenue }))
    : revenueData;
  const liveCategoryBreakdown = analytics?.categoryBreakdown?.length
    ? analytics.categoryBreakdown.map((item: any, index: number) => ({
        ...item,
        fill: ['#4F46E5', '#10B981', '#EF4444', '#F59E0B', '#8B5CF6'][index % 5],
      }))
    : categoryBreakdown;
  const liveProviderGrowth = providerGrowth.map((item, index, arr) =>
    index === arr.length - 1
      ? {
          ...item,
          providers: summary.totalProviders || item.providers,
          active: summary.verifiedProviders || item.active,
        }
      : item,
  );
  const liveStatCards = [
    {
      title: 'Total Bookings',
      value: String(summary.totalRequests ?? '0'),
      change: `${summary.pendingRequests || 0} pending`,
      icon: Briefcase,
      color: 'text-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      title: 'Completed Value',
      value: `$${Number(summary.totalRevenue || 0).toFixed(0)}`,
      change: 'Completed services',
      icon: DollarSign,
      color: 'text-green-600',
      bg: 'bg-green-50 dark:bg-green-950/30',
    },
    {
      title: 'Active Providers',
      value: String(summary.verifiedProviders ?? '0'),
      change: `${summary.totalProviders || 0} registered`,
      icon: Users,
      color: 'text-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-950/30',
    },
    {
      title: 'Completion Rate',
      value: `${summary.completionRate || 0}%`,
      change: `${summary.completedRequests || 0} completed`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-950/30',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-0">
        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-1 bg-card border-r border-border">
          <Sidebar type='admin'/>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Analytics</h1>
                <p className="text-muted-foreground">Platform performance and insights</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-3 w-full sm:w-auto">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Select time range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">Last Month</SelectItem>
                    <SelectItem value="3m">Last 3 Months</SelectItem>
                    <SelectItem value="6m">Last 6 Months</SelectItem>
                    <SelectItem value="1y">Last Year</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" className="hidden sm:flex">
                  <Download className="h-4 w-4" />
                </Button>
              </motion.div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {liveStatCards.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div key={stat.title} variants={itemVariants}>
                    <Card className="border-border p-6 hover:shadow-lg transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`p-3 rounded-lg ${stat.bg}`}>
                          <Icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <Badge variant="outline" className="text-accent font-semibold text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </Card>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Charts Grid */}
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {/* Booking Trends */}
              <motion.div variants={itemVariants}>
                <Card className="border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Booking Trends</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={liveBookingTrendData}>
                      <defs>
                        <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="bookings"
                        stroke="#4F46E5"
                        fill="url(#colorBookings)"
                        name="Total Bookings"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Revenue Trend */}
              <motion.div variants={itemVariants}>
                <Card className="border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Revenue Trend</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={liveRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#10B981"
                        strokeWidth={2}
                        dot={{ fill: '#10B981', r: 4 }}
                        activeDot={{ r: 6 }}
                        name="Revenue"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>

              {/* Service Category Breakdown */}
              <motion.div variants={itemVariants}>
                <Card className="border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Service Categories</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={liveCategoryBreakdown}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {liveCategoryBreakdown.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="grid grid-cols-2 gap-2 mt-4">
                    {liveCategoryBreakdown.map((cat: any) => (
                      <div key={cat.name} className="flex items-center gap-2 text-sm">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: cat.fill }}
                        ></div>
                        <span className="text-muted-foreground">{cat.name}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>

              {/* Provider Growth */}
              <motion.div variants={itemVariants}>
                <Card className="border-border p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-6">Provider Growth</h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={liveProviderGrowth}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1f2937',
                          border: '1px solid #374151',
                          borderRadius: '8px',
                        }}
                      />
                      <Legend />
                      <Bar dataKey="providers" fill="#8B5CF6" name="Total Providers" />
                      <Bar dataKey="active" fill="#10B981" name="Active Providers" />
                    </BarChart>
                  </ResponsiveContainer>
                </Card>
              </motion.div>
            </motion.div>

            {/* Key Metrics */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <Card className="border-border p-6 bg-secondary/30">
                <h4 className="font-semibold text-foreground mb-4">Average Rating</h4>
                <p className="text-3xl font-bold text-accent mb-2">{summary.averageRating || 0}/5</p>
                <p className="text-sm text-muted-foreground">Based on completed platform reviews</p>
              </Card>

              <Card className="border-border p-6 bg-secondary/30">
                <h4 className="font-semibold text-foreground mb-4">Completion Rate</h4>
                <p className="text-3xl font-bold text-primary mb-2">{summary.completionRate || 0}%</p>
                <p className="text-sm text-muted-foreground">Completed service request rate</p>
              </Card>

              <Card className="border-border p-6 bg-secondary/30">
                <h4 className="font-semibold text-foreground mb-4">Open Requests</h4>
                <p className="text-3xl font-bold text-accent mb-2">{summary.pendingRequests || 0}</p>
                <p className="text-sm text-muted-foreground">Requests requiring provider action</p>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
