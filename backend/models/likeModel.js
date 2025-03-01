import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Like", likeSchema);
