import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessageModel.js";

export const searchContacts = async(request, response, next) => {
    try{
        const{searchTerm} = request.body;
        if(searchTerm === undefined || searchTerm === null){
            return response.status(400).send("Search term is required.")
        }
        const sanitizeSearchTerm = searchTerm.replace(
            /[.*+?^${}()|[\][\\]/g,"\\$&"
        )
        const regex = new RegExp(sanitizeSearchTerm, "i" )
        const contacts = await User.find({
            $and: 
                [{
                    _id: {$ne: request.userId}
                }, 
                {
                    $or:[{firstName: regex}, {lastName:regex},{email:regex} ]
                }],
        });
        return response.status(200).json({contacts});


    }catch(error){
        console.error("Error removing profile image:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getContactsForDMList = async(request, response, next) => {
    try{
        let {userId} = request;
        userId = new mongoose.Types.ObjectId(userId);

        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [
                        {sender: userId},
                        {recipient: userId},
                    ]
                }
            },
            {
                $sort: {timeStamp: -1}
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: {$eq: ["$sender", userId]},
                            then: "$recipient",
                            else: "$sender"
                        },
                    },
                    lastMessage: {$first: "$timeStamp" },
                },
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id:1,
                    lastMessage:1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    color: "$contactInfo.color",
                    image: "$contactInfo.image",
                }
            },
            {
                $sort: {lastMessage: -1},
            }
            
        ])
        
        return response.status(200).json({contacts});


    }catch(error){
        console.error("Error removing profile image:", error);
        return response.status(500).send("Internal Server Error");
    }
};

export const getAllContacts = async(request, response, next) => {
    try{

        const users = await User.find({_id : {$ne: request.userId}} ,
            "firstName lastName _id email"
        );
        const contacts = users.map((user) => ({
            label: user.firstName? 
                ` ${user.firstName} ${user.lastName}` : user.email,
            value: user._id
            
        }));
        return response.status(200).json({contacts});


    }catch(error){
        console.error("error getting contacts:", error);
        return response.status(500).send("Internal Server Error");
    };
}
