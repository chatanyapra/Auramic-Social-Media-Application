import Story from "../models/storyModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const createStory = async (req, res) => {
  try {
    const { caption, checked } = req.body;
    const userId = req.user._id;

    // Check if files are uploaded
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    // Upload files to Cloudinary
    const imageUploads = await Promise.all(
      req.files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "chatstrum",
          resource_type: file.mimetype.startsWith('video') ? "video" : "auto", // Handle both images and videos
        });
        fs.unlinkSync(file.path); // Delete the file from the server after upload
        return { url: result.secure_url, alt: file.originalname };
      })
    );

    // Find non-expired stories of the logged-in user
    const currentTime = new Date();
    const existingStories = await Story.find({
      userId,
      expiresAt: { $gt: currentTime }, // Only consider non-expired stories
    });

    if (existingStories.length > 0) {
      // If non-expired stories exist, merge the new files with the existing ones
      const existingStory = existingStories[0]; // Assuming only one non-expired story exists
      existingStory.file = [...existingStory.file, ...imageUploads]; // Merge files
      existingStory.caption = caption; // Update caption
      existingStory.commentAllowed = checked; // Update comment allowed status
      await existingStory.save(); // Save the updated story
      return res.status(200).json(existingStory);
    } else {
      // If no non-expired stories exist, create a new story
      const newStory = new Story({
        userId,
        caption,
        file: imageUploads,
        commentAllowed: checked,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Set expiration time to 24 hours
      });
      await newStory.save(); // Save the new story
      return res.status(201).json(newStory);
    }
  } catch (error) {
    console.error("Error in createStory:", error);
    res.status(500).json({ message: error.message });
  }
};

// Get all stories of followed users
export const getStories = async (req, res) => {
  try {
    const userId = req.params.userId;
    const stories = await Story.find({ userId: { $in: req.user.following } });
    res.status(200).json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a story
export const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (story.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }
    await story.remove();
    res.status(200).json({ message: "Story deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
