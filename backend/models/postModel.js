import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  text: { type: String },
  file: [
    {
      url: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: false,
      },
    },
  ],
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Like" }],
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Post", postSchema);
