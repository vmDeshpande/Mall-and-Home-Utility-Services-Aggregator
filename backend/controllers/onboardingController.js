import User from "../models/user.js";
import Provider from "../models/provider.js";
import Service from "../models/service.js";

// CUSTOMER
export const completeCustomerOnboarding = async (req, res) => {
  try {
    const { userId, fullName, phone, address, city, zipCode, preferences } = req.body;

    if (!userId) return res.status(400).json({ msg: "User is required" });

    const fullAddress = [address, city, zipCode].filter(Boolean).join(", ");

    const user = await User.findByIdAndUpdate(
      userId,
      {
        ...(fullName ? { name: fullName } : {}),
        phone,
        location: {
          name: city || fullAddress,
        },
        addresses: fullAddress
          ? [
              {
                label: "Primary",
                address: fullAddress,
                isDefault: true,
              },
            ]
          : [],
        preferences,
      },
      { new: true }
    ).select("-password");

    if (!user) return res.status(404).json({ msg: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PROVIDER
export const completeProviderOnboarding = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      bio,
      hourlyRate,
      availability,
    } = req.body;

    if (!userId) return res.status(400).json({ msg: "User is required" });
    if (!fullName?.trim()) return res.status(400).json({ msg: "Full name is required" });

    const serviceCategories = JSON.parse(req.body.serviceCategories || "[]");
    if (!serviceCategories.length) {
      return res.status(400).json({ msg: "Select at least one service" });
    }

    const hourly = Number(hourlyRate);
    if (!Number.isFinite(hourly) || hourly <= 0) {
      return res.status(400).json({ msg: "Enter a valid hourly rate" });
    }

    const identityFile = req.files?.identityProof?.[0];
    const skillFile = req.files?.skillProof?.[0];

    const identityPublicId = identityFile?.filename;
    const skillPublicId = skillFile?.filename;

    await User.findByIdAndUpdate(userId, {
      name: fullName,
      phone,
      bio,
    });

    const normalizeService = (service) => {
      const value = String(service).toLowerCase();
      if (value.includes("plumb")) return "plumber";
      if (value.includes("electric")) return "electrician";
      if (value.includes("carpent")) return "carpenter";
      if (value.includes("tailor") || value.includes("stitch")) return "tailor";
      if (value.includes("maintenance")) return "maintenance staff";
      return value;
    };

    const normalizedServices = serviceCategories.map(normalizeService);

    const servicesFromDB = await Service.find({
      name: { $in: normalizedServices },
    });

    if (servicesFromDB.length !== normalizedServices.length) {
      return res.status(400).json({ msg: "One or more selected services are unavailable" });
    }

    const services = servicesFromDB.map((s) => ({
      serviceId: s._id,
      hourly,
    }));

    const provider = await Provider.findOneAndUpdate(
      { userId },
      {
        userId,
        services,
        availabilityType: availability,
        availability: {
          monday: availability === "full-time" || availability === "part-time",
          tuesday: availability === "full-time" || availability === "part-time",
          wednesday: availability === "full-time" || availability === "part-time",
          thursday: availability === "full-time" || availability === "part-time",
          friday: availability === "full-time" || availability === "part-time",
          saturday: availability === "weekends" || availability === "flexible",
          sunday: availability === "weekends" || availability === "flexible",
        },
        pricing: {
          hourly,
          baseRate: hourly,
        },
        verification: {
          identityProof: identityPublicId,
          skillProof: skillPublicId,
          status: "pending",
        },
      },
      { new: true, upsert: true }
    );

    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
