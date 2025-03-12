import Like from "../models/likeModel.js";

// Like a post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.postId;
    const userId = req.user._id;
    const existingLike = await Like.findOne({ userId, postId });
    if (existingLike) {
      return res.status(400).json({ message: "You already liked this post" });
    }

    const newLike = new Like({ userId, postId });
    await newLike.save();
    console.log("newLike:", newLike);
    res.status(201).json(newLike);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Unlike a post
export const unlikePost = async (req, res) => {
  try {
    await Like.findOneAndDelete({ userId: req.user.id, postId: req.params.postId });
    res.status(200).json({ message: "Like removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
