"use client";

import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { Footer } from "@/components/layout/footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Save, User, Lock, Clock, AlertCircle, Briefcase } from "lucide-react";
import { api } from "@/lib/api";

type ServiceItem = {
  serviceId: {
    _id: string;
    name: string;
    pricing?: {
      base?: number;
    };
  };
  hourly: number;
};

type ProviderProfile = {
  _id?: string;
  services: ServiceItem[];
  pricing: {
    hourly: number;
    baseRate: number;
  };
  availabilityType: "full-time" | "part-time" | "weekends" | "flexible";
  availability: Record<string, boolean>;
  online: boolean;
  receiveNotifications: boolean;
  allowUrgent: boolean;
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

const defaultProfile: ProviderProfile = {
  services: [],
  pricing: { hourly: 0, baseRate: 0 },
  availabilityType: "flexible",
  availability: {
    monday: true,
    tuesday: true,
    wednesday: true,
    thursday: true,
    friday: true,
    saturday: true,
    sunday: false,
  },
  online: true,
  receiveNotifications: true,
  allowUrgent: true,
};

export default function ProviderSettingsPage() {
  const [profile, setProfile] = useState<ProviderProfile>(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [servicesList, setServicesList] = useState<any[]>([]);
  const [changingPassword, setChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [serviceHourly, setServiceHourly] = useState(0);
  const [serviceBaseRate, setServiceBaseRate] = useState(0);

  // 🔥 Normalize incoming data
  const normalize = (data: any): ProviderProfile => ({
    ...defaultProfile,
    ...data,
    pricing: data?.pricing || defaultProfile.pricing,
    services: Array.isArray(data?.services)
      ? data.services.filter((s: any) => s.serviceId)
      : [],
    availabilityType: data?.availabilityType || "flexible",
    availability: data?.availability || defaultProfile.availability,
    online: data?.online ?? true,
    receiveNotifications: data?.receiveNotifications ?? true,
    allowUrgent: data?.allowUrgent ?? true,
  });

  useEffect(() => {
    const fetchAll = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      if (!user?._id) return;

      const providerData = await api.getProvider(user._id);
      const servicesData = await api.getServices();

      setProfile(normalize(providerData));
      setServicesList(servicesData);
      setLoading(false);
    };

    fetchAll();
  }, []);

  useEffect(() => {
    const selected = servicesList.find((s) => s._id === selectedService);
    if (selected) {
      setServiceBaseRate(selected.pricing?.base ?? 0);
    }
  }, [selectedService]);

  // 🔥 Safe setters
  const updateProfile = (updates: Partial<ProviderProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...updates,
    }));
  };

  const updateAvailability = (day: string, value: boolean) => {
    setProfile((prev) => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      const updated = await api.updateProvider(user._id, profile);

      setProfile(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      <div className="grid lg:grid-cols-5">
        <div className="hidden lg:block border-r">
          <Sidebar type="provider" />
        </div>

        <div className="lg:col-span-4">
          <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your profile and preferences
              </p>
            </motion.div>

            <Tabs defaultValue="profile" className="mt-6">
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </TabsTrigger>
                <TabsTrigger value="availability">
                  <Clock className="h-4 w-4 mr-2" />
                  Availability
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Lock className="h-4 w-4 mr-2" />
                  Security
                </TabsTrigger>
              </TabsList>

              {/* ================= PROFILE ================= */}
              <TabsContent value="profile" className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-semibold mb-6">
                    Services & Pricing
                  </h2>

                  {/* SERVICES */}
                  <div className="space-y-2">
                    {profile.services.map((service, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between items-center p-3 border rounded-lg bg-secondary/30"
                      >
                        <div>
                          <p className="font-medium">
                            {service.serviceId?.name || "Unknown Service"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            ₹{service.hourly}/hr • ₹
                            {service.serviceId?.pricing?.base ?? 0} base
                          </p>
                        </div>

                        <Button
                          variant="ghost"
                          onClick={async () => {
                            const updatedServices = profile.services.filter(
                              (_, i) => i !== idx,
                            );

                            const updatedProfile = {
                              ...profile,
                              services: updatedServices,
                            };

                            setProfile(updatedProfile);

                            try {
                              const user = JSON.parse(
                                localStorage.getItem("user") || "{}",
                              );

                              const res = await api.updateProvider(
                                user._id,
                                updatedProfile,
                              );

                              setProfile(normalize(res));
                            } catch (err) {
                              console.error(err);
                            }
                          }}
                          className="text-destructive"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>

                  {/* ADD */}
                  <div className="flex gap-2 mt-3">
                    <Button
                      variant="outline"
                      className="w-full mt-3"
                      onClick={() => setIsModalOpen(true)}
                    >
                      + Add Service
                    </Button>
                  </div>
                </Card>

                {/* STATUS */}
                <Card className="p-6 space-y-4">
                  {[
                    ["online", "Online Status"],
                    ["receiveNotifications", "Receive Notifications"],
                    ["allowUrgent", "Allow Urgent"],
                  ].map(([key, label]) => (
                    <div
                      key={key}
                      className="flex justify-between items-center"
                    >
                      <p>{label}</p>
                      <Switch
                        checked={(profile as any)[key]}
                        onCheckedChange={async (val) => {
                          const updatedProfile = {
                            ...profile,
                            [key]: val,
                          };

                          setProfile(updatedProfile);

                          try {
                            const user = JSON.parse(
                              localStorage.getItem("user") || "{}",
                            );

                            const res = await api.updateProvider(
                              user._id,
                              updatedProfile,
                            );

                            setProfile(normalize(res));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                      />
                    </div>
                  ))}
                </Card>
              </TabsContent>

              {/* Availability Tab */}
              <TabsContent value="availability" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-border p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Availability Settings
                    </h2>

                    {/* 🔥 AVAILABILITY TYPE */}
                    <div className="mb-6 space-y-2">
                      <Label>Availability Type</Label>
                      <select
                        value={profile.availabilityType}
                        onChange={async (e) => {
                          const newType = e.target
                            .value as ProviderProfile["availabilityType"];

                          let newAvailability = { ...profile.availability };

                          if (newType === "full-time") {
                            newAvailability = {
                              monday: true,
                              tuesday: true,
                              wednesday: true,
                              thursday: true,
                              friday: true,
                              saturday: true,
                              sunday: false,
                            };
                          }

                          if (newType === "part-time") {
                            newAvailability = {
                              monday: true,
                              tuesday: true,
                              wednesday: true,
                              thursday: true,
                              friday: true,
                              saturday: false,
                              sunday: false,
                            };
                          }

                          if (newType === "weekends") {
                            newAvailability = {
                              monday: false,
                              tuesday: false,
                              wednesday: false,
                              thursday: false,
                              friday: false,
                              saturday: true,
                              sunday: true,
                            };
                          }

                          // flexible → keep existing

                          const updatedProfile = {
                            ...profile,
                            availabilityType: newType,
                            availability: newAvailability,
                          };

                          setProfile(updatedProfile);

                          try {
                            const user = JSON.parse(
                              localStorage.getItem("user") || "{}",
                            );

                            const res = await api.updateProvider(
                              user._id,
                              updatedProfile,
                            );
                            setProfile(normalize(res));
                          } catch (err) {
                            console.error(err);
                          }
                        }}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm"
                      >
                        <option value="full-time">Full Time</option>
                        <option value="part-time">Part Time</option>
                        <option value="weekends">Weekends Only</option>
                        <option value="flexible">Flexible</option>
                      </select>
                    </div>

                    {/* 🔥 WEEKLY AVAILABILITY */}
                    <h3 className="text-lg font-medium mb-4">
                      Weekly Availability
                    </h3>

                    <div className="space-y-3">
                      {[
                        ["monday", "Monday"],
                        ["tuesday", "Tuesday"],
                        ["wednesday", "Wednesday"],
                        ["thursday", "Thursday"],
                        ["friday", "Friday"],
                        ["saturday", "Saturday"],
                        ["sunday", "Sunday"],
                      ].map(([key, label]) => (
                        <div
                          key={key}
                          className="flex justify-between items-center"
                        >
                          <p>{label}</p>
                          <Switch
                            checked={profile.availability[key]}
                            onCheckedChange={async (val) => {
                              const updatedAvailability = {
                                ...profile.availability,
                                [key]: val,
                              };

                              const updatedProfile = {
                                ...profile,
                                availability: updatedAvailability,
                                availabilityType: "flexible" as ProviderProfile["availabilityType"],
                              };

                              setProfile(updatedProfile);

                              try {
                                const user = JSON.parse(
                                  localStorage.getItem("user") || "{}",
                                );

                                const res = await api.updateProvider(
                                  user._id,
                                  updatedProfile,
                                );
                                setProfile(normalize(res));
                              } catch (err) {
                                console.error(err);
                              }
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security" className="space-y-6">
                <motion.div variants={itemVariants}>
                  <Card className="border-border p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-6">
                      Change Password
                    </h2>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Current Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Enter your current password"
                          value={passwordForm.current}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              current: e.target.value,
                            }))
                          }
                          className="bg-background/50 border-border"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          New Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Enter your new password"
                          value={passwordForm.new}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              new: e.target.value,
                            }))
                          }
                          className="bg-background/50 border-border"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium mb-2 block">
                          Confirm Password
                        </Label>
                        <Input
                          type="password"
                          placeholder="Confirm your new password"
                          value={passwordForm.confirm}
                          onChange={(e) =>
                            setPasswordForm((prev) => ({
                              ...prev,
                              confirm: e.target.value,
                            }))
                          }
                          className="bg-background/50 border-border"
                        />
                      </div>

                      <Button
                        onClick={async () => {
                          try {
                            if (
                              !passwordForm.current ||
                              !passwordForm.new ||
                              !passwordForm.confirm
                            ) {
                              alert("All fields required");
                              return;
                            }

                            if (passwordForm.new !== passwordForm.confirm) {
                              alert("Passwords do not match");
                              return;
                            }

                            if (passwordForm.new.length < 6) {
                              alert("Password must be at least 6 characters");
                              return;
                            }

                            const user = JSON.parse(
                              localStorage.getItem("user") || "{}",
                            );

                            setChangingPassword(true);

                            const res = await api.changePassword(
                              user._id,
                              passwordForm.current,
                              passwordForm.new,
                            );

                            alert(res.msg);

                            setPasswordForm({
                              current: "",
                              new: "",
                              confirm: "",
                            });
                          } catch (err: any) {
                            alert(err.message);
                          } finally {
                            setChangingPassword(false);
                          }
                        }}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-6"
                        disabled={changingPassword}
                      >
                        {changingPassword
                          ? "Please wait..."
                          : "Update Password"}
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Card className="border-accent/50 bg-accent/5 p-6">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-foreground mb-2">
                          Account Security
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Keep your account secure by using a strong password
                          and enabling two-factor authentication.
                        </p>
                        <Button
                          variant="outline"
                          className="border-accent text-accent hover:bg-accent/10"
                        >
                          Enable 2FA
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>

            {isModalOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-[90%] max-w-md rounded-2xl border border-border bg-background p-6 shadow-2xl"
                >
                  {/* HEADER */}
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold">Add Service</h2>
                      <p className="text-xs text-muted-foreground">
                        Choose a service and set pricing
                      </p>
                    </div>
                  </div>

                  {/* SERVICE DROPDOWN */}
                  <div className="space-y-2 mb-4">
                    <Label>Select Service</Label>
                    <div className="relative">
                      <select
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value)}
                        className="w-full appearance-none rounded-xl border border-border bg-background px-3 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="">Select a service</option>
                        {servicesList.map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.name}
                          </option>
                        ))}
                      </select>

                      {/* dropdown arrow */}
                      <span className="absolute right-3 top-2.5 text-muted-foreground text-xs">
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* PRICING */}
                  <div className="grid grid-cols-2 gap-3 mb-5">
                    <div className="space-y-1">
                      <Label className="text-xs">Hourly Rate</Label>
                      <Input
                        type="number"
                        placeholder="₹ / hr"
                        value={serviceHourly}
                        onChange={(e) =>
                          setServiceHourly(Number(e.target.value))
                        }
                      />
                    </div>

                    <div className="space-y-1">
                      <Label className="text-xs">Base Rate</Label>
                      <Input
                        type="number"
                        placeholder="₹ base"
                        value={serviceBaseRate}
                        disabled
                        onChange={(e) =>
                          setServiceBaseRate(Number(e.target.value))
                        }
                      />
                    </div>
                  </div>

                  {/* ACTIONS */}
                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-primary hover:bg-primary/90"
                      disabled={!selectedService}
                      onClick={async () => {
                        if (!selectedService) return;

                        if (
                          profile.services.some(
                            (s) => s.serviceId._id === selectedService,
                          )
                        ) {
                          alert("Service already added");
                          return;
                        }

                        const selected = servicesList.find(
                          (s) => s._id === selectedService,
                        );

                        if (!selected) return;

                        const updatedServices = [
                          ...profile.services,
                          {
                            serviceId: {
                              _id: selected._id,
                              name: selected.name,
                              pricing: selected.pricing,
                            },
                            hourly: serviceHourly,
                          },
                        ];

                        const updatedProfile = {
                          ...profile,
                          services: updatedServices,
                        };

                        setProfile(updatedProfile);

                        try {
                          const user = JSON.parse(
                            localStorage.getItem("user") || "{}",
                          );
                          const res = await api.updateProvider(
                            user._id,
                            updatedProfile,
                          );
                          setProfile(normalize(res));
                        } catch (err) {
                          console.error(err);
                        }

                        setIsModalOpen(false);
                      }}
                    >
                      Add Service
                    </Button>

                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
