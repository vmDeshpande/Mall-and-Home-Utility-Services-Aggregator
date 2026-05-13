import mongoose from "mongoose";

const settingsSchema = new mongoose.Schema(
  {
    maintenanceMode: Boolean,
    requireVerification: Boolean,
    autoApproveProviders: Boolean,
    requireInsurance: Boolean,

    platformFee: Number,

    allowInstantBooking: Boolean,
    cancellationWindowHours: Number,
    urgentFeePercentage: Number,
  },
  { timestamps: true }
);

export default mongoose.model("Settings", settingsSchema);