import express from "express";
import { createPost, deletePost, getFeedData, getSavedPostsForUser, getUserPosts, savePostForUser } from "../controller/postController.js";
import protectRoute from "../middleware/protectRoute.js";
import uploadWithValidation from "../middleware/uploadMultiFiles.js";

const router = express.Router();

// Create a post (with image/video upload)
router.post("/", protectRoute, uploadWithValidation, createPost);

// Get all posts from followed users
router.get("/feed", protectRoute, getFeedData);

// Get all posts by logged-in user
router.get("/my-posts", protectRoute, getUserPosts);

// Save a post for a user
router.post("/save-for-user", protectRoute, savePostForUser);

// Get saved posts for a user
router.get("/saved-posts", protectRoute, getSavedPostsForUser);

// Delete a post
router.delete("/:id", protectRoute, deletePost);

export default router;
