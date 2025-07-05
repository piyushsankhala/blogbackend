import jwt from 'jsonwebtoken';

import { User } from '../models/user.model.js';

const authmiddleware = async(req,res,next)=>{
    try{
        const token = req.cookies.acesstoken;

        if(!token){
            return res.status(401).json({success:false,message:"Please login to access this resource"})
        }
        const verifyUser = jwt.verify(token,process.env.ACCESS_SECRET_KEY);
        const user = await User.findById(verifyUser.id).select("-password");
        if(!user){
            return res.status(401).json({success:false,message:"User not found"})
        }
        req.user = user;
        next();
    }
    catch(error){
        console.error(error);
        res.status(500).json({success:false,message:"Server error"})
    }
}
export {authmiddleware}