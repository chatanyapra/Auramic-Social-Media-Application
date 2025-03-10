import Post from "../models/postModel.js";
import User from "../models/userModel.js";
import Comment from "../models/commentModel.js";
import Like from "../models/likeModel.js";
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

    const newPost = new Post({ userId, text:caption, file: imageUploads, commentAllowed: checked });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFeedData = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user ID

    // Fetch the logged-in user's following list
    const user = await User.findById(userId).select("following");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const followingIds = user.following.map((user) => user._id);
    const userIdsForFeed = [userId, ...followingIds]; // Include logged-in user and followed users

    // Fetch posts from the logged-in user and followed users
    const posts = await Post.find({ userId: { $in: userIdsForFeed } })
      .sort({ createdAt: -1 }) // Sort by latest first
      .populate("userId", "fullname username profilePic"); // Populate user details

    // Fetch comments and likes for the fetched posts
    const postIds = posts.map((post) => post._id);

    const [comments, likes] = await Promise.all([
      Comment.find({ postId: { $in: postIds } })
        .populate("userId", "fullname username profilePic"), // Populate commenter details
      Like.find({ postId: { $in: postIds } })
        .populate("userId", "fullname username profilePic"), // Populate liker details
    ]);

    // Organize comments and likes by postId
    const commentsByPostId = comments.reduce((acc, comment) => {
      if (!acc[comment.postId]) {
        acc[comment.postId] = [];
      }
      acc[comment.postId].push(comment);
      return acc;
    }, {});

    const likesByPostId = likes.reduce((acc, like) => {
      if (!acc[like.postId]) {
        acc[like.postId] = [];
      }
      acc[like.postId].push(like);
      return acc;
    }, {});

    // Construct the feed data
    const feedData = posts.map((post) => ({
      ...post.toObject(),
      comments: commentsByPostId[post._id] || [], // Add comments for the post
      likes: likesByPostId[post._id] || [], // Add likes for the post
    }));

    res.status(200).json(feedData);
  } catch (error) {
    console.error("Error fetching feed data:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
