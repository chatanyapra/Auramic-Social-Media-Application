import express from "express";
import { createStory, getStories, deleteStory } from "../controller/storyController.js";
import protectRoute from "../middleware/protectRoute.js";
import upload from "../middleware/fileUpload.js"

const router = express.Router();

router.post("/", protectRoute, upload.array('files', 3), createStory);

// Get all stories of followed users
router.get("/:userId", protectRoute, getStories);

// Delete a story
router.delete("/:id", protectRoute, deleteStory);

export default router;
