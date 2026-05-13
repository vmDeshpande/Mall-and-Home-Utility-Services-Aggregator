import express from "express";
import { updateRole, getProfile, updateProfile, changePassword } from "../controllers/userController.js";

const router = express.Router();

router.patch("/role", updateRole);
router.get("/:userId", getProfile);
router.put("/:userId", updateProfile);
router.patch("/change-password", changePassword);

export default router;