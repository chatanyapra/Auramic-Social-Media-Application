import SavedPost from "../models/savedPostModel.js";
import Post from "../models/postModel.js";
import User from "../models/userModel.js";
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
          text: 1,
          commentAllowed: 1,
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

// Get all posts of a user
export const getUserPosts = async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from auth middleware

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    // Fetch all posts created by the logged-in user with comment and like counts
    const posts = await Post.aggregate([
      { $match: { userId: userId } }, // Match posts by the logged-in user
      { $sort: { createdAt: -1 } }, // Sort by latest first
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
          commentsCount: { $size: "$comments" }, // Count of comments
          likesCount: { $size: "$likes" }, // Count of likes
        },
      },
      {
        $project: {
          _id: 1,
          file: 1,
          text: 1,
          commentAllowed: 1,
          createdAt: 1,
          commentsCount: 1,
          likesCount: 1,
        },
      },
    ]);

    if (!posts.length) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching user posts:", error);
    res.status(500).json({ message: "Error fetching user posts", error: error.message });
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

// Controller to save a post for a user
export const savePostForUser = async (req, res) => {
  try {
    const { postId } = req.body;
    const userId = req.user._id; 
    
    // Check if the post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Check if the user has already saved the post
    const existingSavedPost = await SavedPost.findOne({ userId, postId });
    if (existingSavedPost) {
      return res.status(400).json({ message: "Post already saved." });
    }

    // Create a new saved post entry
    const newSavedPost = new SavedPost({
      userId,
      postId,
    });

    // Save the entry to the database
    await newSavedPost.save();

    // Return the saved post entry
    res.status(201).json({
      message: "Post saved successfully",
    });
  } catch (error) {
    console.error("Error saving post for user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to get saved posts for a user
export const getSavedPostsForUser = async (req, res) => {
    try {
        const userId = req.user._id; // Assuming `protectRoute` middleware attaches the user to `req.user`

        // Find all saved posts for the user
        const savedPosts = await SavedPost.find({ userId }).populate({
            path: "postId",
            model: "Post", // Populate the post details
            populate: {
                path: "userId",
                model: "User", // Populate the user details of the post
                select: "fullname username profilePic", // Select specific fields
            },
        });

        // Return the saved posts
        res.status(200).json({
            message: "Saved posts retrieved successfully",
            savedPosts,
        });
    } catch (error) {
        console.error("Error retrieving saved posts:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};