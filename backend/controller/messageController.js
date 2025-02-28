import asyncHandler from "express-async-handler";
import Conversation from "../models/conversationModel.js";
import Message from "../models/messageModel.js"
import { io } from '../socket/socket.js';
import cloudinary from '../cloudinary/cloudinaryConfig.js';
import fs from 'fs';
import { getReceiverSocketId } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        })
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        }
        let fileUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                resource_type: "auto"
            });

            fileUrl = result.secure_url;

            fs.unlink(req.file.path, (err) => {
                if (err) {
                    console.error('Error deleting the file from the server:', err);
                }
            });
        }
        const newMessage = new Message({
            senderId,
            receiverId,
            message,
            fileUrl
        })
        if (newMessage) {
            conversation.messages.push(newMessage._id);
        }
        await Promise.all([conversation.save(), newMessage.save()]);
        // adding socket io to show live meesages changes---------------
        const receiverSocketId = getReceiverSocketId(receiverId);
        if (receiverSocketId) {
            //io.to(<socket_id>).emit() used to send event to specific client--------------
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json({ newMessage, fileUrl });

    } catch (error) {
        console.log("Error in Message Controller", error.message);
        res.status(400).json({ message: "Internal Server Error!" });
    }
})

export const getMessages = asyncHandler(async (req, res) => {
    try {
        const { id: chatUserId } = req.params;
        const senderId = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, chatUserId] },
        }).populate("messages");  //populate function not return the reference/_id but return the actual messages from the collection

        if (!conversation) {
            return res.status(200).json([]);
        }
        const message = conversation.messages;
        res.status(200).json(message);

    } catch (error) {
        console.log("Error in Message Controller", error.message);
        res.status(400).json({ message: "Internal Server Error!" });
    }
})