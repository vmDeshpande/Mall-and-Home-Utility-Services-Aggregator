"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { User, MapPin, ChevronRight, ChevronLeft } from "lucide-react";
import { api } from "@/lib/api";

const STEPS = [
  { id: 1, title: "Profile Details", icon: User },
  { id: 2, title: "Location & Preferences", icon: MapPin },
];

export default function CustomerOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Profile
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");

  // Step 2: Location
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);

  const handleNext = () => {
    if (currentStep === 1 && (!fullName.trim() || !phone.trim())) {
      setError("Enter your name and phone number so providers can coordinate your booking.");
      return;
    }

    if (currentStep === 2 && (!address.trim() || !city.trim())) {
      setError("Enter at least your street address and city.");
      return;
    }

    setError("");

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    setError("");
    await handleComplete();
  };

  const handleComplete = async () => {
    setIsLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) {
        setError("Please sign in before completing onboarding.");
        return;
      }

      const updatedUser = await api.completeCustomerOnboarding({
        userId: user._id,
        fullName,
        phone,
        address,
        city,
        zipCode,
        preferences,
      });

      localStorage.setItem("user", JSON.stringify(updatedUser));
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Customer onboarding failed");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                placeholder="John Doe"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                This information will be shared with service providers you book.
              </p>
            </div>
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Street Address</label>
              <Input
                placeholder="123 Main St"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">City</label>
                <Input
                  placeholder="New York"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">ZIP Code</label>
                <Input
                  placeholder="10001"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-sm font-medium">Service Preferences</label>
              <div className="space-y-2">
                {[
                  "Plumbing",
                  "Electrician",
                  "Carpentry",
                  "Tailor",
                  "Maintenance Staff",
                ].map((service) => (
                  <label
                    key={service}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={preferences.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setPreferences([...preferences, service]);
                        } else {
                          setPreferences(
                            preferences.filter((p) => p !== service),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  const currentStepData = STEPS[currentStep - 1];
  const CurrentIcon = currentStepData?.icon || User;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center px-4 py-8">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 h-72 w-72 rounded-full bg-primary/8 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 h-72 w-72 rounded-full bg-accent/8 blur-3xl"></div>
      </div>

      <motion.div
        className="relative w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome to ServiceHub
          </h1>
          <p className="text-muted-foreground">
            Step {currentStep} of {STEPS.length}
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between mb-4">
            {STEPS.map((step) => (
              <motion.button
                key={step.id}
                onClick={() =>
                  step.id <= currentStep && setCurrentStep(step.id)
                }
                className={`flex flex-col items-center gap-2 flex-1 ${
                  step.id <= currentStep ? "opacity-100" : "opacity-50"
                }`}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    step.id === currentStep
                      ? "bg-primary text-white scale-110"
                      : step.id < currentStep
                        ? "bg-accent text-white"
                        : "bg-border text-muted-foreground"
                  }`}
                >
                  <step.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium hidden md:block">
                  {step.title}
                </span>
              </motion.button>
            ))}
          </div>

          <div className="h-2 bg-border rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary to-accent"
              initial={{ width: 0 }}
              animate={{ width: `${(currentStep / STEPS.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* Form Card */}
        <Card className="p-8 bg-card/50 backdrop-blur border border-border/50 mb-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <CurrentIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-2xl font-bold">{currentStepData?.title}</h2>
            </div>
          </div>

          <AnimatePresence mode="wait">{renderStep()}</AnimatePresence>
          {error && (
            <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <div className="flex gap-2">
            <Button
              onClick={handlePrevious}
              variant="outline"
              className="border-border"
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep === STEPS.length && (
              <Button variant="ghost" onClick={handleSkip} disabled={isLoading}>
                Skip for now
              </Button>
            )}
          </div>

          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              "Setting up..."
            ) : currentStep === STEPS.length ? (
              <>
                Get Started <ChevronRight className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
