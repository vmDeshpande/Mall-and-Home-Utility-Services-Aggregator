import express from "express";
import { createRequest, getRequestById, getRequests, updateStatus } from "../controllers/requestController.js";

const router = express.Router();

router.get("/", getRequests);
router.get("/:id", getRequestById);
router.post("/", createRequest);
router.patch("/:id", updateStatus);

export default router;
