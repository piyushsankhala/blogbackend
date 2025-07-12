import {Chat} from "../models/chat.model.js";
import {User} from "../models/user.model.js";
import mongoose from "mongoose";

 const createchat = async (req, res) => {
  try {
    console.log("🟡 Entered createchat");

    const { recieverid } = req.body;
    console.log("📨 Receiver ID:", recieverid);

    if (!recieverid) {
      console.log("❌ Missing receiver ID");
      return res.status(400).json({ message: "Receiver ID is required" });
    }

    const senderId = req.user?._id;
    console.log("🧑 Sender ID from token:", senderId);

    if (!senderId) {
      console.log("❌ senderId is undefined");
      return res.status(401).json({ message: "Unauthorized" });
    }

    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(recieverid);

    console.log("✅ Converted to ObjectId");

    const existingChat = await Chat.findOne({
      users: { $all: [senderObjectId, receiverObjectId] },
    }).populate("users");

    console.log("📦 Existing chat:", existingChat);

    if (existingChat) {
      return res.status(200).json({ data: existingChat });
    }

    const newChat = await Chat.create({
      users: [senderObjectId, receiverObjectId],
    });

    console.log("✅ New chat created:", newChat);

    return res.status(201).json({ data: newChat });
  } catch (error) {
    console.error("🔥 Caught error in createchat:", error);
    return res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
};


  const acesschat = async (req, res) => {
    try {
        const {recieverid} = req.body
        const senderId = req.user._id;
        if (!recieverid) {
            return res.status(400).json({ message: "Receiver ID is required" });
        }
        if (!senderId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const sender= await User.findById(senderId);
        const reciever = await User.findById(recieverid);
        if (!sender) {  
            return res.status(404).json({ message: "Sender not found" });
        }
        if (!reciever) {
            return res.status(404).json({ message: "Receiver not found" });
        }
        const users = [sender, reciever];
      const chats = await Chat.findOne({ users: { $all: [sender._id, reciever._id] } }).populate("users").populate("messages")
      chats.messageIndicators.set(senderId.toString(), false);
      await chats.save();

     

        if (!chats || chats.length === 0) {
            return res.status(404).json({ message: "No chats found" });
        }
        return res.status(200).json({ data: chats });
    } catch (error) {
  console.error("Error in acessorcreateChat:", error.message);
  console.error(error.stack);
  return res.status(500).json({ message: "Internal server error" });
}
}
export { acesschat, createchat  };

        