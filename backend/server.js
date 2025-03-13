import path from 'path';
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectMongoose from "./dbConnection/dbConnection.js";
import authRoutes from "./routes/authRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import accountRoutes from "./routes/accountRoutes.js";
import { app, server } from "./socket/socket.js";
import bodyParser from 'body-parser';
import storyRoutes from "./routes/storyRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import followRoutes from "./routes/followRoutes.js";
import likeRoutes from "./routes/likeRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import cors from 'cors';

const port = 5007;
const __dirname = path.resolve();
dotenv.config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/users/", userRoutes);
app.use("/api/account/", accountRoutes);
app.use("/api/stories", storyRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/follow", followRoutes);
app.use("/api/likes", likeRoutes);
app.use("/api/comments", commentRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist")));

app.get("*",(req, res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"));
})

server.listen(port, () => {
    connectMongoose();
    console.log(`Server running on port ${port}`);
})
