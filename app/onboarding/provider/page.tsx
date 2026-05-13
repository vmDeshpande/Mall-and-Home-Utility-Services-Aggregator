"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Wrench,
  Calendar,
  CreditCard,
  ChevronRight,
  ChevronLeft,
  FileText,
} from "lucide-react";
import { api } from "@/lib/api";

const STEPS = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Services", icon: Wrench },
  { id: 3, title: "Availability", icon: Calendar },
  { id: 4, title: "Payout", icon: CreditCard },
  { id: 5, title: "Verification", icon: FileText },
];

export default function ProviderOnboardingPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Step 1: Personal Info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");

  // Step 2: Services
  const [serviceCategories, setServiceCategories] = useState<string[]>([]);
  const [hourlyRate, setHourlyRate] = useState("");

  // Step 3: Availability
  const [availability, setAvailability] = useState("full-time");

  const [acceptedTerms, setAcceptedTerms] = useState(false);

  // Step 5: Verification
  const [identityFile, setIdentityFile] = useState<File | null>(null);
  const [skillFile, setSkillFile] = useState<File | null>(null);

  const validateCurrentStep = () => {
    if (currentStep === 1 && (!fullName.trim() || !phone.trim() || bio.trim().length < 20)) {
      return "Enter your name, phone, and a short bio of at least 20 characters.";
    }

    if (currentStep === 2 && (!serviceCategories.length || Number(hourlyRate) <= 0)) {
      return "Select at least one service and enter a valid hourly rate.";
    }

    if (currentStep === 4 && !acceptedTerms) {
      return "Accept the provider terms before continuing.";
    }

    if (currentStep === 5 && (!identityFile || !skillFile)) {
      return "Upload both identity and skill verification documents.";
    }

    return "";
  };

  const handleNext = () => {
    const validationError = validateCurrentStep();
    if (validationError) {
      setError(validationError);
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

  const handleComplete = async () => {
    setIsLoading(true);
    setError("");

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!user?._id) {
        setError("Please sign in before completing provider onboarding.");
        return;
      }

      const formData = new FormData();

      formData.append("userId", user._id);
      formData.append("fullName", fullName);
      formData.append("phone", phone);
      formData.append("bio", bio);
      formData.append("availability", availability);
      formData.append("hourlyRate", hourlyRate);

      formData.append("serviceCategories", JSON.stringify(serviceCategories));

      if (identityFile) {
        formData.append("identityProof", identityFile);
      }

      if (skillFile) {
        formData.append("skillProof", skillFile);
      }

      const provider = await api.completeProviderOnboarding(formData);
      localStorage.setItem("provider", JSON.stringify(provider));

      router.push("/provider/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Provider onboarding failed");
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
                placeholder="John Smith"
                value={fullName ?? ""}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                placeholder="+1 (555) 123-4567"
                value={phone ?? ""}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Professional Bio</label>
              <textarea
                className="w-full min-h-24 px-4 py-2 rounded-lg border border-border bg-background text-foreground"
                placeholder="Tell customers about your experience and expertise..."
                value={bio ?? ""}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Include your experience, service area, and the kinds of tasks you handle.
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
            <div className="space-y-4">
              <label className="text-sm font-medium">Services You Offer</label>
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
                      checked={serviceCategories.includes(service)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setServiceCategories([...serviceCategories, service]);
                        } else {
                          setServiceCategories(
                            serviceCategories.filter((s) => s !== service),
                          );
                        }
                      }}
                      className="rounded"
                    />
                    <span>{service}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Hourly Rate ($)</label>
              <Input
                type="number"
                placeholder="50"
                value={hourlyRate ?? ""}
                onChange={(e) => setHourlyRate(e.target.value)}
              />
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <label className="text-sm font-medium">
                When are you available?
              </label>
              <div className="space-y-3">
                {[
                  { value: "full-time", label: "Full Time (40+ hours/week)" },
                  { value: "part-time", label: "Part Time (20-40 hours/week)" },
                  { value: "weekends", label: "Weekends Only" },
                  { value: "flexible", label: "Flexible Hours" },
                ].map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="availability"
                      value={option.value}
                      checked={availability === option.value}
                      onChange={(e) => setAvailability(e.target.value)}
                      className="rounded-full"
                    />
                    <span>{option.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                Phase 1 does not process in-app payments. Completed service value is tracked in your earnings dashboard for manual settlement.
              </p>
            </div>

            <label className="flex items-start gap-3 p-3 rounded-lg border border-border hover:bg-muted cursor-pointer">
              <input
                type="checkbox"
                className="rounded mt-1"
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
              />
              <span className="text-sm">
                I agree to the provider terms, manual verification review, and service quality requirements.
              </span>
            </label>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="space-y-6">
            <div>
              <label className="text-sm font-medium">Upload ID Proof</label>
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setIdentityFile(e.target.files?.[0] || null)}
              />
            </div>

            <div>
              <label className="text-sm font-medium">
                Upload Skill Certificate
              </label>
              <input
                type="file"
                accept="image/*"
                className="w-full border rounded px-3 py-2"
                onChange={(e) => setSkillFile(e.target.files?.[0] || null)}
              />
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
            Complete Your Profile
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
          <Button
            onClick={handlePrevious}
            variant="outline"
            className="border-border"
            disabled={currentStep === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>

          <Button
            onClick={handleNext}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              "Setting up..."
            ) : currentStep === STEPS.length ? (
              <>
                Complete <ChevronRight className="h-4 w-4 ml-2" />
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
