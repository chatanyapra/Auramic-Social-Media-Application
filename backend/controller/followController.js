import User from "../models/userModel.js";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export const sendFollowRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user's ID
    const { followUserId } = req.params; // User to follow

    // Check if the user is trying to follow themselves
    if (userId === followUserId) {
      return res.status(400).json({ message: "You can't follow yourself!" });
    }

    // Find the logged-in user and the user to follow
    const [loggedInUser, followUser] = await Promise.all([
      User.findById(userId),
      User.findById(followUserId),
    ]);

    // Check if both users exist
    if (!loggedInUser || !followUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the logged-in user already follows the user
    if (followUser.followers.includes(userId)) {
      return res.status(400).json({ message: "You already follow this user!" });
    }

    // If the account is private, send a follow request
    if (followUser.private) {
      // Check if a follow request has already been sent
      if (followUser.followRequests.includes(userId)) {
        return res.status(400).json({ message: "Follow request already sent!" });
      }

      // Add the logged-in user to the followRequests array of the target user
      await User.findByIdAndUpdate(
        followUserId,
        { $addToSet: { followRequests: userId } }, // Use $addToSet to avoid duplicates
        { new: true }
      );

      // Do NOT add the followUserId to the logged-in user's following array yet
      return res.status(200).json({ message: "Follow request sent!" });
    } else {
      // If the account is public, add the logged-in user to the followers array of the target user
      await User.findByIdAndUpdate(
        followUserId,
        { $addToSet: { followers: userId } }, // Use $addToSet to avoid duplicates
        { new: true }
      );

      // Add the followUserId to the logged-in user's following array
      await User.findByIdAndUpdate(
        userId,
        { $addToSet: { following: followUserId } }, // Use $addToSet to avoid duplicates
        { new: true }
      );

      return res.status(200).json({ message: "You are now following this user!" });
    }
  } catch (error) {
    console.error('Error in sendFollowRequest:', error);
    res.status(500).json({ message: "Server error!" });
  }
};

export const acceptFollowRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user
    const { requesterId } = req.params; // Requesting user

    const user = await User.findById(userId);
    const requester = await User.findById(requesterId);

    if (!user || !requester) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!user.followRequests.includes(requesterId)) {
      return res.status(400).json({ message: "No follow request found!" });
    }

    // Remove request & update followers
    await User.findByIdAndUpdate(
      userId,
      {
        $pull: { followRequests: requesterId },
        $addToSet: { followers: requesterId },
      }
    );

    // Update requester's following list
    await User.findByIdAndUpdate(
      requesterId,
      {
        $addToSet: { following: userId }, // Add to following (avoid duplicates)
      }
    );

    res.status(200).json({ message: "Follow request accepted!" });
  } catch (error) {
    console.error('Error in acceptFollowRequest:', error);
    res.status(500).json({ message: error.message || "Server error!" });
  }
};

export const unfollowUser = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user
    const { unfollowUserId } = req.params; // User to unfollow

    const unfollowUser = await User.findById(unfollowUserId);
    const currentUser = await User.findById(userId);

    // Check if both users exist
    if (!currentUser || !unfollowUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Check if the current user is following the unfollow user
    if (!unfollowUser.followers.includes(userId)) {
      return res.status(400).json({ message: "You are not following this user!" });
    }

    // Remove user from followers & following lists
    await User.findByIdAndUpdate(
      unfollowUserId,
      { $pull: { followers: userId } } // Remove userId from followers
    );

    await User.findByIdAndUpdate(
      userId,
      { $pull: { following: unfollowUserId } } // Remove unfollowUserId from following
    );

    res.status(200).json({ message: "Unfollowed successfully!" });
  } catch (error) {
    console.error('Error in unfollowUser:', error);
    res.status(500).json({ message: error.message || "Server error!" });
  }
};

export const deleteFollowRequest = async (req, res) => {
  try {
    const userId = req.user._id; // Logged-in user (the one who received the request)
    const { requestUserId } = req.params; // User who sent the follow request

    // Convert requestUserId to ObjectId
    const requestUserIdObj = new ObjectId(requestUserId);

    // Find the current user
    const currentUser = await User.findById(userId);

    // Check if the current user exists
    if (!currentUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Debug logs
    console.log("Current User Follow Requests:", currentUser.followRequests);
    console.log("Request User ID:", requestUserId);

    // Check if the requestUserId exists in the followRequests array
    if (!currentUser.followRequests.some(id => id.equals(requestUserIdObj))) {
      return res.status(400).json({ message: "Follow request not found!" });
    }

    // Remove the requestUserId from the followRequests array
    await User.findByIdAndUpdate(
      userId,
      { $pull: { followRequests: requestUserIdObj } }, // Remove requestUserId from followRequests
      { new: true } // Return the updated document
    );

    res.status(200).json({ message: "Follow request deleted successfully!" });
  } catch (error) {
    console.error("Error in deleteFollowRequest:", error);
    res.status(500).json({ message: error.message || "Server error!" });
  }
};