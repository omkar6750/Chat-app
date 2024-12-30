import {Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";

const setUpSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    const userSocketMap = new Map();

    const disconnect = (socket) => {
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                console.log("User disconnected: ", userId);
                break;
            }
        }
    }
    const sendMessage = async(message) => {
        const senderSocketId = userSocketMap.get(message.sender);
        const recipientSocketId = userSocketMap.get(message.recipient);
        

        const createdMessage = await Message.create(message);

        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "_id firstName lastName email image color")
        .populate("recipient", "_id firstName lastName email image color");

        if(senderSocketId){
            io.to(senderSocketId).emit("receiveMessage", messageData);
        }
        if(recipientSocketId){
            io.to(recipientSocketId).emit("receiveMessage", messageData);
        }
    }

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if(userId) {
            userSocketMap.set(userId, socket.id)
            console.log("User connected: ", userId, socket.id)
        }else{
            console.error("No userId found in socket query");
        }
        socket.on("sendMessage", sendMessage)
        socket.on("disconnect", (socket) => {
            disconnect(socket);
            console.log("User disconnected: ", userId);
        })
    }) 


}

export default setUpSocket;