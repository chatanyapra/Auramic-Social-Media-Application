import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  media: { type: String, required: true },
  expiresAt: { type: Date, default: () => Date.now() + 24 * 60 * 60 * 1000 },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("Story", storySchema);
