import express from "express";
import { sendFollowRequest, acceptFollowRequest, unfollowUser } from "../controllers/followController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Send a follow request
router.post("/request/:followUserId", protectRoute, sendFollowRequest);

// Accept a follow request
router.post("/accept/:requesterId", protectRoute, acceptFollowRequest);

// Unfollow a user
router.delete("/unfollow/:unfollowUserId", protectRoute, unfollowUser);

export default router;
