import Story from "../models/storyModel.js";
import cloudinary from "cloudinary";
import fs from "fs";

// Create a story
export const createStory = async (req, res) => {
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
            resource_type: "video",
          });         
          console.log("Upload Result:", result); 
          fs.unlinkSync(file.path); 
          return { url: result.secure_url, alt: file.originalname };
        })
      );
    } else {
      return res.status(400).json({ message: "Please upload a file" });
    }

    const newStory = new Story({ userId, caption, file: imageUploads,commentAllowed: checked });
    await newStory.save();
    res.status(201).json(newStory);
  } catch (error) {
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
