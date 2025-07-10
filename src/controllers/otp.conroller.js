import {Otp} from "../models/otp.model.js";
import {User} from "../models/user.model.js";
import nodemailer from "nodemailer";

const sendotp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ success: false, message: "Please provide an email address" });
        }
        const user =await User.findOne({ email });
        if (user) {
            return res.status(400).json({ success: false, message: "User already exists with this email" });
        }

       

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        const newOtp = await Otp.create({
            email,
            
            otp,
            expiresAt,
        });

        // Send OTP via email
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}. It is valid for 10 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    }catch (error) {
        console.error("Error in sendotp:", error);
        return res.status(500).json({ success: false, message: "Internal server error" , error});
    }   
}

const verifyotp = async (req, res) => {
    try {
        const { email, otp } = req.body;
        if (!email || !otp) {
            return res.status(400).json({ success: false, message: "Please provide email and OTP" });
        }


        const otpRecord = await Otp.findOne({ email}).sort({ createdAt: -1 });
        if (!otpRecord || otpRecord.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: "OTP expired or not found" });
        }

        const isValidOtp = await otpRecord.isvalid(otp);
        if (!isValidOtp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        // OTP is valid, proceed with further actions (e.g., reset password)
        return res.status(200).json({ success: true, message: "OTP verified successfully" });

    } catch (error) {
        console.error("Error in verifyotp:", error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
}
export { sendotp, verifyotp };