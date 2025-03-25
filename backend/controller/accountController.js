import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";

// Update profile
export const updateProfile = asyncHandler(async (req, res) => {
  const { fullname, username } = req.body;
  const userId = req.user._id;

  // Input validation
  if (username && typeof username !== 'string') {
    return res.status(400).json({ 
      success: false,
      message: "Username must be a string" 
    });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found!" 
      });
    }

    // Username update logic
    if (username && username !== user.username) {
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        return res.status(400).json({ 
          success: false,
          message: "Username must be 3-20 characters (letters, numbers, underscores)" 
        });
      }

      const existingUser = await User.findOne({ 
        username: username.toLowerCase(), 
        _id: { $ne: userId } 
      });

      if (existingUser) {
        return res.status(409).json({ 
          success: false,
          message: "Username already taken" 
        });
      }

      user.username = username.toLowerCase();
    }

    // Fullname update logic
    if (fullname) {
      if (typeof fullname !== 'string' || fullname.trim().length < 2) {
        return res.status(400).json({ 
          success: false,
          message: "Full name must be at least 2 characters" 
        });
      }
      user.fullname = fullname.trim();
    }

    const updatedUser = await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: updatedUser._id,
        fullname: updatedUser.fullname,
        username: updatedUser.username,
        profilePic: updatedUser.profilePic
      }
    });

  } catch (error) {
    console.error("Error updating profile:", error);
    
    if (error.name === 'MongoError' && error.code === 11000) {
      return res.status(409).json({ 
        success: false,
        message: "Username is already taken" 
      });
    }

    res.status(500).json({ 
      success: false,
      message: "Failed to update profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
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

