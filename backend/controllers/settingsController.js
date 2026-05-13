import Settings from "../models/settings.js";

export const getSettings = async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      maintenanceMode: false,
      requireVerification: true,
      autoApproveProviders: false,
      requireInsurance: true,
      platformFee: 10,

      allowInstantBooking: true,
      cancellationWindowHours: 2,
      urgentFeePercentage: 20,
    });
  }

  res.json(settings);
};

export const updateSettings = async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(req.body);
  } else {
    settings = await Settings.findByIdAndUpdate(
      settings._id,
      { $set: req.body },
      { new: true }
    );
  }

  res.json(settings);
};