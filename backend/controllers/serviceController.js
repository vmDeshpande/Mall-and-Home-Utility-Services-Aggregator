import Service from "../models/service.js";

const defaultServices = [
  { name: "electrician", pricing: { min: 100, base: 250, max: 1000 } },
  { name: "plumber", pricing: { min: 100, base: 250, max: 1000 } },
  { name: "carpenter", pricing: { min: 150, base: 350, max: 1500 } },
  { name: "tailor", pricing: { min: 50, base: 150, max: 800 } },
  { name: "maintenance staff", pricing: { min: 100, base: 300, max: 1200 } },
];

const ensureDefaultServices = async () => {
  await Promise.all(
    defaultServices.map((service) =>
      Service.updateOne(
        { name: service.name },
        { $setOnInsert: service },
        { upsert: true },
      ),
    ),
  );
};

// GET ALL
export const getServices = async (req, res) => {
  try {
    await ensureDefaultServices();
    const services = await Service.find();
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE
export const createService = async (req, res) => {
  try {
    const { name, pricing } = req.body;

    if (!name?.trim()) {
      return res.status(400).json({ msg: "Service name is required" });
    }

    if (
      !pricing ||
      Number(pricing.min) < 0 ||
      Number(pricing.base) < Number(pricing.min) ||
      Number(pricing.max) < Number(pricing.base)
    ) {
      return res.status(400).json({ msg: "Valid min, base, and max pricing is required" });
    }

    const normalizedName = name.trim().toLowerCase();

    const exists = await Service.findOne({ name: normalizedName });
    if (exists) {
      return res.status(400).json({ msg: "Service already exists" });
    }

    const service = await Service.create({
      name: normalizedName,
      pricing,
    });

    res.json(service);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// UPDATE
export const updateService = async (req, res) => {
  try {
    if (req.body.pricing) {
      const { min, base, max } = req.body.pricing;

      if (Number(min) < 0 || Number(base) < Number(min) || Number(max) < Number(base)) {
        return res.status(400).json({ msg: "Valid min, base, and max pricing is required" });
      }
    }

    if (req.body.name) {
      req.body.name = req.body.name.trim().toLowerCase();
    }

    const updated = await Service.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Service not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE
export const deleteService = async (req, res) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.json({ msg: "Service deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
