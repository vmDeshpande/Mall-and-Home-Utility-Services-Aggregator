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
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { api } from "@/lib/api";
import {
  Plus,
  Trash2,
  Edit2,
  Save,
  X,
  Settings,
  Package,
  DollarSign,
  Bell,
} from "lucide-react";

type Service = {
  _id: string;
  name: string;
  pricing: {
    min: number;
    base: number;
    max: number;
  };
};

const safeSettings = (data: any) => ({
  maintenanceMode: data?.maintenanceMode ?? false,
  requireVerification: data?.requireVerification ?? true,
  autoApproveProviders: data?.autoApproveProviders ?? false,
  requireInsurance: data?.requireInsurance ?? true,
  platformFee: data?.platformFee ?? 10,
  allowInstantBooking: data?.allowInstantBooking ?? true,
  cancellationWindowHours: data?.cancellationWindowHours ?? 2,
  urgentFeePercentage: data?.urgentFeePercentage ?? 20,
});

const formatServiceName = (name: string) => {
  return name
    .replace(/[-_]/g, " ")
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export default function AdminSettingsPage() {
  const [categories, setCategories] = useState<Service[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    pricing: {
      min: 0,
      base: 0,
      max: 0,
    },
  });
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    requireVerification: true,
    autoApproveProviders: false,
    requireInsurance: true,
    platformFee: 10,

    allowInstantBooking: true,
    cancellationWindowHours: 2,
    urgentFeePercentage: 20,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const services = await api.getServices();
        const settingsData = await api.getSettings();

        setCategories(services);
        setSettings(safeSettings(settingsData));
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const handleAddCategory = async () => {
    const { name, pricing } = newCategory;

    if (!name.trim()) {
      alert("Service name required");
      return;
    }

    if (pricing.min > pricing.base || pricing.base > pricing.max) {
      alert("Invalid pricing: Min ≤ Base ≤ Max");
      return;
    }

    try {
      const created = await api.createService({
        name,
        pricing,
      });

      setCategories([...categories, created]);

      setNewCategory({
        name: "",
        pricing: { min: 0, base: 0, max: 0 },
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    try {
      await api.deleteService(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveSettings = async () => {
    try {
      await api.updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  const updateServiceField = async (
    id: string,
    field: string,
    value: number,
  ) => {
    try {
      const updated = await api.updateService(id, {
        [`pricing.${field}`]: Number(value),
      });

      setCategories((prev) => prev.map((s) => (s._id === id ? updated : s)));
    } catch (err) {
      console.error(err);
    }
  };

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
          <Sidebar type="admin" />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-4">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <motion.div
              className="mb-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants}>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Settings
                </h1>
                <p className="text-muted-foreground">
                  Manage platform configuration and policies
                </p>
              </motion.div>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <Tabs defaultValue="general" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-8">
                  <TabsTrigger
                    value="general"
                    className="flex items-center gap-2"
                  >
                    <Settings className="h-4 w-4" />
                    <span className="hidden sm:inline">General</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="categories"
                    className="flex items-center gap-2"
                  >
                    <Package className="h-4 w-4" />
                    <span className="hidden sm:inline">Categories</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="pricing"
                    className="flex items-center gap-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Pricing</span>
                  </TabsTrigger>
                </TabsList>

                {/* General Settings */}
                <TabsContent value="general" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <Card className="border-border p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-6">
                        General Settings
                      </h2>

                      <div className="space-y-6">
                        {/* Maintenance Mode */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="font-medium text-foreground">
                              Maintenance Mode
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Temporarily disable bookings for maintenance
                            </p>
                          </div>
                          <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                maintenanceMode: checked,
                              })
                            }
                          />
                        </div>

                        {/* Instant Booking Toggle */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="font-medium text-foreground">
                              Allow Instant Booking
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Customers can book instantly without provider
                              approval
                            </p>
                          </div>
                          <Switch
                            checked={settings.allowInstantBooking}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                allowInstantBooking: checked,
                              })
                            }
                          />
                        </div>

                        {/* Require Verification */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="font-medium text-foreground">
                              Require Provider Verification
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Verify all providers before approval
                            </p>
                          </div>
                          <Switch
                            checked={settings.requireVerification}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                requireVerification: checked,
                              })
                            }
                          />
                        </div>

                        {/* Auto Approve */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="font-medium text-foreground">
                              Auto-Approve Low-Risk Providers
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Automatically approve providers with good history
                            </p>
                          </div>
                          <Switch
                            checked={settings.autoApproveProviders}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                autoApproveProviders: checked,
                              })
                            }
                          />
                        </div>

                        {/* Require Insurance */}
                        <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/30 border border-border">
                          <div>
                            <p className="font-medium text-foreground">
                              Require Provider Insurance
                            </p>
                            <p className="text-sm text-muted-foreground">
                              All providers must have liability insurance
                            </p>
                          </div>
                          <Switch
                            checked={settings.requireInsurance}
                            onCheckedChange={(checked) =>
                              setSettings({
                                ...settings,
                                requireInsurance: checked,
                              })
                            }
                          />
                        </div>

                        {/* Platform Fee */}
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                          <Label className="text-sm font-medium mb-2 block">
                            Platform Fee (%)
                          </Label>
                          <Input
                            type="number"
                            value={settings.platformFee}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                platformFee: parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-background/50 border-border"
                          />
                        </div>

                        {/* Cancellation Window */}
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                          <Label className="text-sm font-medium mb-2 block">
                            Cancellation Window (hours)
                          </Label>
                          <Input
                            type="number"
                            value={settings.cancellationWindowHours}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                cancellationWindowHours:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-background/50 border-border"
                          />
                        </div>

                        {/* Urgent Booking Fee */}
                        <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                          <Label className="text-sm font-medium mb-2 block">
                            Urgent Booking Fee (%)
                          </Label>
                          <Input
                            type="number"
                            value={settings.urgentFeePercentage}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                urgentFeePercentage:
                                  parseInt(e.target.value) || 0,
                              })
                            }
                            className="bg-background/50 border-border"
                          />
                        </div>
                      </div>

                      <Button
                        onClick={handleSaveSettings}
                        className="w-full mt-6 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {saved ? "Settings Saved!" : "Save Settings"}
                      </Button>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Service Categories */}
                <TabsContent value="categories" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <Card className="border-border p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-6">
                        Service Categories
                      </h2>

                      {/* Add New Category */}
                      <div className="p-5 rounded-xl bg-secondary/30 border border-border mb-6 space-y-5">
                        <h3 className="font-semibold text-foreground">
                          Add New Service
                        </h3>

                        {/* Service Name */}
                        <div>
                          <Label className="text-sm mb-1 block">
                            Service Name
                          </Label>
                          <Input
                            placeholder="e.g. Plumbing"
                            value={newCategory.name}
                            onChange={(e) =>
                              setNewCategory({
                                ...newCategory,
                                name: e.target.value,
                              })
                            }
                          />
                        </div>

                        {/* Pricing Inputs */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Min Price
                            </Label>
                            <Input
                              type="number"
                              value={newCategory.pricing.min}
                              onChange={(e) =>
                                setNewCategory({
                                  ...newCategory,
                                  pricing: {
                                    ...newCategory.pricing,
                                    min: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Base Price
                            </Label>
                            <Input
                              type="number"
                              value={newCategory.pricing.base}
                              onChange={(e) =>
                                setNewCategory({
                                  ...newCategory,
                                  pricing: {
                                    ...newCategory.pricing,
                                    base: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>

                          <div>
                            <Label className="text-xs text-muted-foreground">
                              Max Price
                            </Label>
                            <Input
                              type="number"
                              value={newCategory.pricing.max}
                              onChange={(e) =>
                                setNewCategory({
                                  ...newCategory,
                                  pricing: {
                                    ...newCategory.pricing,
                                    max: Number(e.target.value),
                                  },
                                })
                              }
                            />
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground">
                          Rule: Min ≤ Base ≤ Max
                        </p>

                        <Button
                          onClick={handleAddCategory}
                          className="w-full bg-primary hover:bg-primary/90"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Service
                        </Button>
                      </div>

                      {/* Categories List */}
                      <div className="space-y-3">
                        {categories.map((category) => (
                          <motion.div
                            key={category._id}
                            className="p-4 rounded-lg bg-card border border-border flex items-center justify-between"
                            whileHover={{
                              backgroundColor: "rgba(79, 70, 229, 0.05)",
                            }}
                          >
                            <div className="flex-1">
                              <p className="font-medium text-foreground">
                                {formatServiceName(category.name)}
                              </p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteCategory(category._id)}
                              className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </Card>
                  </motion.div>
                </TabsContent>

                {/* Pricing Guidelines */}
                <TabsContent value="pricing" className="space-y-6">
                  <motion.div variants={itemVariants}>
                    <Card className="border-border p-6">
                      <h2 className="text-xl font-semibold text-foreground mb-6">
                        Pricing Guidelines
                      </h2>

                      <div className="space-y-5">
                        {categories.map((service) => {
                          const pricing = service.pricing || {
                            min: 0,
                            base: 0,
                            max: 0,
                          };

                          return (
                            <div
                              key={service._id}
                              className="p-5 border border-border rounded-xl bg-card hover:shadow-md transition"
                            >
                              {/* Header */}
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-2">
                                <h3 className="font-semibold text-lg text-foreground">
                                  {formatServiceName(service.name)}
                                </h3>

                                <Badge variant="secondary" className="w-fit">
                                  Base: ₹{pricing.base}
                                </Badge>
                              </div>

                              {/* Inputs */}
                              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Min */}
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1 block">
                                    Min Price
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pricing.min ?? 0}
                                    onChange={(e) =>
                                      updateServiceField(
                                        service._id,
                                        "min",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </div>

                                {/* Base */}
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1 block">
                                    Base Price
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pricing.base ?? 0}
                                    onChange={(e) =>
                                      updateServiceField(
                                        service._id,
                                        "base",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </div>

                                {/* Max */}
                                <div>
                                  <Label className="text-xs text-muted-foreground mb-1 block">
                                    Max Price
                                  </Label>
                                  <Input
                                    type="number"
                                    value={pricing.max ?? 0}
                                    onChange={(e) =>
                                      updateServiceField(
                                        service._id,
                                        "max",
                                        Number(e.target.value),
                                      )
                                    }
                                  />
                                </div>
                              </div>

                              {/* Validation hint */}
                              <p className="text-xs text-muted-foreground mt-3">
                                Ensure: Min ≤ Base ≤ Max
                              </p>
                            </div>
                          );
                        })}
                      </div>

                      <div className="mt-6 p-4 rounded-lg bg-secondary/30 border border-border text-sm text-muted-foreground">
                        Admin-defined pricing limits. Providers cannot set
                        prices outside this range.
                      </div>
                    </Card>
                  </motion.div>
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
