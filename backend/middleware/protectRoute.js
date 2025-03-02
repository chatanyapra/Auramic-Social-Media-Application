import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protectRoute = (async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({error: "Unauthorized user, no token provided1"})
        }
        const decode = jwt.verify(token, process.env.JWT_SECRET);
        if(!decode){
            return res.status(401).json({error: "Unauthorized user, no token provided2"});
        }
        const user = await User.findById(decode.userId).select("-password");
        
        if(!user){
            return res.status(404).json({error: "User not found"});
        }
        req.user = user;
        console.log("User is authenticated"+req.user);
        
        next();
    } catch (error) {
        console.log("Error in ProtectRoute Middleware", error.message);
        res.status(400).json({message: "Internal Server Error!"});
    }
});

export default protectRoute;