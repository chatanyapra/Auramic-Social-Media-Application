import Story from "../models/storyModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

export const createStory = async (req, res) => {
  try {
    const { caption, checked } = req.body;
    const userId = req.user._id;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const imageUploads = await Promise.all(
      req.files.map(async (file) => {
        try {
          // Detect file type
          const mimeType = file.mimetype;
          let resourceType = 'auto';

          if (mimeType.startsWith('video/')) {
            resourceType = 'video';
          } else if (mimeType.startsWith('image/')) {
            resourceType = 'image';
          } else {
            throw new Error('Unsupported file type');
          }

          const result = await cloudinary.v2.uploader.upload(file.path, {
            resource_type: resourceType,
          });

          fs.unlinkSync(file.path); // Clean up local file
          return { url: result.secure_url, alt: file.originalname };
        } catch (uploadError) {
          console.error("Cloudinary upload error:", uploadError);
          fs.unlinkSync(file.path); // Clean up even if failed
          throw uploadError;
        }
      })
    );

    const currentTime = new Date();
    const existingStories = await Story.find({
      userId,
      expiresAt: { $gt: currentTime },
    });

    if (existingStories.length > 0) {
      const existingStory = existingStories[0];
      existingStory.file = [...existingStory.file, ...imageUploads];
      existingStory.caption = caption;
      existingStory.commentAllowed = checked;
      await existingStory.save();
      return res.status(200).json(existingStory);
    } else {
      const newStory = new Story({
        userId,
        caption,
        file: imageUploads,
        commentAllowed: checked,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      });
      await newStory.save();
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
