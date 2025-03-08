import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;
  const userId = req.user._id; // Logged-in user's ID

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Update fields
    user.fullname = fullname || user.fullname;
    user.username = username || user.username;

    await user.save();

    res.status(200).json({
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user._id; // Logged-in user's ID

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Verify old password
    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ error: "Invalid old password!" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully!" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

// Toggle privacy setting
export const togglePrivacy = asyncHandler(async (req, res) => {
  const { isPrivate } = req.body;
  const userId = req.user._id; // Logged-in user's ID

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found!" });
    }

    // Update privacy setting
    user.private = isPrivate;

    await user.save();

    res.status(200).json({
      _id: user._id,
      isPrivate: user.private,
    });
  } catch (error) {
    console.error("Error updating privacy setting:", error);
    res.status(500).json({ error: "Internal Server Error!" });
  }
});

