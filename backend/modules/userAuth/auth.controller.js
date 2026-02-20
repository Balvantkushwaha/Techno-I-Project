import bcrypt from "bcryptjs";
import { generateToken } from "../../utils/token.util.js";
import User from "./auth.model.js";
import {
  sendOtpService,
  verifyOtpService,
  registerUserService,
  setAuthCookie,
} from "./auth.service.js";
import { hashPassword } from "../../utils/password.util.js";

// 1️⃣ INIT REGISTER (Send OTP)
export const initRegister = async (req, res) => {
  console.log("api hit Init Register Called...");
  try {
    const { identifier } = req.body;

    const userExists = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }],
    });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    console.log("Sending OTP to:", identifier);

    const otpRes = await sendOtpService(identifier);

    res
      .status(200)
      .json({ success: true, message: "OTP sent", data: otpRes.data });
  } catch (err) {
    console.error("Error sending OTP:", err);
    res.status(500).json({ error: err.message });
  }
};

// 2️⃣ VERIFY OTP
export const verifyOtp = async (req, res) => {
  console.log("api hit Verify OTP Called...");
  try {
    const { identifier, otp } = req.body;

    const verifyRes = await verifyOtpService(identifier, otp);

    res.status(200).json({
      success: true,
      verified: verifyRes.verified,
      message: verifyRes.message,
      nextStep: "COLLECT_USER_DETAILS",
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


// 3️⃣ COMPLETE REGISTRATION
export const completeRegister = async (req, res) => {
  console.log("api hit Complete Register Called...");
  try {
    const { identifier, firstName, lastName, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword)
      return res.status(400).json({ message: "Passwords do not match" });

    const response = await registerUserService({
      identifier,
      firstName,
      lastName,
      password,
    });
    console.log("User registered:", response.data.user);

    setAuthCookie(res, response.data.token); // Helper function to set cookie

    res.status(201).json({
      success: true,
      message: "Registration successful and logged in",
      user: response.data.user,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



// 4️⃣ LOGIN
export const login = async (req, res) => {
  console.log("api hit Login Called...");
  try {
    const { identifier, password, loginMethod } = req.body; // loginMethod: 'password' or 'otp'

    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    }).select("+password");

    if (!user) return res.status(404).json({ message: "User not found" });

    // FLOW 1: PASSWORD LOGIN
    if (loginMethod === "password") {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });
      
      const token = generateToken(user._id);
      console.log("token generated:", token);
      setAuthCookie(res, token); // Helper function to set cookie
      return res.status(200).json({ success: true, message: "Login successful", data:user });
    }

    // FLOW 2: OTP LOGIN REQUEST
    await sendOtpService(identifier);
    res.status(200).json({ success: true, message: "OTP sent for login" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// 5️⃣ VERIFY LOGIN OTP
export const verifyLoginOtp = async (req, res) => {
  console.log("api hit Verify Login OTP Called...");
  try {
    const { identifier, otp } = req.body;
    console.log("Verifying OTP for:", identifier, "OTP:", otp);

    const resVerify = await verifyOtpService(identifier, otp);
    
    console.log("OTP verification response:", resVerify);
    
    if (!resVerify.verified) {
      return res.status(400).json({ error: "Invalid OTP" });
    }

    console.log("OTP verified for:.......", identifier);
    
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    const token = generateToken(user._id);
    console.log("token generated:", token);
    setAuthCookie(res, token);

    res.status(200).json({ success: true, message: "Login successful", data:user });
  } catch (err) {
    res.status(400).json({ error: err.message }); 
  }
};


// 6️⃣ FORGET PASSWORD
export const forgetPassword = async (req, res) => {
  console.log("api hit Forget Password Called...");
  try {
    const { identifier } = req.body;
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    }); 
    if (!user) return res.status(404).json({ message: "User not found" });

    await sendOtpService(identifier);
    res.status(200).json({ success: true, message: "OTP sent for password reset" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 7️⃣ RESET PASSWORD (The actual update)
export const resetPassword = async (req, res) => {
  console.log("api hit Reset Password Called...");
  try {
    const { identifier, otp, newPassword, confirmPassword } = req.body;

    // 1. Basic Validation
    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    // 2. Verify OTP (Using your existing service)
    // This will throw an error if OTP is wrong or expired
    await verifyOtpService(identifier, otp);

    // 3. Find User
    const user = await User.findOne({
      $or: [{ email: identifier }, { mobile: identifier }]
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    // 4. Hash and Update Password
    const hashed = await hashPassword(newPassword);
    user.password = hashed;
    await user.save();

    res.status(200).json({ 
      success: true, 
      message: "Password updated successfully. You can now login." 
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// 8️⃣ GET PROFILE
export const getProfile = async (req, res) => {
  console.log("api hit Get Profile Called...");
  try {
    const user = req.user; // Set by protect middleware
    res.status(200).json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};

// 9️⃣ LOGOUT - Clear the cookie
export const logout = async (req, res) => {
  console.log("api hit Logout Called...");  
  try {
    res.clearCookie("token");
    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
};
