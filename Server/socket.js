import {Server as SocketIoServer } from "socket.io";
import Message from "./models/MessageModel.js";
import Channel from "./models/ChannelModel.js";


const MAX_MESSAGES = 50; 
const MAX_CHANNEL_MESSAGES = 250;

const setUpSocket = (server) => {
    const io = new SocketIoServer(server, {
        cors: {
            origin: process.env.ORIGIN,
            methods: ["GET", "POST"],
            credentials: true,
        }
    });
    const userSocketMap = new Map();
    const userMessageCount = new Map();
    const channelMessageCount = new Map(); 

    const disconnect = (socket) => {
        for(const [userId, socketId] of userSocketMap.entries()){
            if(socketId === socket.id){
                userSocketMap.delete(userId);
                console.log("User disconnected: ", userId);
                break;
            }
        }
    };

    const deleteUserMessages = async (userId) => {
        try {
            await Message.deleteMany({ sender: userId });
            console.log(`Deleted all messages for user: ${userId}`);
        } catch (err) {
            console.error("Error deleting messages:", err);
        }
    };

    const deleteChannelMessages = async (channelId) => {
        try {
            await Message.deleteMany({ channelId });
            console.log(`Deleted all messages in channel: ${channelId}`);
        } catch (err) {
            console.error("Error deleting channel messages:", err);
        }
    };

    // Function to handle message deletion if the user exceeds MAX_MESSAGES
    const checkAndDeleteMessages = async (userId) => {
        const messageCount = userMessageCount.get(userId) || 0;

        if (messageCount >= MAX_MESSAGES) {
            await deleteUserMessages(userId);
            userMessageCount.set(userId, 0);  // Reset message count after deletion
        }
    };

    const checkAndDeleteChannelMessages = async(channelId) => {
        const messageCount = channelMessageCount.get(channelId) || 0;

        if(messageCount >= MAX_CHANNEL_MESSAGES){
            await deleteChannelMessages(channelId);
            channelMessageCount.set(channelId, 0);
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

        const senderMessageCount = await Message.find({sender: message.sender})
        if(senderMessageCount.length >= MAX_MESSAGES){
            try {
                await Message.deleteMany({
                    sender: message.sender, 
                    recipient: message.recipient
                })    
            } catch (error) {
                console.log(error)
            }
            io.to(senderSocketId).emit("error", "message-limit-exceeded")
        }
    }
    const sendChannelMessage = async(message) => {
        const { channelId, sender, content, fileUrl, messageType} = message;

        const createdMessage = await Message.create({
            sender,
            recipient: null,
            content,
            messageType,
            timeStamp: new Date(),
            fileUrl,
        });
        const messageData = await Message.findById(createdMessage._id)
        .populate("sender", "_id email lastName firstName color image ")
        .exec();

        await Channel.findByIdAndUpdate(channelId, {
            $push: {
                messages : createdMessage._id
            }
        })

        const channel = await Channel.findById(channelId).populate("members").populate("admin")

        const finalData = {...messageData._doc, channelId: channel._id}

        if(channel && channel.members) {
            channel.members.forEach((member) => {
                const memberSocketId = userSocketMap.get(member._id.toString());
                if(memberSocketId) {
                    io.to(memberSocketId).emit("receiveChannelMessage", finalData);
                }
            })
        }
        if(channel.admin){
            const adminSocketId = userSocketMap.get(channel.admin._id.toString());
            if(adminSocketId){
                io.to(adminSocketId).emit("receiveChannelMessage", finalData);
            }
        }

        const channelMessageCountValue = channelMessageCount.get(channelId) || 0;
        channelMessageCount.set(channelId, channelMessageCountValue + 1);

        // Check and delete channel messages if the channel exceeds MAX_MESSAGES
        await checkAndDeleteChannelMessages(channelId);
        
        
    }

    const MAX_USERS = 10;

    io.on("connection", (socket) => {
        const userId = socket.handshake.query.userId;
        if (userSocketMap.size >= MAX_USERS) {
            socket.emit("error", "max-user-limit-reached");
            disconnect(socket); // Disconnect excess users
            return;
        }
        if(userId) {
            userSocketMap.set(userId, socket.id)
            console.log("User connected: ", userId, socket.id)
        }else{
            console.error("No userId found in socket query");
        }
        socket.on("sendMessage", sendMessage)
        socket.on("sendChannelMessage", sendChannelMessage)
        socket.on("disconnect", (socket) => {
            disconnect(socket);
            console.log("User disconnected: ", userId);
        })
    }) 


}

export default setUpSocket;