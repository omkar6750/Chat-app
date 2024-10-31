import User from "../models/UserModel.js";
import jwt from "jsonwebtoken";

const MaxAge = 3 * 24 * 60 * 60 * 1000;
const createToken = (email, userID) => {
    return jwt.sign({email, userID}, process.env.JWT_KEY, {expiresIn: MaxAge})
}

export const signup = async(request,response,next) => {
    try{
        const {email, password} = request.body;
        if(!email || !password){
            return response.status(400).send("Email and Password are Required")
        }
        const user = await User.create({email, password})
        response.cookie("jwt", createToken(email, user.id), {
            maxAge:MaxAge,
            secure: true,
            sameSite: "None"
        });
        return response.status(201).json({
            user:{
                id: user.id,
                email: user.email,
                profileSetup: user.profileSetup,
            
        }})
    }catch(error){
        console.error('Error during signup:', error);
        return response.status(500).send("Internal Server Error");
    }
};