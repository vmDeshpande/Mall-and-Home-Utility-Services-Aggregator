"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Edit2, Save, LogOut, Plus, Trash2, Shield } from "lucide-react";
import { api } from "@/lib/api";

export default function ProfilePage() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(true);

  // Profile data
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

    if (!storedUser?._id) {
      setLoading(false);
      return;
    }

    setUserId(storedUser._id);

    const fetchData = async () => {
      try {
        const data = await api.getProfile(storedUser._id);

        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setAddresses(data.addresses || []);
      } catch (err) {
        console.error("Failed to load profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Addresses
  const [addresses, setAddresses] = useState<any[]>([]);
  const [newAddressLabel, setNewAddressLabel] = useState("");
  const [newAddressText, setNewAddressText] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    window.dispatchEvent(new Event("authChanged"));
    window.location.href = "/";
  };

  const handleSave = async () => {
    setIsSaving(true);

    try {
      const updated = await api.updateProfile(userId, {
        name,
        email,
        phone,
        bio,
        addresses,
      });

      // 🔥 update localStorage
      localStorage.setItem("user", JSON.stringify(updated));
      window.dispatchEvent(new Event("authChanged"));

      setIsEditMode(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddAddress = () => {
    if (newAddressLabel && newAddressText) {
      setAddresses([
        ...addresses,
        {
          label: newAddressLabel,
          address: newAddressText,
          isDefault: false,
        },
      ]);
      setNewAddressLabel("");
      setNewAddressText("");
      setShowAddForm(false);
    }
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((addr) => addr._id !== id));
  };

  const handleSetDefault = (id: number) => {
    setAddresses(
      addresses.map((addr) => ({
        ...addr,
        isDefault: addr._id === id,
      })),
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading profile...
      </div>
    );
  }
  return (
    <main className="min-h-screen bg-background pt-24 pb-12">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mb-8 flex items-center justify-between"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <h1 className="text-4xl font-bold text-foreground">Profile</h1>
            <p className="text-muted-foreground">
              Manage your account settings
            </p>
          </motion.div>

          <motion.div variants={itemVariants}>
            {!isEditMode ? (
              <Button
                onClick={() => setIsEditMode(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Edit2 className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditMode(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90"
                  disabled={isSaving}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? "Saving..." : "Save"}
                </Button>
              </div>
            )}
          </motion.div>
        </motion.div>

        <motion.div
          className="space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Profile Picture Section */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                Profile Picture
              </h2>

              <div className="flex items-center gap-6">
                <img
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${name || "User"}`}
                  alt="Profile"
                  className="h-24 w-24 rounded-full object-cover border-2 border-primary/20"
                />

                {isEditMode && (
                  <Button variant="outline" className="border-border">
                    Upload New Photo
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>

          {/* Personal Information */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold mb-6">
                Personal Information
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Full Name
                  </label>
                  {isEditMode ? (
                    <Input
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{name}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Email Address
                  </label>
                  {isEditMode ? (
                    <Input
                      disabled
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{email}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Phone Number
                  </label>
                  {isEditMode ? (
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{phone}</p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Bio
                  </label>
                  {isEditMode ? (
                    <Input
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      className="border-border"
                    />
                  ) : (
                    <p className="text-foreground font-medium">{bio}</p>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Addresses */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold">Saved Addresses</h2>
                {isEditMode && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="border-border"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                )}
              </div>

              {showAddForm && isEditMode && (
                <div className="mb-6 p-4 rounded-lg bg-muted border border-border space-y-3">
                  <Input
                    placeholder="Address label (e.g., Home, Work)"
                    value={newAddressLabel}
                    onChange={(e) => setNewAddressLabel(e.target.value)}
                  />
                  <Input
                    placeholder="Full address"
                    value={newAddressText}
                    onChange={(e) => setNewAddressText(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={handleAddAddress}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Add
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              )}

              <div className="space-y-3">
                {addresses.map((addr) => (
                  <div
                    key={addr._id}
                    className="p-4 rounded-lg border border-border flex items-start justify-between group hover:bg-muted transition-colors"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-foreground">
                          {addr.label}
                        </p>
                        {addr.isDefault && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {addr.address}
                      </p>
                    </div>

                    {isEditMode && (
                      <div className="flex gap-2">
                        {!addr.isDefault && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleSetDefault(addr._id)}
                            className="text-muted-foreground opacity-0 group-hover:opacity-100"
                          >
                            Set Default
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="text-destructive opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Payment Methods */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-border">
              <h2 className="text-lg font-semibold mb-6">Payment Methods</h2>
              <p className="text-muted-foreground mb-6">
                Payments are not collected in Phase 1. This section is reserved for future online payments.
              </p>
            </Card>
          </motion.div>

          {/* Danger Zone */}
          <motion.div variants={itemVariants}>
            <Card className="p-6 border-destructive/20 bg-destructive/5">
              <h2 className="text-lg font-semibold text-destructive mb-6">
                Account
              </h2>
              <Button
                variant="destructive"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </main>
  );
}
