import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  label: String, // Home, Work
  address: String,
  isDefault: { type: Boolean, default: false },
});

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    bio: {
      type: String,
      default: "",
    },

    avatar: {
      type: String,
      default: "https://api.dicebear.com/9.x/micah/svg",
    },

    role: {
      type: String,
      enum: ["user", "provider", "admin"],
      default: "user",
    },

    // Saved addresses
    addresses: [addressSchema],

    // Current selected location (for search)
    location: {
      name: String,
      lat: Number,
      lng: Number,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);