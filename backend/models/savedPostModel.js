import mongoose from "mongoose";

const savedPostSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Reference to the User model
        required: true,
    },
    postId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post", // Reference to the Post model
        required: true,
    },
    savedAt: {
        type: Date,
        default: Date.now, // Timestamp when the post was saved
    },
});

// Create the SavedPost model
const SavedPost = mongoose.model("SavedPost", savedPostSchema);

export default SavedPost;