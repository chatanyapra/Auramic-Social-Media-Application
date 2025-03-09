import express from "express";
import { sendFollowRequest, acceptFollowRequest, unfollowUser, deleteFollowRequest } from "../controller/followController.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// Send a follow request
router.post("/request/:followUserId", protectRoute, sendFollowRequest);

// Accept a follow request
router.post("/accept/:requesterId", protectRoute, acceptFollowRequest);

// Unfollow a user
router.delete("/unfollow/:unfollowUserId", protectRoute, unfollowUser);

// delete request a user
router.delete("/del-request/:requestUserId", protectRoute, deleteFollowRequest);

export default router;