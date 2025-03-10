import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addComment, deleteComment } from "../controller/commentController.js";

const router = express.Router();

// Add a comment
router.post("/", protectRoute, addComment);

// Delete a comment
router.delete("/:id", protectRoute, deleteComment);

export default router;
