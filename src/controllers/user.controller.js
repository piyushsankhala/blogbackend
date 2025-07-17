import express from 'express';
import {User} from '../models/user.model.js';
import jwt from "jsonwebtoken"
import { Chat } from '../models/chat.model.js';
const registeruser = async (req ,res) => {
    try{
            const {username , email , password}= req.body;
            
            if(!username || !email || !password){
                return res.status(400).json({message : "Please fill in all fields"});
            }
            const existingUser = await User.findOne({$or : [{username} , {email}]});
            if(existingUser){
                return res.status(400).json({message : "Email or username already in use"});
            }

            await User.create({
                username , email , password

            })
            return res.status(201).json({message : "user created successfully"})
    }
    catch(error){
        console.log(error);
        return res.status(500).json({message : "Internal server error",error});
    }



}

const loginuser = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("📥 Body:", req.body);

    if (!username || !password) {
      console.log("❌ Missing username or password");
      return res.status(400).json({
        message: "Please provide both username and password",
      });
    }

    const existinguser = await User.findOne({ username });
    console.log("🔍 User found:", existinguser);

    if (!existinguser) {
      return res.status(400).json({ message: "No user with such credentials exists" });
    }

    const isvalid = await existinguser.isvalidpassword(password);
    console.log("✅ Password valid?", isvalid);

    if (!isvalid) {
      return res.status(401).json({ message: "Password is not valid" });
    }

    const refreshtoken = existinguser.getrefreshtoken();
    const accesstoken = existinguser.getaccesstoken();
    console.log("🔑 Tokens generated");

    existinguser.refreshtoken = refreshtoken;
    await existinguser.save();
    console.log("💾 Token saved to DB");

    return res
      .status(200)
      .cookie("accesstoken", accesstoken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 15 * 60 * 1000, 
        path :"/"
      })
      .cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: 3 * 24 * 60 * 60 * 1000,
        path :"/"
      })
      .json({ message: "Logged in successfully" , currentuserid : existinguser._id.toString() });
  } catch (error) {
    console.error("🔥 Login error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


const logout = async(req,res)=>{
    try{
        return res.clearCookie("accesstoken", {httpOnly:true , secure:true , sameSite :"None" , path :"/"}).clearCookie("refreshtoken",  {httpOnly:true , secure:true , sameSite :"None",path :"/"}).json({message : "logged out successfully"})
    }catch(error){
        console.error(error);
        return res.status(500).json({message : "Internal server error"});

    }


}



const refreshacesstoken = async (req, res) => {
  try {
    const refreshtoken = req.cookies.refreshtoken;
    console.log(refreshtoken)

    if (!refreshtoken) {
      return res.status(401).json({ message: "Please login first" });
    }

    // 🔐 Verify the refresh token
    const decoded = jwt.verify(refreshtoken, process.env.REFRESH_KEY_SECRET);
    const userId = decoded.id;

    // 🧠 Find user by ID
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(401).json({ message: "User not found" });
    }

    // 🔒 Ensure the refresh token matches the stored one
    if (existingUser.refreshtoken !== refreshtoken.toString()) {
      return res.status(403).json({ message: "Refresh token mismatch" });
    }

    // ✅ Issue new tokens
    const accesstoken = existingUser.getaccesstoken();
    const newrefreshtoken = existingUser.getrefreshtoken()
    existingUser.refreshtoken = newrefreshtoken;
    await existingUser.save();

    console.log("new access token generated");

    return res
      .status(200)
      .cookie("accesstoken", accesstoken, {
        httpOnly: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "None",
        secure: true,
      })
      .cookie("refreshtoken", newrefreshtoken, {
        httpOnly: true,
        maxAge: 3 * 24 * 60 * 60 * 1000,
        sameSite: "None",
        secure: true,
      })
      .json({ success: true, message: "Token refreshed" });

  } catch (err) {
    console.error("Refresh token error:", err);
    return res.status(401).json({ message: "Unauthorized: refresh token invalid or expired" });
  }
};
const currentuser = async(req,res)=>{
  try{
    const currentuserid = req.user._id
    if(!currentuserid){
      return res.status(400).json({message :"no currentuser"})
    }
    
    return res.status(201).json({currentuserid})
  }catch(error){
    console.error(error)
    return res.status(500).json({message :"error in current user"})
  }

}
const getallusers = async (req, res) => {
  try {
    const currentsuserid = req.user._id;

    const users = await User.find({ _id: { $ne: currentsuserid } }); // exclude self
    
    const chatusers = await Promise.all(
      users.map(async (user) => {
        const chat = await Chat.findOne({
          users: { $all: [currentsuserid, user._id] }
        });
       

        if (chat && chat.messages.length>0) {
          return { username: user.username, _id: user._id,messageindicator : chat.messageIndicators.get(currentsuserid) };
        }

        return null; // no chat exists
      })
    );

    // ✅ filter out nulls
    const validUsers = chatusers.filter(Boolean);

    return res.status(200).json({validUsers});
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const countUnreadChats = async (req, res) => {
  try {
    const currentUserId = req.user._id.toString();

    const chats = await Chat.find({ users: currentUserId });

    let unreadChatCount = 0;

    for (const chat of chats) {
      const hasUnread = chat.messageIndicators?.get(currentUserId) === true;
      if (hasUnread) {
        unreadChatCount++;
      }
    }

    return res.status(200).json({ unreadChatCount });
  } catch (err) {
    console.error("Error in countUnreadChats:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
const allusers = async(req , res)=>{
  try{
    const users = await User.find();
    return res.status(200).json({users});
  }
  catch(err){
    console.error(err);
  }
}



export {registeruser,loginuser,refreshacesstoken,logout,currentuser,getallusers,countUnreadChats,allusers}

