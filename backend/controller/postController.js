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

    const newPost = new Post({ userId, text: caption, file: imageUploads, commentAllowed: checked });
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
    const posts = await Post.aggregate([
      { $match: { userId: { $in: userIdsForFeed } } }, // Match posts by userId
      { $sort: { createdAt: -1 } }, // Sort by latest first
      {
        $lookup: {
          from: "users", // Join with the users collection
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" }, // Unwind the user array (since lookup returns an array)
      {
        $lookup: {
          from: "comments", // Join with the comments collection
          localField: "_id",
          foreignField: "postId",
          as: "comments",
        },
      },
      {
        $lookup: {
          from: "likes", // Join with the likes collection
          localField: "_id",
          foreignField: "postId",
          as: "likes",
        },
      },
      {
        $addFields: {
          isLiked: { // Check if the logged-in user has liked this post
            $in: [userId, "$likes.userId"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          file: 1,
          text: 1, // Include the text attribute
          createdAt: 1,
          "user._id": 1,
          "user.fullname": 1,
          "user.username": 1,
          "user.profilePic": 1,
          commentsCount: { $size: "$comments" }, // Count of comments
          likesCount: { $size: "$likes" }, // Count of likes
          isLiked: 1, // Include isLiked field
        },
      },
    ]);

    res.status(200).json(posts);
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
