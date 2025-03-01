import express from "express";
import { likePost, unlikePost } from "../controllers/likeController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Like a post
router.post("/", protectRoute, likePost);

// Unlike a post
router.delete("/:postId", protectRoute, unlikePost);

export default router;
