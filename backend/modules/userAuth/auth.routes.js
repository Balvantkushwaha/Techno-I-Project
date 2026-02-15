import express from "express";
import { 
    register, 
    login, 
    logout, 
    forgetPassword, 
    resetPassword,
    getProfile 
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

// --- Public Routes (Anyone can access) ---

// 1. Register a new user
router.post("/register", register);

// 2. Login user and get Token
router.post("/login", login);

// 3. Request password reset link/OTP
router.post("/forget-password", forgetPassword);

// 4. Set a new password using reset token
router.put("/reset-password/:token", resetPassword);


// --- Protected Routes (Login required) ---

// 5. Get current user profile (Uses Middleware)
router.get("/profile", protect, getProfile);

// 6. Logout user
router.post("/logout", protect, logout);

export default router;