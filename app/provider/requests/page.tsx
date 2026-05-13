'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/layout/sidebar';
import { Footer } from '@/components/layout/footer';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import { EmptyState } from '@/components/ui/empty-state';
import { api } from '@/lib/api';
import {
  Clock,
  MapPin,
  Phone,
  MessageSquare,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Star,
} from 'lucide-react';

interface ServiceRequest {
  id: string;
  customerName: string;
  customerAvatar: string;
  customerPhone?: string;
  customerEmail?: string;
  customerRating: number;
  customerReviews: number;
  service: string;
  date: string;
  time: string;
  location: string;
  price: number;
  status: 'requested' | 'pending' | 'assigned' | 'accepted' | 'rejected' | 'in-progress' | 'completed';
  notes?: string;
}

export default function ProviderRequestsPage() {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [selectedTab, setSelectedTab] = useState('pending');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?._id) return;

        const provider = await api.getProvider(user._id);
        const data = await api.getRequests({ providerId: provider._id });

        const mappedRequests: ServiceRequest[] = data.map((request: any) => {
          const customer = request.userId || {};
          const providerService = request.serviceId || {};
          const scheduled = request.scheduledTime
            ? new Date(request.scheduledTime)
            : null;

          return {
            id: request._id,
            customerName: customer.name || 'Customer',
            customerAvatar:
              customer.avatar ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${customer.name || request._id}`,
            customerPhone: customer.phone,
            customerEmail: customer.email,
            customerRating: 0,
            customerReviews: 0,
            service: providerService.name || request.serviceType || 'Service',
            date: scheduled ? scheduled.toLocaleDateString() : 'Not scheduled',
            time: scheduled
              ? scheduled.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : '',
            location: request.location?.address || 'No address provided',
            price: request.price || 0,
            status: request.status === 'requested' ? 'pending' : request.status,
            notes: request.notes,
          };
        });

        setRequests(mappedRequests);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadRequests();
  }, []);

  const handleAccept = (id: string) => {
    api.updateRequestStatus(id, 'assigned').catch(console.error);
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'assigned' } : req
      )
    );
  };

  const handleReject = (id: string) => {
    api.updateRequestStatus(id, 'rejected').catch(console.error);
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: 'rejected' } : req
      )
    );
  };

  const handleStatusUpdate = (id: string, status: 'in-progress' | 'completed') => {
    api.updateRequestStatus(id, status).catch(console.error);
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status } : req
      )
    );
  };

  const filteredRequests = requests.filter((req) =>
    selectedTab === 'accepted'
      ? ['assigned', 'accepted', 'in-progress', 'completed'].includes(req.status)
      : req.status === selectedTab,
  );
  const pendingCount = requests.filter((r) => r.status === 'pending' || r.status === 'requested').length;
  const acceptedCount = requests.filter((r) => ['assigned', 'accepted', 'in-progress', 'completed'].includes(r.status)).length;
  const rejectedCount = requests.filter((r) => r.status === 'rejected').length;

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
          <Sidebar type="provider" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Service Requests</h1>
                <p className="text-muted-foreground">Manage incoming booking requests from customers</p>
              </motion.div>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="border-border p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pending Requests</p>
                      <p className="text-3xl font-bold text-foreground">{pendingCount}</p>
                    </div>
                    <AlertCircle className="h-8 w-8 text-yellow-500" />
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Accepted</p>
                      <p className="text-3xl font-bold text-accent">{acceptedCount}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-accent" />
                  </div>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="border-border p-4 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Rejected</p>
                      <p className="text-3xl font-bold text-foreground">{rejectedCount}</p>
                    </div>
                    <XCircle className="h-8 w-8 text-destructive" />
                  </div>
                </Card>
              </motion.div>
            </motion.div>

            {/* Requests */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="pending" className="relative">
                    Pending
                    {pendingCount > 0 && (
                      <Badge variant="default" className="ml-2 h-5 w-5 p-0 flex items-center justify-center">
                        {pendingCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                  <TabsTrigger value="accepted">Accepted</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                {/* Pending Requests */}
                <TabsContent value="pending" className="space-y-4">
                  {isLoading ? (
                    <Card className="border-border p-12 text-center text-muted-foreground">
                      Loading requests...
                    </Card>
                  ) : filteredRequests.length === 0 ? (
                    <Card className="border-border p-12">
                      <EmptyState
                        icon={Clock}
                        title="No Pending Requests"
                        description="You're all caught up! No new booking requests at the moment."
                      />
                    </Card>
                  ) : (
                    filteredRequests.map((request, idx) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                        className="transition-all"
                      >
                        <Card className="border-border p-6 hover:shadow-lg transition-shadow">
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Customer Info */}
                            <div className="md:col-span-2">
                              <div className="flex items-center gap-4 mb-4">
                                <img
                                  src={request.customerAvatar}
                                  alt={request.customerName}
                                  className="h-12 w-12 rounded-full border-2 border-primary"
                                />
                                <div>
                                  <p className="font-semibold text-foreground">{request.customerName}</p>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Star className="h-3.5 w-3.5 fill-accent text-accent" />
                                    <span>
                                      {request.customerRating} ({request.customerReviews} reviews)
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Service Details */}
                              <div className="space-y-2 text-sm">
                                <p className="text-foreground">
                                  <span className="font-medium">Service:</span> {request.service}
                                </p>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {request.date} at {request.time}
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <MapPin className="h-4 w-4" />
                                  {request.location}
                                </div>
                                {request.notes && (
                                  <p className="text-muted-foreground italic">"{request.notes}"</p>
                                )}
                              </div>
                            </div>

                            {/* Price & Actions */}
                            <div className="flex flex-col justify-between md:col-span-2">
                              <div className="mb-4">
                                <p className="text-sm text-muted-foreground mb-1">Offered Price</p>
                                <p className="text-3xl font-bold text-primary">${request.price}</p>
                              </div>

                              <div className="grid grid-cols-2 gap-3">
                                {request.customerPhone ? (
                                  <Button asChild variant="outline" className="flex items-center justify-center gap-2">
                                    <a href={`tel:${request.customerPhone}`}>
                                      <Phone className="h-4 w-4" />
                                      <span>Call</span>
                                    </a>
                                  </Button>
                                ) : (
                                  <Button variant="outline" disabled className="flex items-center justify-center gap-2">
                                    <Phone className="h-4 w-4" />
                                    <span>No Phone</span>
                                  </Button>
                                )}
                                {request.customerPhone || request.customerEmail ? (
                                  <Button asChild variant="outline" className="flex items-center justify-center gap-2">
                                    <a
                                      href={
                                        request.customerPhone
                                          ? `sms:${request.customerPhone}`
                                          : `mailto:${request.customerEmail}?subject=Service request ${request.id.slice(-6).toUpperCase()}`
                                      }
                                    >
                                      <MessageSquare className="h-4 w-4" />
                                      <span>Message</span>
                                    </a>
                                  </Button>
                                ) : (
                                  <Button variant="outline" disabled className="flex items-center justify-center gap-2">
                                    <MessageSquare className="h-4 w-4" />
                                    <span>No Contact</span>
                                  </Button>
                                )}
                              </div>
                              <Link href={`/provider/jobs/${request.id}`} className="mt-3 block">
                                <Button variant="outline" className="w-full">
                                  View Full Job History
                                </Button>
                              </Link>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="grid grid-cols-2 gap-3 mt-6 pt-6 border-t border-border">
                            <Button
                              onClick={() => handleAccept(request.id)}
                              className="bg-accent hover:bg-accent/90 text-white font-semibold flex items-center justify-center gap-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                              Accept
                            </Button>
                            <Button
                              onClick={() => handleReject(request.id)}
                              variant="destructive"
                              className="flex items-center justify-center gap-2"
                            >
                              <XCircle className="h-4 w-4" />
                              Reject
                            </Button>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                {/* Accepted Requests */}
                <TabsContent value="accepted" className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <Card className="border-border p-12">
                      <EmptyState
                        icon={CheckCircle}
                        title="No Accepted Requests"
                        description="You haven't accepted any requests yet."
                      />
                    </Card>
                  ) : (
                    filteredRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                      >
                        <Card className="border-accent/50 bg-accent/5 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{request.customerName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{request.service}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {request.date} at {request.time}
                                </div>
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-4 w-4" />
                                  ${request.price}
                                </div>
                              </div>
                              <Link href={`/provider/jobs/${request.id}`} className="mt-3 inline-block">
                                <Button size="sm" variant="outline">View Details</Button>
                              </Link>
                            </div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge className="bg-accent text-accent-foreground">
                                {request.status === 'in-progress'
                                  ? 'In Progress'
                                  : request.status === 'completed'
                                    ? 'Completed'
                                    : 'Assigned'}
                              </Badge>
                              {request.status !== 'completed' && (
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleStatusUpdate(request.id, 'in-progress')}
                                  >
                                    Start
                                  </Button>
                                  {request.status === 'in-progress' && (
                                    <Button
                                      size="sm"
                                      onClick={() => handleStatusUpdate(request.id, 'completed')}
                                    >
                                      Complete
                                    </Button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>

                {/* Rejected Requests */}
                <TabsContent value="rejected" className="space-y-4">
                  {filteredRequests.length === 0 ? (
                    <Card className="border-border p-12">
                      <EmptyState
                        icon={XCircle}
                        title="No Rejected Requests"
                        description="You haven't rejected any requests."
                      />
                    </Card>
                  ) : (
                    filteredRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        variants={itemVariants}
                        whileHover={{ y: -4 }}
                      >
                        <Card className="border-destructive/30 bg-destructive/5 p-6">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground mb-2">{request.customerName}</h4>
                              <p className="text-sm text-muted-foreground mb-2">{request.service}</p>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  {request.date} at {request.time}
                                </div>
                              </div>
                              <Link href={`/provider/jobs/${request.id}`} className="mt-3 inline-block">
                                <Button size="sm" variant="outline">View Details</Button>
                              </Link>
                            </div>
                            <Badge variant="destructive">Rejected</Badge>
                          </div>
                        </Card>
                      </motion.div>
                    ))
                  )}
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
