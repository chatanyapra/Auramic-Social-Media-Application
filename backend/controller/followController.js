import User from "../models/userModel.js";

// Send a follow request
export const sendFollowRequest = async (req, res) => {
  try {
    const { userId } = req.user; // Logged-in user
    const { followUserId } = req.params; // User to follow

    if (userId === followUserId) {
      return res.status(400).json({ message: "You can't follow yourself!" });
    }

    const followUser = await User.findById(followUserId);
    const currentUser = await User.findById(userId);

    if (!followUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (followUser.followers.includes(userId)) {
      return res.status(400).json({ message: "You already follow this user!" });
    }

    // If private account, send follow request
    if (!followUser.followRequests.includes(userId)) {
      followUser.followRequests.push(userId);
      await followUser.save();
      return res.status(200).json({ message: "Follow request sent!" });
    }

    res.status(400).json({ message: "Follow request already sent!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

// Accept follow request
export const acceptFollowRequest = async (req, res) => {
  try {
    const { userId } = req.user; // Logged-in user
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
    user.followRequests = user.followRequests.filter(id => id.toString() !== requesterId);
    user.followers.push(requesterId);
    requester.following.push(userId);

    await user.save();
    await requester.save();

    res.status(200).json({ message: "Follow request accepted!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};

// Unfollow a user
export const unfollowUser = async (req, res) => {
  try {
    const { userId } = req.user;
    const { unfollowUserId } = req.params;

    const unfollowUser = await User.findById(unfollowUserId);
    const currentUser = await User.findById(userId);

    if (!unfollowUser) {
      return res.status(404).json({ message: "User not found!" });
    }

    if (!unfollowUser.followers.includes(userId)) {
      return res.status(400).json({ message: "You are not following this user!" });
    }

    // Remove user from followers & following lists
    unfollowUser.followers = unfollowUser.followers.filter(id => id.toString() !== userId);
    currentUser.following = currentUser.following.filter(id => id.toString() !== unfollowUserId);

    await unfollowUser.save();
    await currentUser.save();

    res.status(200).json({ message: "Unfollowed successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error!" });
  }
};
