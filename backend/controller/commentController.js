import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Story from "../models/postModel.js";

// @desc    Add a comment to a post or story
// @route   POST /api/comments
// @access  Protected
export const addComment = async (req, res) => {
    try {
        const { postId, storyId, text } = req.body;
        const userId = req.user.id; // Extract user from auth middleware

        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        if (!postId && !storyId) {
            return res.status(400).json({ message: "Post ID or Story ID is required" });
        }

        const comment = new Comment({
            userId,
            text,
            postId: postId || null,
            storyId: storyId || null
        });

        await comment.save();

        // Push comment reference into respective post or story
        if (postId) {
            await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });
        } else if (storyId) {
            await Story.findByIdAndUpdate(storyId, { $push: { comments: comment._id } });
        }

        res.status(201).json({ message: "Comment added successfully", comment });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};

// @desc    Delete a comment
// @route   DELETE /api/comments/:id
// @access  Protected
export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id; // Extract user from auth middleware

        const comment = await Comment.findById(id);
        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        // Check if the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(403).json({ message: "Unauthorized to delete this comment" });
        }

        await Comment.findByIdAndDelete(id);

        // Remove comment reference from post or story
        if (comment.postId) {
            await Post.findByIdAndUpdate(comment.postId, { $pull: { comments: id } });
        } else if (comment.storyId) {
            await Story.findByIdAndUpdate(comment.storyId, { $pull: { comments: id } });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting comment", error: error.message });
    }
};
