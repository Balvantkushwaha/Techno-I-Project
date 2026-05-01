// auth.routes.js - User Authentication Routes
import express from "express";
import {
  initRegister,
  verifyOtp,
  completeRegister,
  login,
  verifyLoginOtp,
  forgetPassword,
  resetPassword,
  getProfile,
  logout
} from "./Controllers/auth.controller.js";
import { protect } from "../../middlewares/auth.middleware.js";
import { authLimiter, otpLimiter } from "../../middlewares/rateLimiter.js";


const router = express.Router();



// --- Public Routes (Anyone can access) ---

// 1. Register a new user
router.post("/register/init",otpLimiter, initRegister);
router.post("/register/verify-otp", otpLimiter, verifyOtp);
router.post("/register/complete", completeRegister);

// 2. Login user and get Token
router.post("/login/method", authLimiter, login);

router.post("/login/verify-otp", otpLimiter, verifyLoginOtp);

// 3. Request password reset link/OTP
router.post("/forget-password",forgetPassword);

// 4. Set a new password using reset token
router.put("/reset-password", resetPassword);


// --- Protected Routes (Login required) ---

// 5. Get current user profile (Uses Middleware)
router.get("/profile", protect, getProfile);

// 6. Logout user
router.post("/logout", protect, logout);

export default router;