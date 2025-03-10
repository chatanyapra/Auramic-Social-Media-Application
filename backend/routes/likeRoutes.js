import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { likePost, unlikePost } from "../controller/likeController.js";

const router = express.Router();

// Like a post
router.post("/", protectRoute, likePost);

// Unlike a post
router.delete("/:postId", protectRoute, unlikePost);

export default router;
