import express from "express";
import { createPost, deletePost, getFeedData, getUserPosts } from "../controller/postController.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/fileUpload.js";

const router = express.Router();

// Create a post (with image/video upload)
router.post("/", protectRoute, upload.array('files', 3), createPost);

// Get all posts from followed users
router.get("/feed", protectRoute, getFeedData);

// Get all posts by logged-in user
router.get("/my-posts", protectRoute, getUserPosts);

// Delete a post
router.delete("/:id", protectRoute, deletePost);

export default router;
