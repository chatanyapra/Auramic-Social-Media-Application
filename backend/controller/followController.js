import User from "../models/userModel.js";

// Send a follow request
export const sendFollowRequest = async (req, res) => {
  try {
    const userId = req.user._id;
    const { followUserId } = req.params; // User to follow
    console.log('Current User ID:', userId, 'Follow User ID:', followUserId);

    if (userId === followUserId) {
      return res.status(400).json({ message: "You can't follow yourself!" });
    }

    const followUser = await User.findById(followUserId);
    console.log('Follow User:', followUser);

    if (!followUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (followUser.followers.includes(userId)) {
      return res.status(400).json({ message: "You already follow this user!" });
    }

    // If private account, send follow request
    if (!followUser.followRequests.includes(userId)) {
      const updatedUser = await User.findByIdAndUpdate(
        followUserId,
        { $addToSet: { followRequests: userId } }, // Use $addToSet to avoid duplicates
        { new: true } // Return the updated document
      );

      if (!updatedUser) {
        return res.status(404).json({ message: "User not found!" });
      }

      console.log('Updated User:', updatedUser);
      return res.status(200).json({ message: "Follow request sent!" });
    }

    res.status(400).json({ message: "Follow request already sent!" });
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
