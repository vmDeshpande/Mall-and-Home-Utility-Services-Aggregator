import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
      hourly: Number,
    }
  ],
  pricing: {
    hourly: Number,
    baseRate: Number,
  },
  availabilityType: {
    type: String,
    enum: ["full-time", "part-time", "weekends", "flexible"],
    default: "flexible",
  },
  availability: {
    monday: Boolean,
    tuesday: Boolean,
    wednesday: Boolean,
    thursday: Boolean,
    friday: Boolean,
    saturday: Boolean,
    sunday: Boolean,
  },
  verification: {
    identityProof: String,
    skillProof: String,
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  online: Boolean,
  receiveNotifications: Boolean,
  allowUrgent: Boolean,
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  totalJobs: { type: Number, default: 0 },
}, { timestamps: true });

export default mongoose.model("Provider", providerSchema);