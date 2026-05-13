import ServiceRequest from "../models/service-request.js";
import Provider from "../models/provider.js";
import User from "../models/user.js";
import Review from "../models/review.js";

const monthLabel = (date) =>
  new Date(date.getFullYear(), date.getMonth(), 1).toLocaleString("en", {
    month: "short",
  });

export const getAnalytics = async (req, res) => {
  try {
    const [requests, providers, users, reviews] = await Promise.all([
      ServiceRequest.find()
        .populate("serviceId")
        .populate("userId", "name")
        .sort({ createdAt: -1 }),
      Provider.find().populate("userId", "name"),
      User.find().select("role createdAt"),
      Review.find(),
    ]);

    const totalRequests = requests.length;
    const completedRequests = requests.filter((request) => request.status === "completed");
    const activeProviders = providers.filter(
      (provider) => provider.verification?.status === "approved",
    );
    const totalRevenue = completedRequests.reduce(
      (sum, request) => sum + Number(request.price || 0),
      0,
    );
    const averageRating =
      reviews.length > 0
        ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
        : 0;

    const statusCounts = requests.reduce((acc, request) => {
      acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});

    const categoryCounts = requests.reduce((acc, request) => {
      const name = request.serviceId?.name || request.serviceType || "Utility Service";
      acc[name] = (acc[name] || 0) + 1;
      return acc;
    }, {});

    const currentMonth = new Date();
    const trend = Array.from({ length: 6 }, (_, offset) => {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - (5 - offset), 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const monthRequests = requests.filter((request) => {
        const created = new Date(request.createdAt);
        return created.getMonth() === month && created.getFullYear() === year;
      });

      return {
        month: monthLabel(date),
        bookings: monthRequests.length,
        completed: monthRequests.filter((request) => request.status === "completed").length,
        cancelled: monthRequests.filter((request) => request.status === "cancelled").length,
        revenue: monthRequests
          .filter((request) => request.status === "completed")
          .reduce((sum, request) => sum + Number(request.price || 0), 0),
      };
    });

    res.json({
      summary: {
        totalUsers: users.length,
        totalProviders: providers.length,
        verifiedProviders: activeProviders.length,
        totalRequests,
        completedRequests: completedRequests.length,
        pendingRequests: requests.filter((request) => request.status === "requested").length,
        totalRevenue,
        averageRating: Number(averageRating.toFixed(1)),
        completionRate:
          totalRequests > 0
            ? Number(((completedRequests.length / totalRequests) * 100).toFixed(1))
            : 0,
      },
      statusDistribution: Object.entries(statusCounts).map(([name, value]) => ({
        name,
        value,
      })),
      categoryBreakdown: Object.entries(categoryCounts).map(([name, value]) => ({
        name,
        value,
      })),
      trend,
      recentRequests: requests.slice(0, 10),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
