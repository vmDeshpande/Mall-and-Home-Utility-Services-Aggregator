import express from "express";
import {
  completeCustomerOnboarding,
  completeProviderOnboarding,
} from "../controllers/onboardingController.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.post("/customer", completeCustomerOnboarding);
router.post(
  "/provider",
  upload.fields([
    { name: "identityProof", maxCount: 1 },
    { name: "skillProof", maxCount: 1 },
  ]),
  completeProviderOnboarding
);

export default router;