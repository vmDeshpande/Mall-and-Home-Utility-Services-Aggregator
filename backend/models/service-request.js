import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
  serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true, index: true },

  serviceType: { type: String, trim: true },
  requestType: {
    type: String,
    enum: ["instant", "scheduled"],
    default: "scheduled",
  },
  status: {
    type: String,
    enum: ["requested", "assigned", "accepted", "rejected", "in-progress", "completed", "cancelled"],
    default: "requested"
  },

  location: {
    lat: Number,
    lng: Number,
    address: { type: String, trim: true, required: true }
  },

  scheduledTime: Date,
  price: { type: Number, min: 0, default: 0 },
  notes: { type: String, trim: true, maxlength: 1000 },
  dispute: {
    status: {
      type: String,
      enum: ["none", "open", "resolved"],
      default: "none",
    },
    reason: String,
    resolvedAt: Date,
  },

  requestedAt: Date,
  acceptedAt: Date,
  completedAt: Date
}, { timestamps: true });

requestSchema.index({ status: 1, createdAt: -1 });

export default mongoose.model("ServiceRequest", requestSchema);
