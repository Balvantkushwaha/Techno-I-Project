import User from "./auth.model.js";
import OTP from "../../models/otp.model.js";
import { generateOtp } from "../../utils/otp.util.js";
import { hashPassword } from "../../utils/password.util.js";
import { generateToken } from "../../utils/token.util.js";

// STEP 1: Send OTP
export const sendOtpService = async (identifier) => {
  const otp = generateOtp();

  await OTP.deleteMany({ identifier });

  await OTP.create({
    identifier,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000) // 5 min
  });

  console.log("OTP:", otp); // SMS/Email integration here

  return { success: true,message:"OTP sent successfully", data:otp };
};

// STEP 2: Verify OTP
export const verifyOtpService = async (identifier, otp) => {
  const record = await OTP.findOne({ identifier, otp });

  if (!record) throw new Error("Invalid OTP");

  if (record.expiresAt < new Date())
    throw new Error("OTP expired");

  await OTP.deleteMany({ identifier });

  return { verified: true, message: "OTP verified" };
};

// STEP 3: Register User
export const registerUserService = async (data) => {
  // console.log("Register User Service Called with data:", data);
  const { identifier, firstName, lastName, password } = data;
  if(!identifier){
    throw new Error("Identifier (email or mobile) is required");  
  }

  const hashedPassword = await hashPassword(password);
  // console.log("Hashed Password:", hashedPassword);
  const user = await User.create({
    email: identifier.includes("@") ? identifier : undefined,
    mobile: !identifier.includes("@") ? identifier : undefined,
    firstName,
    lastName,
    password: hashedPassword,
    isVerified: true
  });
  // console.log("User created in DB:", user);

  const token = generateToken(user._id);

  return {success:true,message:"User registered successfully", data:{user, token} };
};

export const setAuthCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};