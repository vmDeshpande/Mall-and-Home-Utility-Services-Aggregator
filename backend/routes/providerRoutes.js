import express from "express";
import { getProviders, updateProvider, getProvider, verifyProvider } from "../controllers/providerController.js";

const router = express.Router();

router.get("/", getProviders);
router.put("/:id", updateProvider);
router.get("/:id", getProvider);
router.patch("/:id/verify", verifyProvider);

export default router;