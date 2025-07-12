import { Message } from "../models/messages.model.js";
import { Chat } from "../models/chat.model.js";

export const sendMessage = async (req, res) => {
    try {
        const { recieverId, content } = req.body;

        if (!recieverId || !content) {
            return res.status(400).json({ message: "Receiver ID and content are required" });
        }

        const senderId = req.user._id

        const chat = await Chat.findOne({ users: { $all: [senderId, recieverId] } });

        if (!chat) {
            return res.status(404).json({ message: "Chat does not exist" });
        }

        const newMessage = await Message.create({
            sender: senderId,
            reciever : recieverId,
            content,
            chat: chat._id, // optional field in schema if you want
        });

        chat.messages.push(newMessage._id);
       chat.messageIndicators.set(recieverId.toString(), true);


        await chat.save();
        return res.status(201).json({
            message: "Message sent successfully",
            data: newMessage
        });

    } catch (error) {
        console.error("Error in sendMessage:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};