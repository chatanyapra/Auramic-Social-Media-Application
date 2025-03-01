import Story from "../models/Story.js";

// Create a story
export const createStory = async (req, res) => {
  try {
    const { userId, media } = req.body;
    const newStory = new Story({ userId, media });
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
