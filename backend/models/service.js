import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  name: { type: String, unique: true },

  pricing: {
    min: Number,
    base: Number,
    max: Number,
  },
}, { timestamps: true });

export default mongoose.model("Service", serviceSchema);