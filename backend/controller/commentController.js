import Comment from "../models/commentModel.js";
import Post from "../models/postModel.js";
import Story from "../models/postModel.js";

// @desc    Add a comment to a post or story
// @route   POST /api/comments
// @access  Protected
export const addComment = async (req, res) => {
    try {
        const { text } = req.body;
        const { postId } = req.params;
        const userId = req.user._id; // Extract user from auth middleware
        console.log("postId, text, userId", postId, text, userId);

        // Validate input
        if (!text) {
            return res.status(400).json({ message: "Comment text is required" });
        }

        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Check if comments are allowed on this post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (!post.commentAllowed) {
            return res.status(403).json({ message: "Comments are not allowed on this post" });
        }

        // Create a new comment
        const comment = new Comment({
            userId,
            text,
            postId,
        });

        // Save the comment to the database
        await comment.save();

        // Push comment reference into the respective post
        await Post.findByIdAndUpdate(postId, { $push: { comments: comment._id } });

        // Populate the userId field with user details
        const populatedComment = await Comment.findById(comment._id).populate(
            "userId",
            "username profilePic"
        );

        // Return the populated comment
        res.status(201).json({ message: "Comment added successfully", comment: populatedComment });
    } catch (error) {
        res.status(500).json({ message: "Error adding comment", error: error.message });
    }
};


export const getCommentsByPostId = async (req, res) => {
    try {
        const { postId } = req.params;

        // Validate the postId
        if (!postId) {
            return res.status(400).json({ message: "Post ID is required" });
        }

        // Fetch comments from the database and populate user details
        const comments = await Comment.find({ postId })
            .populate("userId", "username profilePic") // Populate user details
            .sort({ createdAt: -1 })
            .limit(15);
        console.log("commentsoooo", comments);

        // Return the comments
        res.status(200).json({ comments });
    } catch (error) {
        console.error("Error fetching comments:", error);
        res.status(500).json({ message: "Failed to fetch comments" });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user._id; // Extract user from auth middleware

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
