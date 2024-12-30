import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Channel from "../models/ChannelModel.js";

export const createChannel = async(request, response, next) => {
    try{

        const {name, members} = request.body;
        const userId = request.userId;
        const admin = await User.findById(userId);

        if(!admin){
            return response.status(400).send("admin not found");
        }
        const validMembers = await User.find({ _id: { $in: members }});
        if(validMembers.length !== members.length){
            return response.status(400).send("some members are not valid users.");
        }
        const newChannel = new Channel({
            name, members, admin:userId
        });
        await newChannel.save();
        return response.status(201).json({Channel: newChannel});


        }catch(error){
        console.error("Channel could'nt be formed", error);
        return response.status(500).send("Internal Server Error");
    }
};


export const getUserChannels = async(request, response, next) => {
    try{

        const userId = new mongoose.Types.ObjectId(request.userId);
        const channels = await Channel.find({
            $or: [{admin: userId}, {members: userId}]
        }).sort({updatedAt: -1});
        return response.status(201).json({channels});

        }catch(error){
        
        return response.status(500).send("Internal Server Error");
    }
};

export const getChannelMessages = async(request, response, next) => {
    try{

        const {channelId} = request.params;
        const channel = await Channel.findById(channelId).populate({
            path: "messages",
            populate:{
                path: "sender",
                select: "_id email firstName lastName image color"
            },
        });
        if(!channel){
            return response.status(404).send("Channel not found");
        }

        const messages = channel.messages; 
        return response.status(201).json({messages});


        }catch(error){
        
        return response.status(500).send("Internal Server Error");
    }
};
