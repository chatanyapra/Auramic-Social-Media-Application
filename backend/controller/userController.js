import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import Story from "../models/storyModel.js";
// import vision from '@google-cloud/vision';
import { GoogleGenerativeAI } from '@google/generative-ai';
// import path from 'path';
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
        console.log("image, question receiverId ----", image, question, receiverId);

        if (question !== "") {
            question = `The user input is: "${question}". 
            You are AuramicAi, a assistant that works inside this application. 
            Your task is to answer questions or provide relevant information based on the user's input. 
            You can generate creative content (stories, articles, poems, code, scripts, music, emails, etc.), summarize texts, translate languages,Image Analysis , and offer detailed explanations or answers to the user's queries. 
            If an image is provided, analyze the image and incorporate relevant details into your response. 
            Use this to assist the user effectively.`;
        }

        if (previousMessage !== "") {
            question += ` Here is the context from a previous response or selected text: "${previousMessage}". 
            Please consider this while formulating your answer.`;
        }

        if (image) {
            question += ` An image has been provided. Analyze the image and use the information to enhance your answer to the user's query.`;
        }

        question += ` Provide a clear and helpful answer to the user's query based on the text, image, or previous context.`;

        if (question.length > 3000) {
            return res.status(400).json({ error: 'String length exceeds 3000 characters' });
        }


        console.log("question:------", question);
        let extractedText = "";

        const model = await genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });
        function fileToGenerativePart(path, mimeType) {
            return {
                inlineData: {
                    data: Buffer.from(fs.readFileSync(path)).toString("base64"),
                    mimeType,
                },
            };
        }
        const prompt = question + extractedText;
        let imagePart;
        if (image) {
            imagePart = fileToGenerativePart(
                `${image.path}`,
                "image/jpeg",
            );
        }
        let result;
        if (imagePart) {
            result = await model.generateContent([prompt, imagePart]);
        } else {
            result = await model.generateContent([prompt]);
        }
        const responseText = result.response.text();
        console.log("result.response.text()---- ", responseText)
        if (responseText) {
            let newMessage;
            const sendMessageResponse = await sendAuramicDb(responseText, receiverId, image);
            if (sendMessageResponse) {
                newMessage = sendMessageResponse.newMessage;
            } else {
                newMessage = responseText;
            }
            res.json({ response: newMessage });
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }
        }
        if (imagePart) {
            fs.unlink(image.path, (err) => {
                if (err) {
                    console.error('Error deleting the file from the server:', err);
                }
            });
        }
    } catch (error) {
        console.error('Error processing request:', error);
        res.status(500).json({ error: error.toString() });
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

        // Fetch the logged-in user
        const user = await User.findById(userId)
            .select("-password") // Exclude password
            .populate("followers", "fullname username profilePic")
            .populate("followRequests", "fullname username profilePic")
            .populate("following", "fullname username profilePic");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch the specific user (this will be included with every user response)
        const specificUser = await User.findById(specificUserId).select(
            "fullname username profilePic"
        );

        if (!specificUser) {
            return res.status(404).json({ error: "Specific user not found" });
        }

        const followingIds = user.following.map((user) => user._id);

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

        // Include specific user with every user response
        res.status(200).json({
            user,
            stories: allStories,
            specificAiUser: specificUser,
            specificUserId,
        });
    } catch (error) {
        console.error("Error fetching user profile and stories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getUserProfileDataById = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await User.findById(userId)
            .select("-password")  // Exclude password
            .populate("followers", "username profilePic")
            .populate("followRequests", "fullname username profilePic")
            .populate("following", "username profilePic");

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user profile and stories:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
};


