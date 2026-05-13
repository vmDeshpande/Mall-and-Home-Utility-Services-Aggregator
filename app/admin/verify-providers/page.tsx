"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sidebar } from "@/components/layout/sidebar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { CheckCircle, XCircle, Clock, FileText, Phone, User } from "lucide-react";
import { api } from "@/lib/api";

type Provider = {
  _id: string;
  createdAt?: string;

  userId: {
    name: string;
    email: string;
    avatar?: string;
    phone?: string;
    bio?: string;
  };

  services: {
    serviceId: {
      _id: string;
      name: string;
    };
    hourly: number;
  }[];

  pricing?: {
    hourly?: number;
  };

  availabilityType?: string;

  verification?: {
    identityProof?: string;
    skillProof?: string;
    status?: string;
  };
};

export default function VerifyProvidersPage() {
  const [activeTab, setActiveTab] = useState("pending");
  const [providers, setProviders] = useState<Provider[]>([]);

  const getStatus = (provider: any) => {
    return provider.verification?.status || "pending";
  };

  useEffect(() => {
    const fetchProviders = async () => {
      const data = await api.getProviders();
      setProviders(data);
    };

    fetchProviders();
  }, []);

  const handleApprove = async (id: string) => {
    await api.verifyProvider(id, "approved");

    setProviders((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              verification: {
                ...p.verification,
                status: "approved",
              },
            }
          : p,
      ),
    );
  };

  const handleReject = async (id: string) => {
    await api.verifyProvider(id, "rejected");

    setProviders((prev) =>
      prev.map((p) =>
        p._id === id
          ? {
              ...p,
              verification: {
                ...p.verification,
                status: "rejected",
              },
            }
          : p,
      ),
    );
  };

  const filterProviders = (status: "pending" | "approved" | "rejected") =>
    providers.filter((p) => getStatus(p) === status);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/20">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Sidebar */}
        <div className="hidden lg:block border-r">
          <Sidebar type="admin" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl font-bold mb-2">
                  Provider Verification
                </h1>
                <p className="text-muted-foreground">
                  Review and approve service providers
                </p>
              </motion.div>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {filterProviders("pending").length}
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {filterProviders("approved").length}
                  </p>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="p-4">
                  <p className="text-sm text-muted-foreground">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">
                    {filterProviders("rejected").length}
                  </p>
                </Card>
              </motion.div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="pending">
                      Pending ({filterProviders("pending").length})
                    </TabsTrigger>
                    <TabsTrigger value="approved">
                      Approved ({filterProviders("approved").length})
                    </TabsTrigger>
                    <TabsTrigger value="rejected">
                      Rejected ({filterProviders("rejected").length})
                    </TabsTrigger>
                  </TabsList>

                  {["pending", "approved", "rejected"].map((status) => (
                    <TabsContent
                      key={status}
                      value={status}
                      className="mt-6 space-y-4"
                    >
                      {filterProviders(status as any).length === 0 ? (
                        <Card className="p-10 text-center">
                          <Clock className="h-10 w-10 mx-auto mb-3 opacity-50" />
                          <p className="text-muted-foreground">
                            No {status} providers
                          </p>
                        </Card>
                      ) : (
                        filterProviders(status as any).map(
                          (provider, index) => {
                            const identityProof =
                              provider.verification?.identityProof ?? null;
                            const skillProof =
                              provider.verification?.skillProof ?? null;

                            return (
                              <motion.div
                                key={provider._id}
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                transition={{ delay: index * 0.1 }}
                              >
                                <Card className="p-6 hover:shadow-lg transition-shadow border-border">
                                  <div className="space-y-5">
                                    {/* HEADER */}
                                    <div className="flex items-start justify-between">
                                      <div className="flex items-start gap-4 flex-1">
                                        <img
                                          src={
                                            provider.userId?.avatar ||
                                            "https://api.dicebear.com/7.x/avataaars/svg"
                                          }
                                          className="h-16 w-16 rounded-full object-cover border-2 border-primary/20"
                                        />

                                        <div className="flex-1">
                                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <h3 className="text-lg font-semibold">
                                              {provider.userId?.name}
                                            </h3>

                                            {/* Services as category */}
                                            <Badge className="bg-primary/10 text-primary">
                                              {provider.services?.[0]?.serviceId
                                                ?.name || "Service"}
                                            </Badge>
                                          </div>

                                          <p className="text-sm text-muted-foreground">
                                            {provider.userId?.email}
                                          </p>

                                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {provider.userId?.phone ||
                                              "No phone"}
                                          </p>

                                          <p className="text-xs text-muted-foreground line-clamp-2 flex items-center gap-1">
                                            <User className="h-3 w-3" />
                                            {provider.userId?.bio || "No bio"}
                                          </p>

                                          <p className="text-xs text-muted-foreground mt-1">
                                            Joined:{" "}
                                            {provider.createdAt
                                              ? new Date(
                                                  provider.createdAt,
                                                ).toLocaleDateString()
                                              : "Unknown"}
                                          </p>
                                        </div>
                                      </div>

                                      {/* STATUS BADGE */}
                                      <Badge
                                        className={
                                          status === "pending"
                                            ? "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400"
                                            : status === "approved"
                                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                              : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                                        }
                                      >
                                        {status.charAt(0).toUpperCase() +
                                          status.slice(1)}
                                      </Badge>
                                    </div>

                                    {/* SERVICES */}
                                    <div className="flex flex-wrap gap-2">
                                      {provider.services?.map((s, i) => (
                                        <Badge key={i} variant="outline">
                                          {s.serviceId?.name} ($
                                          {s.hourly ||
                                            provider.pricing?.hourly ||
                                            0}
                                          /hr)
                                        </Badge>
                                      ))}
                                    </div>

                                    {/* DOCUMENTS */}
                                    <div className="bg-muted p-4 rounded-lg space-y-3">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-primary" />
                                        <p className="font-semibold">
                                          Documents
                                        </p>
                                      </div>

                                      <div className="flex gap-4 flex-wrap">
                                        {identityProof && (
                                          <div className="space-y-1">
                                            <img
                                              src={identityProof}
                                              className="w-24 h-24 object-cover rounded border cursor-pointer"
                                              onClick={() =>
                                                window.open(
                                                  identityProof,
                                                  "_blank",
                                                )
                                              }
                                            />
                                            <p className="text-xs text-center text-muted-foreground">
                                              ID Proof
                                            </p>
                                          </div>
                                        )}

                                        {skillProof && (
                                          <div className="space-y-1">
                                            <img
                                              src={skillProof}
                                              className="w-24 h-24 object-cover rounded border cursor-pointer"
                                              onClick={() =>
                                                window.open(
                                                  skillProof,
                                                  "_blank",
                                                )
                                              }
                                            />
                                            <p className="text-xs text-center text-muted-foreground">
                                              Skill Proof
                                            </p>
                                          </div>
                                        )}
                                      </div>
                                    </div>

                                    {/* ACTIONS */}
                                    {status === "pending" && (
                                      <div className="flex gap-2">
                                        <Button
                                          onClick={() =>
                                            handleApprove(provider._id)
                                          }
                                          className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                        >
                                          <CheckCircle className="h-4 w-4 mr-2" />
                                          Approve
                                        </Button>

                                        <Button
                                          onClick={() =>
                                            handleReject(provider._id)
                                          }
                                          variant="destructive"
                                          className="flex-1"
                                        >
                                          <XCircle className="h-4 w-4 mr-2" />
                                          Reject
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </Card>
                              </motion.div>
                            );
                          },
                        )
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
