import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateTokenAndSetCookie from "../securityToken/generateToken.js";

// signup public
export const createUser = asyncHandler(async (req, res) => {
    try {
        const {username, fullname, password, confirmPassword} = req.body;
        if(!username || !fullname || !password || !confirmPassword){
            return res.status(400).json({error: "All fields are mandatory!"});
        }
        if(confirmPassword !== password){
            return res.status(400).json({error: "Password don't match!"});
        }
        const user = await User.findOne({username});
        if(user){
            res.status(400).json({error: "User already exist!"});
        }
        
        // profile pics
        const boyProfilePic = `https://avatar.iran.liara.run/public/boy/?username=${username}`;
        // password hashing
        const hashedPassword= await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        const newUser= new User({
            fullname,
            username, 
            password: hashedPassword,
            profilePic: boyProfilePic
        })
        if(newUser){
            // generate JWT token-----
            generateTokenAndSetCookie(newUser._id, res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                username: newUser.username,
                fullname: newUser.fullname,
                profilePic: newUser.profilePic
            })
        }else{
            res.status(400).json({error: "Invalid user data"});
        }
        
        res.status(200).json({message: "User Created"});
    } catch (error) { 
        console.log("Error in Signup Controller", error.message);
        res.status(500).json({message: "Internal Server Error!"});
    }
})

// login public
export const loginUser = asyncHandler(async (req, res) => {
    try {
        const {username, password} = req.body;
        const user = await User.findOne({username});
        const isPassword= await bcrypt.compare(password, user?.password || "");
        if(!user || !isPassword){
            res.status(400).json({error: "Invalid password or username"});
        }
        generateTokenAndSetCookie(user._id, res);

        res.status(200).json({
            _id: user._id,
            fullname: user.fullname,
            username: user.username,
            profilePic: user.profilePic
        })

    } catch (error) {
        console.log("Error in Login Controller", error.message);
        res.status(500).json({message: "Internal Server Error!"});
    }
})

// logout public
export const logoutUser = asyncHandler(async (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge : 0});
        res.status(200).json({message: "Logout Successfully!"});
    } catch (error) {
        console.log("Error in Logout Controller", error.message);
        res.status(400).json({message: "Internal Server Error!"});
    }

})

