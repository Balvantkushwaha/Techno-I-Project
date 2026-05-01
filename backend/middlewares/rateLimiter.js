import rateLimit, { ipKeyGenerator } from "express-rate-limit";

// 🔥 Global limiter (sabhi APIs ke liye)
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // per IP
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many requests, please try again later",
      data: null,
      error: "TooManyRequests",
    });
  },
});

// 🔐 Auth / Login limiter (strict)
export const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 min
  max: 20,
  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts, try later",
      data: null,
      error: "TooManyRequests",
    });
  },
});

// 📱 OTP limiter (very strict)
export const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 min
  max: 20,
  keyGenerator: (req) => {
    const ip = ipKeyGenerator(req); // ✅ safe IP   
    const identifier = req.body.identifier || "";
    return `${ip}-${identifier}`;
  },
  handler: (req, res) => {
    console.log("OTP request limit exceeded for IP:", req.ip);
    return res.status(429).json({
      success: false,
      message: "Too many OTP requests, wait 5 minutes",
      data: null,
      error: "TooManyRequests",
    });
  },
});
