import express from "express";
import { addComment, deleteComment } from "../controllers/commentController.js";
import protectRoute from "../middlewares/protectRoute.js";

const router = express.Router();

// Add a comment
router.post("/", protectRoute, addComment);

// Delete a comment
router.delete("/:id", protectRoute, deleteComment);

export default router;
