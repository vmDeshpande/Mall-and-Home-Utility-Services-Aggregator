"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Clock, CheckCircle, Truck, User, Search } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";

type Booking = {
  _id: string;
  serviceName: string;
  providerName: string;
  status: "requested" | "accepted" | "on_the_way" | "completed" | "cancelled";
  scheduledAt: string;
};

const statusSteps = [
  { key: "requested", label: "Requested", icon: Clock },
  { key: "accepted", label: "Accepted", icon: User },
  { key: "on_the_way", label: "On the Way", icon: Truck },
  { key: "completed", label: "Completed", icon: CheckCircle },
];

export default function TrackingPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");

        const data = await api.getRequests({ userId: user._id });
        const mapped = data.map((r: any) => ({
          _id: r._id,
          serviceName: r.serviceId?.name || "Service",
          providerName: r.providerId?.userId?.name || "Waiting for provider...",
          status: normalizeStatus(r.status),
          scheduledAt: r.requestedAt || r.createdAt,
        }));

        setBookings(mapped);
      } catch (err) {
        console.error(err);
      }
    };

    loadBookings();
  }, []);

  const normalizeStatus = (status: string) => {
    if (status === "requested") return "requested";
    if (status === "assigned" || status === "accepted") return "accepted";
    if (status === "in-progress") return "on_the_way";
    if (status === "completed") return "completed";
    return "pending";
  };

  const getStatusIndex = (status: string) => {
    return statusSteps.findIndex((s) => s.key === status);
  };

  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Track Your Bookings</h1>
          <p className="text-muted-foreground">
            View real-time status of your service requests
          </p>
        </div>

        {/* Empty State */}
        {bookings.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No bookings found"
            description="You haven't booked any services yet"
          />
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, index) => {
              const currentStep = getStatusIndex(booking.status);

              return (
                <motion.div
                  key={booking._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 border-border hover:shadow-lg transition-shadow">
                    {/* Header */}
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-lg font-semibold">
                          {booking.serviceName}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Provider: {booking.providerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {booking.scheduledAt
                            ? new Date(booking.scheduledAt).toLocaleString()
                            : "Date not available"}
                        </p>
                      </div>

                      {/* Status Badge */}
                      <Badge
                        className={
                          booking.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : booking.status === "cancelled"
                              ? "bg-red-100 text-red-800"
                              : "bg-orange-100 text-orange-800"
                        }
                      >
                        {booking.status.replaceAll("_", " ")}
                      </Badge>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between relative mt-6">
                      {/* Line */}
                      <div className="absolute top-4 left-0 right-0 h-1 bg-muted z-0" />

                      {statusSteps.map((step, i) => {
                        const Icon = step.icon;
                        const isActive = i <= currentStep;

                        return (
                          <div
                            key={step.key}
                            className="flex flex-col items-center relative z-10 flex-1"
                          >
                            <div
                              className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                                isActive
                                  ? "bg-primary text-white border-primary"
                                  : "bg-background border-muted text-muted-foreground"
                              }`}
                            >
                              <Icon className="h-4 w-4" />
                            </div>

                            <span
                              className={`text-xs mt-2 ${
                                isActive
                                  ? "text-primary font-medium"
                                  : "text-muted-foreground"
                              }`}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
