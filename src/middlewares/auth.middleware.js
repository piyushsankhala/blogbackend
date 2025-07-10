import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';

const authmiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.accesstoken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login to access this resource",
      });
    }

    const verifyUser = jwt.verify(token, process.env.ACCESS_KEY_SECRET);
    const user = await User.findById(verifyUser.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log("entered catch block in authmiddleware");
    console.error(error.name, error.message);

    if (error.name === "TokenExpiredError") {
      // 🔴 access token is expired
      return res.status(401).json({ success: false, message: "Access token expired" });
    }

    // 🔴 some other error
    return res.status(500).json({
      success: false,
      message: "Error in authmiddleware",
    });
  }
};

export { authmiddleware };
