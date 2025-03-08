import express from "express";
import { changePassword, togglePrivacy, updateProfile } from "../controller/accountController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Account settings routes
router.put("/profile", protectRoute, updateProfile); // Update profile
router.put("/privacy", protectRoute, togglePrivacy); // Toggle privacy
router.put("/change-password", protectRoute, changePassword); // Change password
// router.delete("/delete-account", protect, deleteAccount); // Delete account

export default router;