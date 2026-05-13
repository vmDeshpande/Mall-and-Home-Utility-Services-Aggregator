import Provider from "../models/provider.js";
import Service from "../models/service.js";
import cloudinary from "../config/cloudinary.js";

const generateSignedUrl = (publicId) => {
  if (!publicId) return null;

  return cloudinary.url(publicId, {
    type: "authenticated",
    sign_url: true,
    expires_at: Math.floor(Date.now() / 1000) + 60 * 5, // 5 min
  });
};

export const getProviders = async (req, res) => {
  try {
    const { serviceId, serviceType, availability, verified, location } = req.query;

    const providers = await Provider.find(
      serviceId ? { "services.serviceId": serviceId } : {}
    )
      .populate("userId")
      .populate("services.serviceId");

    let updatedProviders = providers.map((p) => {
      const obj = p.toObject();

      if (obj.verification?.identityProof) {
        obj.verification.identityProof = generateSignedUrl(
          obj.verification.identityProof
        );
      }

      if (obj.verification?.skillProof) {
        obj.verification.skillProof = generateSignedUrl(
          obj.verification.skillProof
        );
      }

      return obj;
    });

    if (serviceType) {
      const needle = serviceType.toLowerCase();
      updatedProviders = updatedProviders.filter((provider) =>
        provider.services?.some((item) =>
          item.serviceId?.name?.toLowerCase().includes(needle),
        ),
      );
    }

    if (availability) {
      updatedProviders = updatedProviders.filter(
        (provider) =>
          provider.availabilityType === availability ||
          provider.online === (availability === "online"),
      );
    }

    if (verified !== undefined) {
      const expected = verified === "true" ? "approved" : "pending";
      updatedProviders = updatedProviders.filter(
        (provider) => provider.verification?.status === expected,
      );
    }

    if (location) {
      const needle = location.toLowerCase();
      updatedProviders = updatedProviders.filter((provider) =>
        provider.userId?.location?.name?.toLowerCase().includes(needle),
      );
    }

    res.json(updatedProviders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProvider = async (req, res) => {
  try {
    const allowedFields = [
      "services",
      "availability",
      "availabilityType",
      "online",
      "receiveNotifications",
      "allowUrgent",
      "pricing",
    ];

    const updateData = {};

    if (req.body.services) {
      for (const svc of req.body.services) {
        const service = await Service.findById(svc.serviceId);

        if (!service) {
          return res.status(400).json({ msg: "Service not found" });
        }

        const hourly = Number(svc.hourly);

        if (hourly < service.pricing.min || hourly > service.pricing.max) {
          return res.status(400).json({
            msg: `${service.name} price must be between ${service.pricing.min} and ${service.pricing.max}`,
          });
        }
      }
    }

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updateData[field] = req.body[field];
      }
    });

    const updated = await Provider.findOneAndUpdate(
      { userId: req.params.id },
      { $set: updateData },
      { new: true }
    ).populate("services.serviceId");

    if (!updated) {
      return res.status(404).json({ msg: "Provider not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProvider = async (req, res) => {
  try {
    let provider = await Provider.findOne({ userId: req.params.id })
      .populate("services.serviceId");

    if (!provider) {
      provider = await Provider.create({
        userId: req.params.id,
        services: [],
        pricing: { hourly: 0, baseRate: 0 },
        availabilityType: "flexible",
        availability: {
          monday: true,
          tuesday: true,
          wednesday: true,
          thursday: true,
          friday: true,
          saturday: true,
          sunday: false,
        },
      });
    }

    res.json(provider);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const verifyProvider = async (req, res) => {
  try {
    const { status } = req.body;

    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      {
        "verification.status": status,
      },
      { new: true }
    );

    res.json(provider);
  } catch (err) {
    res.status(500).json({ msg: "Verification update failed" });
  }
};
