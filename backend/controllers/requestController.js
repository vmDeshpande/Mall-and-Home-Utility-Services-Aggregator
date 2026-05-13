import ServiceRequest from "../models/service-request.js";
import Provider from "../models/provider.js";
import Service from "../models/service.js";

const allowedStatuses = [
  "requested",
  "assigned",
  "accepted",
  "rejected",
  "in-progress",
  "completed",
  "cancelled",
];

const statusTransitions = {
  requested: ["assigned", "accepted", "rejected", "cancelled"],
  assigned: ["accepted", "in-progress", "cancelled"],
  accepted: ["in-progress", "cancelled"],
  rejected: [],
  "in-progress": ["completed", "cancelled"],
  completed: [],
  cancelled: [],
};

const populateRequest = (query) =>
  query
    .populate("userId", "name email phone avatar")
    .populate({
      path: "providerId",
      populate: [
        { path: "userId", select: "name email phone avatar" },
        { path: "services.serviceId" },
      ],
    })
    .populate("serviceId");

export const createRequest = async (req, res) => {
  try {
    const data = req.body;
    const requiredFields = ["userId", "providerId", "serviceId"];

    for (const field of requiredFields) {
      if (!data[field]) {
        return res.status(400).json({ msg: `${field} is required` });
      }
    }

    if (!data.location?.address?.trim()) {
      return res.status(400).json({ msg: "Service address is required" });
    }

    const provider = await Provider.findById(data.providerId);
    if (!provider) return res.status(404).json({ msg: "Provider not found" });

    if (provider.verification?.status !== "approved") {
      return res.status(400).json({ msg: "Provider is not approved yet" });
    }

    const service = await Service.findById(data.serviceId);
    if (!service) return res.status(404).json({ msg: "Service not found" });

    const offersService = provider.services.some(
      (item) => item.serviceId?.toString() === data.serviceId,
    );

    if (!offersService) {
      return res.status(400).json({ msg: "Provider does not offer this service" });
    }

    const scheduledTime = data.scheduledTime ? new Date(data.scheduledTime) : null;

    if (data.requestType !== "instant" && (!scheduledTime || Number.isNaN(scheduledTime.getTime()))) {
      return res.status(400).json({ msg: "A valid scheduled time is required" });
    }

    const request = await ServiceRequest.create({
      userId: data.userId,
      providerId: data.providerId,
      serviceId: data.serviceId,
      serviceType: data.serviceType || service.name,
      requestType: data.requestType === "instant" ? "instant" : "scheduled",
      status: "requested",
      scheduledTime,
      location: data.location,
      price: Number(data.price || service.pricing?.base || 0),
      notes: data.notes,
      requestedAt: new Date(),
    });

    const populated = await populateRequest(ServiceRequest.findById(request._id));
    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRequests = async (req, res) => {
  try {
    const { userId, providerId, status, serviceId, requestType } = req.query;
    const filter = {};

    if (userId) filter.userId = userId;
    if (providerId) filter.providerId = providerId;
    if (status) filter.status = status;
    if (serviceId) filter.serviceId = serviceId;
    if (requestType) filter.requestType = requestType;

    const requests = await populateRequest(
      ServiceRequest.find(filter).sort({ createdAt: -1 })
    );

    res.json(requests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getRequestById = async (req, res) => {
  try {
    const request = await populateRequest(ServiceRequest.findById(req.params.id));

    if (!request) return res.status(404).json({ msg: "Request not found" });

    res.json(request);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ msg: "Invalid request status" });
    }

    const existing = await ServiceRequest.findById(req.params.id);
    if (!existing) return res.status(404).json({ msg: "Request not found" });

    if (!statusTransitions[existing.status]?.includes(status)) {
      return res.status(400).json({
        msg: `Cannot change request from ${existing.status} to ${status}`,
      });
    }

    const update = { status };

    if (status === "assigned" || status === "accepted") update.acceptedAt = new Date();
    if (status === "completed") {
      update.completedAt = new Date();

      if (existing.providerId) {
        await Provider.findByIdAndUpdate(existing.providerId, {
          $inc: { totalJobs: 1 },
        });
      }
    }

    const updated = await populateRequest(
      ServiceRequest.findByIdAndUpdate(req.params.id, update, { new: true })
    );

    if (!updated) return res.status(404).json({ msg: "Request not found" });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
