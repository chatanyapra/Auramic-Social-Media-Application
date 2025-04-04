import express from "express";
import { createStory, getStories, deleteStory } from "../controller/storyController.js";
import protectRoute from "../middleware/protectRoute.js";
import uploadWithValidation from "../middleware/uploadMultiFiles.js";

const router = express.Router();

router.post("/", protectRoute, uploadWithValidation, createStory);

// Get all stories of followed users
router.get("/:userId", protectRoute, getStories);

// Delete a story
router.delete("/:id", protectRoute, deleteStory);

export default router;
