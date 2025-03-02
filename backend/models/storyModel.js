import mongoose from "mongoose";

const storySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  caption: { type: String },
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
  commentAllowed: { type: Boolean, default: true },
});

export default mongoose.model("Story", storySchema);
