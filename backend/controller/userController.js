import asyncHandler from "express-async-handler";
import mongoose from "mongoose";
import User from "../models/userModel.js";
import Story from "../models/storyModel.js";
import Post from "../models/postModel.js";
// import vision from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js"
import { io } from '../socket/socket.js';
import cloudinary from '../cloudinary/cloudinaryConfig.js';
import fs from 'fs';
import { getReceiverSocketId } from "../socket/socket.js";
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

Conversation.collection.createIndex({ "participants.0": 1 });
export const getUserForSidebar = asyncHandler(async (req, res) => {
    try {
        const loggedInUserId = req.user._id;

        // Fetch unique participant[1] IDs directly from conversations
        const participantIds = await Conversation.distinct("participants.1", { "participants.0": loggedInUserId });

        // Fetch user details for participant[1] (excluding the logged-in user and password)
        const filteredUsers = await User.find({ _id: { $in: participantIds, $ne: loggedInUserId } }).select("-password");

        res.status(200).json({ filteredUsers, hasSpecificId: "66c048e50d7696b4b17b5d53" });
    } catch (error) {
        console.error("Error in getUserForSidebar:", error.message);
        res.status(500).json({ error: "Internal Server Error!" });
    }
});

// export const getUserForSidebar = asyncHandler(async (req, res) => {
//     try {
//         const loggedInUserId = req.user._id;

//         // Fetch logged-in user's followers and following lists
//         const loggedInUser = await User.findById(loggedInUserId).select("followers following").lean();

//         if (!loggedInUser) {
//             return res.status(404).json({ error: "User not found" });
//         }

//         // Combine followers and following lists and remove duplicates
//         const userIds = [...new Set([...loggedInUser.followers, ...loggedInUser.following])];

//         // Fetch user details (excluding password)
//         const filteredUsers = await User.find({ _id: { $in: userIds } }).select("-password");

//         res.status(200).json({ filteredUsers, hasSpecificId: "66c048e50d7696b4b17b5d53" });
//     } catch (error) {
//         console.error("Error in getUserForSidebar:", error.message);
//         res.status(500).json({ error: "Internal Server Error!" });
//     }
// });

export const auramicaiTextExtract = asyncHandler(async (req, res) => {
    try {
        let { message: question, previousMessage } = req.body;
        const image = req.file || null;
        const receiverId = req.user._id;

        // Validate input
        if (!question && !image) {
            return res.status(400).json({
                error: 'Input required',
                message: 'Please provide either text or an image to process'
            });
        }

        // Build prompt
        let prompt = '';
        if (question) {
            prompt = `The user input is: "${question}". 
            You are AuramicAi, a assistant that works inside this application. 
            Your task is to answer questions or provide relevant information based on the user's input.`;
        }

        if (previousMessage) {
            prompt += `\nContext from previous message: "${previousMessage}".`;
        }

        if (image) {
            prompt += `\nAn image has been provided. Please analyze it and incorporate relevant details.`;
        }

        prompt += `\nProvide a clear and helpful response to the user's query.`;

        if (prompt.length > 3000) {
            return res.status(400).json({
                error: 'Input too long',
                message: 'Please keep your input under 3000 characters'
            });
        }

        // Process with Gemini
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        let imagePart;
        if (image) {
            try {
                imagePart = {
                    inlineData: {
                        data: (await fs.promises.readFile(image.path)).toString("base64"),
                        mimeType: "image/jpeg",
                    },
                };
            } catch (fileError) {
                console.error('File processing error:', fileError);
                return res.status(400).json({
                    error: 'Image processing failed',
                    message: 'We couldn\'t process your image. Please try another file.'
                });
            }
        }

        let result;
        try {
            result = await model.generateContent(imagePart ? [prompt, imagePart] : [prompt]);
        } catch (apiError) {
            console.error('Gemini API error:', apiError);

            if (apiError.status === 429) {
                return res.status(429).json({
                    error: 'Service busy',
                    message: 'Our AI is currently handling many requests. Please try again in a moment.',
                    retryAfter: 30 // seconds
                });
            }

            return res.status(500).json({
                error: 'AI service unavailable',
                message: 'We\'re having trouble reaching our AI service. Please try again later.'
            });
        }

        const responseText = result.response.text();

        // Save to database
        let newMessage;
        try {
            const sendMessageResponse = await sendAuramicDb(responseText, receiverId, image);
            newMessage = sendMessageResponse?.newMessage || responseText;
        } catch (dbError) {
            console.error('Database error:', dbError);
            // Still return the response even if DB save fails
            newMessage = responseText;
        }

        // Send response
        res.json({
            response: newMessage,
            success: true
        });

        // Notify via socket if available
        try {
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        } catch (socketError) {
            console.error('Socket notification error:', socketError);
        }

        // Cleanup image
        if (image) {
            try {
                await fs.promises.unlink(image.path);
            } catch (cleanupError) {
                console.error('File cleanup error:', cleanupError);
            }
        }

    } catch (error) {
        console.error('Unexpected error:', error);
        res.status(500).json({
            error: 'Something went wrong',
            message: 'An unexpected error occurred. Our team has been notified.'
        });
    }
});
const sendAuramicDb = async (message, receiverId, image) => {
    try {
        const senderId = "66c048e50d7696b4b17b5d53";

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        });
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            });
        }
        if (image) {
            fs.unlink(image.path, (err) => {
                if (err) {
                    console.error('Error deleting the file from the server:', err);
                }
            });
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }

        await Promise.all([conversation.save(), newMessage.save()]);

        return { newMessage };

    } catch (error) {
        console.error("Error in Message Controller", error.message);
        throw new Error("Internal Server Error!");
    }
};

export const uploadProfileImage = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the request
        const file = req.file; // Get the uploaded file

        if (!file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.profilePic) {
            const publicId = user.profilePic.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(`chatstrum/profile/${publicId}`);
        }
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatstrum/profile', // Save in a specific folder
            resource_type: 'auto', // Automatically detect file type
        });
        fs.unlinkSync(file.path);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { profilePic: result.secure_url }, // Save the Cloudinary URL
            { new: true } // Return the updated user
        );
        res.status(201).json(updatedUser.profilePic);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadCoverImage = async (req, res) => {
    try {
        const userId = req.user._id; // Get the user ID from the request
        const file = req.file; // Get the uploaded file

        if (!file) {
            return res.status(400).json({ message: 'Please upload a file' });
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (user.coverImage) {
            const publicId = user.coverImage.split('/').pop().split('.')[0]; // Extract public ID from URL
            await cloudinary.uploader.destroy(`chatstrum/cover/${publicId}`);
        }
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'chatstrum/cover', // Save in a specific folder
            resource_type: 'auto', // Automatically detect file type
        });
        fs.unlinkSync(file.path);
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { coverImage: result.secure_url }, // Save the Cloudinary URL
            { new: true } // Return the updated user
        );
        res.status(201).json(updatedUser.coverImage);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updateUserBio = async (req, res) => {
    try {
        const userId = req.user._id;
        const { bio } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { bio }, // Update the bio field
            { new: true } // Return the updated user
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser.bio);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserProfileData = async (req, res) => {
    try {
        const userId = req.user._id;
        const specificUserId = "66c048e50d7696b4b17b5d53";

        // Fetch the logged-in user using aggregation
        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the logged-in user
            {
                $lookup: {
                    from: "users",
                    localField: "followers",
                    foreignField: "_id",
                    as: "followers",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "following",
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "followRequests",
                    foreignField: "_id",
                    as: "followRequests",
                },
            },
            {
                $project: {
                    fullname: 1,
                    username: 1,
                    profilePic: 1,
                    private: 1,
                    followersCount: { $size: "$followers" }, // Count of followers
                    followingCount: { $size: "$following" }, // Count of following
                    followers: {
                        $map: {
                            input: "$followers",
                            as: "follower",
                            in: {
                                _id: "$$follower._id",
                                fullname: "$$follower.fullname",
                                username: "$$follower.username",
                                profilePic: "$$follower.profilePic",
                                private: "$$follower.private",
                            },
                        },
                    },
                    following: {
                        $map: {
                            input: "$following",
                            as: "followingUser",
                            in: {
                                _id: "$$followingUser._id",
                                fullname: "$$followingUser.fullname",
                                username: "$$followingUser.username",
                                profilePic: "$$followingUser.profilePic",
                                private: "$$followingUser.private", // Include privacy status
                            },
                        },
                    },
                    followRequests: {
                        $map: {
                            input: "$followRequests",
                            as: "requestUser",
                            in: {
                                _id: "$$requestUser._id",
                                fullname: "$$requestUser.fullname",
                                username: "$$requestUser.username",
                                profilePic: "$$requestUser.profilePic",
                                private: "$$requestUser.private", // Include privacy status
                            },
                        },
                    },
                },
            },
        ]);

        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch the specific user (this will be included with every user response)
        const specificUser = await User.findById(specificUserId).select(
            "fullname username profilePic"
        );

        if (!specificUser) {
            return res.status(404).json({ error: "Specific user not found" });
        }

        const followingIds = user[0].following.map((user) => user._id);

        // Fetch non-expired stories for the logged-in user
        const loggedInUserStories = await Story.find({
            userId,
            expiresAt: { $gt: new Date() },
        }).select("-__v");

        // Fetch non-expired stories of followed users and populate the userId field with profilePic
        const followingUserStories = await Story.find({
            userId: { $in: followingIds },
            expiresAt: { $gt: new Date() },
        })
            .select("-__v")
            .populate("userId", "username profilePic"); // Populate the userId field with profilePic

        // Merge stories, placing logged-in user's stories first
        const allStories = [...loggedInUserStories, ...followingUserStories];
        const totalPostsCount = await Post.countDocuments({ userId });
        // Include specific user with every user response
        res.status(200).json({
            user: user[0],
            stories: allStories,
            specificAiUser: specificUser,
            specificUserId,
            totalPostsCount
        });
    } catch (error) {
        console.error("Error fetching user profile and stories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserProfileDataById = async (req, res) => {
    try {
        const userId = req.params.userId;

        // Fetch the user and calculate mutual friends using aggregation
        const user = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } }, // Match the user
            {
                $lookup: {
                    from: "users",
                    localField: "followers",
                    foreignField: "_id",
                    as: "followersData", // Temporary field for followers data
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "following",
                    foreignField: "_id",
                    as: "followingData", // Temporary field for following data
                },
            },
            {
                $project: {
                    fullname: 1,
                    username: 1,
                    profilePic: 1,
                    private: 1,
                    followersCount: { $size: "$followersData" }, // Always compute the count of followers
                    followingCount: { $size: "$followingData" }, // Always compute the count of following
                    followers: {
                        // Conditional logic for followers
                        $cond: {
                            if: "$private", // Check if the account is private
                            then: [], // Return empty array if private
                            else: {
                                // Return full details if not private
                                $map: {
                                    input: "$followersData",
                                    as: "follower",
                                    in: {
                                        _id: "$$follower._id",
                                        fullname: "$$follower.fullname",
                                        username: "$$follower.username",
                                        profilePic: "$$follower.profilePic",
                                        private: "$$follower.private",
                                    },
                                },
                            },
                        },
                    },
                    following: {
                        // Conditional logic for following
                        $cond: {
                            if: "$private", // Check if the account is private
                            then: [], // Return empty array if private
                            else: {
                                // Return full details if not private
                                $map: {
                                    input: "$followingData",
                                    as: "followingUser",
                                    in: {
                                        _id: "$$followingUser._id",
                                        fullname: "$$followingUser.fullname",
                                        username: "$$followingUser.username",
                                        profilePic: "$$followingUser.profilePic",
                                        private: "$$followingUser.private",
                                    },
                                },
                            },
                        },
                    },
                },
            },
        ]);

        if (!user || user.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }
        const totalPostsCount = await Post.countDocuments({ userId });

        res.status(200).json({ user: user[0], totalPostsCount });
    } catch (error) {
        console.error("Error fetching user profile:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSearchUser = async (req, res) => {
    const query = req.query.q;
    const userId = req.user._id; // Logged-in user ID
    const specificUserId = "66c048e50d7696b4b17b5d53"; // Specific user ID to exclude

    if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    try {
        const results = await User.find(
            {
                $and: [
                    {
                        $or: [
                            { fullname: { $regex: query, $options: "i" } },
                            { username: { $regex: query, $options: "i" } },
                        ],
                    },
                    { _id: { $nin: [userId, specificUserId] } }, // Exclude logged-in user and specific user
                ],
            },
            { username: 1, fullname: 1, profilePic: 1, _id: 1 } // Include only these fields
        ).limit(10);

        console.log("results: ", results);
        res.json(results);
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getSpecificUser = async (req, res) => {
    const loggedInUserId = req.user._id; // ID of the logged-in user
    const specificUserId = "66c048e50d7696b4b17b5d53"; // Specific user ID to exclude

    try {
        // Fetch suggested friends
        const suggestedFriends = await User.find({
            _id: { $nin: [loggedInUserId, specificUserId] }, // Exclude logged-in user and specific user
            followers: { $nin: [loggedInUserId] }, // Exclude users already followed by the logged-in user
            following: { $nin: [loggedInUserId] }, // Exclude users already followed by the logged-in user
        })
            .select("fullname username profilePic") // Include only these fields
            .limit(10); // Limit the results to 10 users

        // Send the response
        res.json(suggestedFriends);
        console.log("suggestedFriends: ", suggestedFriends);

    } catch (error) {
        console.error("Error fetching suggested friends:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
// Controller to get user details by ID
export const getUserInformation = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    // Validate the userId format
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({
            error: "Invalid user ID format"
        });
    }

    try {
        const user = await User.findById(userId)
            .select('fullname username profilePic')
            .lean();

        if (!user) {
            return res.status(404).json({
                error: "User not found"
            });
        }
        console.log("user: ", user);

        res.status(200).json(user);

    } catch (error) {
        console.error("Error fetching user details:", error);

        if (error.name === 'CastError') {
            return res.status(400).json({
                error: "Invalid user ID format"
            });
        }

        res.status(500).json({
            error: "Internal Server Error",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
});