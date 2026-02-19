import jwt from "jsonwebtoken";
import User from "../modules/userAuth/auth.model.js";

export const protect = async (req, res, next) => {
    console.log("Protect middleware called...");
    try {
        console.log("Cookies in request:", req.cookies);
        // 1. Get token from cookies
        const token = req.cookies.token;
        console.log("Token from cookies:", token);

        if (!token) {
            return res.status(401).json({ success: false, message: "Not authorized, please login" });
        }
        console.log("Token found in cookies:", token);
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", decoded);

        // 3. Find user and attach to request (excluding password)
        req.user = await User.findById(decoded.id).select("-password");
        
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        next(); // Move to the next controller
    } catch (error) {
        res.status(401).json({ success: false, message: "Token failed, session expired" });
    }
};