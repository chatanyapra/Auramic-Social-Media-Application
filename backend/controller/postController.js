import Post from "../models/postModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Create a post
export const createPost = async (req, res) => {
  try {
    const { caption, checked } = req.body;
    const userId = req.user._id;
    console.log("media, userId ----, caption", userId, caption);
    let imageUploads = [];
    if (req.files && req.files.length > 0) {
      imageUploads = await Promise.all(
        req.files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            folder: "chatstrum",
            resource_type: "auto",
          });
          console.log("Cloudinary Upload Result:", result);
          fs.unlinkSync(file.path); // Delete local file after uploading
          return { url: result.secure_url, alt: file.originalname };
        })
      );
    } else {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const newPost = new Post({ userId, caption, file: imageUploads,commentAllowed: checked });
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
