import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    
    users: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Message",
        },
    ],
   messageIndicators: {
        type: Map,
        of: Boolean,
        default: {},
    },


    }, { timestamps: true });

   

    export const Chat = mongoose.model("Chat", chatSchema);