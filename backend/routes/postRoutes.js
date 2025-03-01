import express from "express";
import { createPost, getFeedPosts, deletePost } from "../controllers/postController.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/fileUpload.js";

const router = express.Router();

// Create a post (with image/video upload)
router.post("/", protectRoute, upload.array("media", 3), createPost);

// Get all posts from followed users
router.get("/feed", protectRoute, getFeedPosts);

// Delete a post
router.delete("/:id", protectRoute, deletePost);

export default router;
