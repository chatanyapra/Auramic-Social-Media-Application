import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import { addComment, deleteComment, getCommentsByPostId } from "../controller/commentController.js";

const router = express.Router();

// Add a comment
router.post("/:postId/comments", protectRoute, addComment);

router.get("/:postId", getCommentsByPostId);
// Delete a comment
router.delete("/:id", protectRoute, deleteComment);

export default router;
