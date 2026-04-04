import rateLimit from "express-rate-limit";

// Limit to 5 requests per 15 minutes per IP
export const loginRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5,
  message: {
    message: "Terlalu banyak percobaan login. Silakan coba lagi setelah 15 menit.",
  },
  standardHeaders: true, 
  legacyHeaders: false, 
});
