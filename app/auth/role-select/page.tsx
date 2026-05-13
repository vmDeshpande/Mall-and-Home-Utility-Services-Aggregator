"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Users, Briefcase, CheckCircle, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export default function RoleSelectPage() {
  const [selectedRole, setSelectedRole] = useState<
    "customer" | "provider" | null
  >(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleContinue = async () => {
    if (!selectedRole) return;

    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      // convert frontend role → backend role
      const backendRole = selectedRole === "customer" ? "user" : "provider";

      const updatedUser = await api.updateRole(user._id, backendRole);

      // update localStorage user
      localStorage.setItem("user", JSON.stringify(updatedUser));

      // redirect to onboarding
      router.push(`/onboarding/${selectedRole}`);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
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
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4 py-8">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/8 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-accent/8 blur-3xl"></div>
      </div>

      <motion.div
        className="relative w-full max-w-4xl"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-12">
          <Link href="/" className="inline-flex items-center gap-2 mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-white font-bold shadow-md">
              S
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              ServiceHub
            </span>
          </Link>

          <h1 className="text-4xl font-bold text-foreground mb-3">
            Choose Your Role
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Are you looking for services or offering them?
          </p>
        </motion.div>

        {/* Role Selection Cards */}
        <motion.div
          className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Customer Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Card
              onClick={() => setSelectedRole("customer")}
              className={`p-8 cursor-pointer transition-all border-2 relative overflow-hidden h-full flex flex-col ${
                selectedRole === "customer"
                  ? "border-primary bg-primary/5 shadow-xl"
                  : "border-border hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              {selectedRole === "customer" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative flex-1 flex flex-col items-start">
                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6 group-hover:from-primary/30 group-hover:to-accent/30"
                  whileHover={{ scale: 1.1 }}
                >
                  <Users className="h-8 w-8 text-primary" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  I&apos;m a Customer
                </h2>
                <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                  Browse and book trusted service professionals for your home
                  needs.
                </p>

                <ul className="space-y-3 mb-6 w-full">
                  {[
                    "Browse verified professionals",
                    "Easy booking & scheduling",
                    "Tracked requests & reviews",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRole === "customer" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 right-4"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>

          {/* Provider Card */}
          <motion.div
            variants={itemVariants}
            whileHover={{ y: -8, transition: { duration: 0.2 } }}
            className="h-full"
          >
            <Card
              onClick={() => setSelectedRole("provider")}
              className={`p-8 cursor-pointer transition-all border-2 relative overflow-hidden h-full flex flex-col ${
                selectedRole === "provider"
                  ? "border-primary bg-primary/5 shadow-xl"
                  : "border-border hover:border-primary/50 hover:shadow-lg"
              }`}
            >
              {selectedRole === "provider" && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                />
              )}

              <div className="relative flex-1 flex flex-col items-start">
                <motion.div
                  className="flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 mb-6"
                  whileHover={{ scale: 1.1 }}
                >
                  <Briefcase className="h-8 w-8 text-primary" />
                </motion.div>

                <h2 className="text-2xl font-bold text-foreground mb-3">
                  I&apos;m a Provider
                </h2>
                <p className="text-muted-foreground mb-6 flex-1 leading-relaxed">
                  Offer your services and grow your business on ServiceHub.
                </p>

                <ul className="space-y-3 mb-6 w-full">
                  {[
                    "Manage your schedule",
                    "Get reliable bookings",
                    "Transparent work history",
                  ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-accent flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {selectedRole === "provider" && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute top-4 right-4"
                >
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white">
                    <CheckCircle className="h-4 w-4" />
                  </div>
                </motion.div>
              )}
            </Card>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/auth/login">
            <Button
              variant="outline"
              className="border-border hover:bg-muted w-full sm:w-auto"
            >
              Back to Login
            </Button>
          </Link>

          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              onClick={handleContinue}
              disabled={!selectedRole || isLoading}
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium w-full sm:w-auto"
            >
              {isLoading ? "Loading..." : "Continue"}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
