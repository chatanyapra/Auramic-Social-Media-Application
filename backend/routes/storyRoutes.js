import express from "express";
import { createStory, getStories, deleteStory } from "../controllers/storyController.js";
import protectRoute from "../middlewares/protectRoute.js";
import upload from "../middlewares/fileUpload.js";

const router = express.Router();

router.post("/", protectRoute, upload.single("media"), createStory);

// Get all stories of followed users
router.get("/:userId", protectRoute, getStories);

// Delete a story
router.delete("/:id", protectRoute, deleteStory);

export default router;
