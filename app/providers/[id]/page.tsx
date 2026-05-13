"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { fallbackServices } from "@/lib/catalog";
import { api } from "@/lib/api";
import { mapApiProvider } from "@/lib/provider-transform";
import type { Provider } from "@/lib/types";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/ui/star-rating";
import { StarInput } from "@/components/ui/star-input";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  CheckCircle,
  Clock,
  Award,
  DollarSign,
  MessageCircle,
  Phone,
} from "lucide-react";
export default function ProviderProfilePage() {
  const [providerReviews, setProviderReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const params = useParams<{ id: string }>();
  const [provider, setProvider] = useState<Provider | null>(null);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    setBookingId(new URLSearchParams(window.location.search).get("booking"));

    const loadProvider = async () => {
      try {
        const data = await api.getProviders();
        const mapped = data.map(mapApiProvider);
        const found = mapped.find((item: Provider) => item.id === params.id);
        if (found) setProvider(found);
        if (!found) setLoadError("Provider not found");
      } catch (err) {
        setLoadError(err instanceof Error ? err.message : "Unable to load provider");
      }
    };

    loadProvider();
  }, [params.id]);

  useEffect(() => {
    if (!provider?.id) return;

    const loadReviews = async () => {
      try {
        const data = await api.getReviews({ providerId: provider.id });

        const mapped = data.map((r: any) => ({
          id: r._id,
          author: r.userId?.name || "User",
          avatar: r.userId?.avatar,
          rating: r.rating,
          comment: r.comment,
          date: new Date(r.createdAt).toLocaleDateString(),
        }));

        setProviderReviews(mapped);
      } catch (err) {
        setProviderReviews([]);
      } finally {
        setReviewLoading(false);
      }
    };

    loadReviews();
  }, [provider?.id]);

  const handleSubmitReview = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      if (!provider) return;

      if (!user?._id) {
        alert("Login required");
        return;
      }

      if (!newRating) {
        alert("Please select rating");
        return;
      }

      setSubmitting(true);

      const created = await api.createReview({
        userId: user._id,
        providerId: provider?._id || provider?.id,
        rating: newRating,
        comment: newComment,
        requestId: bookingId || undefined,
      });

      const mapped = {
        id: created._id,
        author: created.userId?.name,
        avatar: created.userId?.avatar,
        rating: created.rating,
        comment: created.comment,
        date: new Date(created.createdAt).toLocaleDateString(),
      };

      setProviderReviews((prev) => [mapped, ...prev]);

      setNewRating(0);
      setNewComment("");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Review submission failed");
    } finally {
      setSubmitting(false);
    }
  };

  const providerServices = useMemo(
    () =>
      provider?.services?.length
        ? provider.services
        : provider
          ? fallbackServices.filter((s) => s.category === provider.category)
          : [],
    [provider],
  );

  if (!provider) {
    return (
      <main className="bg-background min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <h1 className="text-2xl font-bold mb-2">{loadError || "Provider not found"}</h1>
          <Link href="/providers">
            <Button>Back to providers</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="bg-background min-h-screen">
      {/* Profile Header */}
      <div className="bg-gradient-to-b from-secondary via-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Avatar & Basic Info */}
            <div className="md:col-span-1">
              <div className="flex flex-col items-center md:items-start gap-4">
                <img
                  src={provider.avatar}
                  alt={provider.name}
                  className="h-40 w-40 rounded-full object-cover border-4 border-primary"
                />
                <div className="text-center md:text-left">
                  <h1 className="text-3xl font-bold text-foreground">
                    {provider.name}
                  </h1>
                  <p className="text-muted-foreground capitalize text-lg mb-3">
                    {provider.category}
                  </p>

                  {provider.verified && (
                    <Badge className="bg-accent text-accent-foreground inline-flex gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Verified Professional
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="md:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-6 text-center border-border">
                  <div className="text-2xl font-bold text-primary">
                    {provider.rating || 0}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Average Rating
                  </p>
                  <StarRating
                    rating={provider.rating}
                    size="sm"
                    className="justify-center mt-2"
                  />
                </Card>

                <Card className="p-6 text-center border-border">
                  <div className="text-2xl font-bold text-primary">
                    {provider.reviews}
                  </div>
                  <p className="text-sm text-muted-foreground">Reviews</p>
                </Card>

                <Card className="p-6 text-center border-border">
                  <div className="text-2xl font-bold text-primary">
                    ${provider.price}
                  </div>
                  <p className="text-sm text-muted-foreground">Per Hour</p>
                </Card>

                <Card className="p-6 text-center border-border">
                  <div className="text-2xl font-bold text-primary">
                    {provider.completedJobs}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Jobs Completed
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="p-8 border-border">
              <h2 className="text-2xl font-bold mb-4">About</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {provider.description}
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    {provider.distance} km away
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    {provider.availability}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <Award className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">
                    {provider.completedJobs}+ successful jobs
                  </span>
                </div>
              </div>
            </Card>

            {/* Services Section */}
            <Card className="p-8 border-border">
              <h2 className="text-2xl font-bold mb-6">Services & Pricing</h2>
              <div className="space-y-4">
                {providerServices.map((service) => (
                  <div
                    key={service.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted transition-colors"
                  >
                    <div>
                      <h3 className="font-semibold text-foreground">
                        {service.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {service.duration}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {service.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-primary">
                        ${service.price}
                      </div>
                      <p className="text-xs text-muted-foreground">One-time</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Reviews Section */}
            <Card className="p-8 border-border">
              <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
              <div className="mb-6 space-y-3">
                <h3 className="font-semibold">Write a Review</h3>

                <StarInput value={newRating} onChange={setNewRating} />

                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your experience..."
                  className="w-full border rounded-lg p-2 text-sm"
                />

                <Button onClick={handleSubmitReview} disabled={submitting}>
                  {submitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
              {reviewLoading ? (
                <p className="text-muted-foreground text-center py-8">
                  Loading reviews...
                </p>
              ) : providerReviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No reviews yet. Be the first to review!
                </p>
              ) : (
                <div className="space-y-6">
                  {providerReviews.map((review) => (
                    <div
                      key={review.id}
                      className="border-b border-border pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {review.author}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {review.date}
                          </p>
                        </div>
                        <StarRating rating={review.rating} size="sm" />
                      </div>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <Card className="p-8 border-border sticky top-24">
              <h3 className="text-xl font-bold mb-6">Ready to book?</h3>

              <div className="space-y-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Starting from</span>
                  <span className="text-2xl font-bold text-primary">
                    ${provider.price}/hr
                  </span>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    This professional offers quality service with proven track
                    record.
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Verified professional</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>Insured & licensed</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-accent flex-shrink-0" />
                      <span>100% satisfaction</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-3">
                <Link
                  href={`/booking?provider=${provider.id}`}
                  className="block"
                >
                  <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-base py-6">
                    Book Service
                  </Button>
                </Link>

                {provider.phone ? (
                  <>
                    <Button asChild variant="outline" className="w-full border-border">
                      <a href={`sms:${provider.phone}`}>
                        <MessageCircle className="h-5 w-5 mr-2" />
                        Message
                      </a>
                    </Button>

                    <Button asChild variant="outline" className="w-full border-border">
                      <a href={`tel:${provider.phone}`}>
                        <Phone className="h-5 w-5 mr-2" />
                        Call
                      </a>
                    </Button>
                  </>
                ) : provider.email ? (
                  <Button asChild variant="outline" className="w-full border-border">
                    <a href={`mailto:${provider.email}?subject=Service enquiry`}>
                      <MessageCircle className="h-5 w-5 mr-2" />
                      Email
                    </a>
                  </Button>
                ) : (
                  <>
                    <Button disabled variant="outline" className="w-full border-border">
                      <MessageCircle className="h-5 w-5 mr-2" />
                      No Message Contact
                    </Button>
                    <Button disabled variant="outline" className="w-full border-border">
                      <Phone className="h-5 w-5 mr-2" />
                      No Phone Available
                    </Button>
                  </>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}
