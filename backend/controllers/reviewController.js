import Review from "../models/review.js";
import Provider from "../models/provider.js";
import ServiceRequest from "../models/service-request.js";

export const getReviews = async (req, res) => {
  try {
    const { providerId, userId } = req.query;
    const filter = {};

    if (providerId) filter.providerId = providerId;
    if (userId) filter.userId = userId;

    const reviews = await Review.find(filter)
      .populate("userId", "name avatar")
      .populate({
        path: "providerId",
        populate: { path: "userId", select: "name avatar" },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { userId, providerId, rating, comment, requestId } = req.body;

    if (!userId || !providerId || !rating) {
      return res.status(400).json({ msg: "User, provider, and rating are required" });
    }

    const numericRating = Number(rating);
    if (numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ msg: "Rating must be between 1 and 5" });
    }

    if (requestId) {
      const completedRequest = await ServiceRequest.findOne({
        _id: requestId,
        userId,
        providerId,
        status: "completed",
      });

      if (!completedRequest) {
        return res.status(400).json({ msg: "Reviews are allowed after completed service requests" });
      }
    }

    const review = await Review.create({
      userId,
      providerId,
      rating: numericRating,
      comment,
    });

    const stats = await Review.aggregate([
      { $match: { providerId: review.providerId } },
      {
        $group: {
          _id: "$providerId",
          averageRating: { $avg: "$rating" },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    if (stats[0]) {
      await Provider.findByIdAndUpdate(providerId, {
        rating: Number(stats[0].averageRating.toFixed(1)),
        reviewCount: stats[0].reviewCount,
      });
    }

    const populated = await Review.findById(review._id).populate("userId", "name avatar");

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
