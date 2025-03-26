import { Server } from "socket.io";
import http from 'http';
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        // origin: [`https://auramic.onrender.com`],
        origin: [`http://localhost:5007`],
        methods: ['GET', 'POST'],
        credentials: true
    }
});
// https://auramic-chatting.onrender.com
let userSocketMap = {}; // {userid: socket.id}

export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    // console.log("User connected with userId:", userId);
    
    if (userId && userId !== "undefined") {
        userSocketMap[userId] = socket.id;
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    } 
    // else {
    //     console.log("Invalid userId received");
    // }

    // console.log("A user connected...: ", socket.id);

    // Uncomment this section if you need the calling functionality

    socket.on("room:join", (data) => {
        const {username, userId, room, video } = data;
        io.to(room).emit("user:joined", {username, id: socket.id, userId: room, video });
        socket.join(room);
        // console.log("room- ", room);

        const userSocket = userSocketMap[room];
        io.to(userSocket).emit("user:request", {username, userId, room, video });

        // io.to(socket.id).emit("room:join", data);
    });

    socket.on("user:call", ({username, to, offer, video }) => {
        // console.log("user:call - ", to, " video - ", video);
        io.to(to).emit("incomming:call", {username, from: socket.id, offer, video });
    });

    socket.on("call:accepted", ({ to, ans }) => {
        // console.log("call:accepted - ", to);
        io.to(to).emit("call:accepted", { from: socket.id, ans });
    });

    socket.on("peer:nego:needed", ({ to, offer }) => {
        // console.log("peer:nego:needed", offer);
        io.to(to).emit("peer:nego:needed", { from: socket.id, offer });
    });

    socket.on("peer:nego:done", ({ to, ans }) => {
        // console.log("peer:nego:done", ans);
        io.to(to).emit("peer:nego:final", { from: socket.id, ans });
    });

    socket.on("call:accept:calley", ({ to }) => {
        io.to(to).emit("call:accept:calley", { from: socket.id });
    });

    socket.on('call:end', ({ to }) => {
        // console.log("new disconnect--------------");
        socket.to(to).emit('call:end');
    });

    socket.on("disconnect", () => {
        // console.log("User disconnect: ", socket.id);
        delete userSocketMap[userId];
        io.emit("getOnlineUsers", Object.keys(userSocketMap));
    });
});

export { app, io, server };
