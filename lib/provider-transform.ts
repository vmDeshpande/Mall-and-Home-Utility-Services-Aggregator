import { categories, fallbackServices } from "@/lib/catalog";
import type { Provider, Service, ServiceCategory } from "@/lib/types";

const normalizeCategory = (name = ""): ServiceCategory => {
  const value = name.toLowerCase();

  if (value.includes("electric")) return "electrical";
  if (value.includes("carpenter")) return "carpentry";
  if (value.includes("tailor") || value.includes("stitch")) return "tailoring";
  if (value.includes("maintenance")) return "maintenance";
  return "plumbing";
};

export function mapApiProvider(provider: any): Provider {
  const firstService = provider.services?.[0];
  const firstServiceName = firstService?.serviceId?.name || "Utility Service";
  const category = normalizeCategory(firstServiceName);
  const categoryLabel =
    categories.find((item) => item.id === category)?.name || firstServiceName;
  const hourly =
    firstService?.hourly ||
    provider.pricing?.hourly ||
    firstService?.serviceId?.pricing?.base ||
    0;

  const mappedServices: Service[] = Array.isArray(provider.services)
    ? provider.services.map((item: any) => ({
        id: item.serviceId?._id || item.serviceId || provider._id,
        name: item.serviceId?.name || categoryLabel,
        description: `${categoryLabel} service offered by ${provider.userId?.name || "provider"}`,
        price: item.hourly || hourly,
        duration: "Provider confirmed",
        category,
      }))
    : fallbackServices.filter((service) => service.category === category);

  return {
    id: provider._id,
    _id: provider._id,

    userId: provider.userId?._id || provider.userId,
    phone: provider.userId?.phone,
    email: provider.userId?.email,

    name: provider.userId?.name || "Service Provider",

    avatar:
      provider.userId?.avatar ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${provider._id}`,

    rating: provider.rating || 0,
    reviews: provider.reviewCount || 0,
    price: hourly,
    distance: 1,

    verified: provider.verification?.status === "approved",

    category,

    description:
      provider.userId?.bio ||
      `${categoryLabel} professional available for home, apartment, shop, and mall tasks.`,

    availability: provider.online
      ? "Available now"
      : provider.availabilityType || "Flexible",

    completedJobs: provider.totalJobs || 0,

    services: mappedServices,
  };
}
