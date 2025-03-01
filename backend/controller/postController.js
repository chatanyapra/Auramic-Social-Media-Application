import Post from "../models/Post.js";

// Create a post
export const createPost = async (req, res) => {
  try {
    const newPost = new Post(req.body);
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all posts from followed users
export const getFeedPosts = async (req, res) => {
  try {
    const user = req.user;
    const posts = await Post.find({ userId: { $in: user.following } });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a post
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await post.remove();
    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
