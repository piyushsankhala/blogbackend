import mongoose  , {Schema} from "mongoose";
import bcrypt from "bcryptjs";

const otpschema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
   
    otp: {
        type: String,
        required: true,
    },
    expiresAt: {
        type: Date,
        required: true,
    },
}, { timestamps: true });

otpschema.methods.isvalid = function(inputOtp) {
    return this.otp === inputOtp;
};


export const Otp = mongoose.model("Otp",otpschema )