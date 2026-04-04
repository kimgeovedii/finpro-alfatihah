import dotenv from "dotenv";
dotenv.config();

// Validate required secrets at startup
if (!process.env.JWT_SECRET) {
  throw new Error("FATAL: JWT_SECRET is not set in environment variables.");
}
if (!process.env.REFRESH_TOKEN_SECRET) {
  throw new Error("FATAL: REFRESH_TOKEN_SECRET is not set in environment variables.");
}

export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL || "";
export const JWT_SECRET = process.env.JWT_SECRET;
export const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

// other config values like mailer, etc. can be added here

export { Mailer } from "./mailer";
