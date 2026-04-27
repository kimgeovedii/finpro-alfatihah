import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  rememberMe: z.boolean().optional().default(false),
  deviceId: z.string().optional(),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// Registration is email-only at first
export const RegisterSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  referralCode: z.string().optional(),
});

export type RegisterDto = z.infer<typeof RegisterSchema>;

// Combined Verification + Password Setup
export const VerifySetPasswordSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type VerifySetPasswordDto = z.infer<typeof VerifySetPasswordSchema>;

// Reset Password: email only
export const ResetPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

export type ResetPasswordDto = z.infer<typeof ResetPasswordSchema>;

// Confirm Reset Password
export const ConfirmResetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ConfirmResetPasswordDto = z.infer<typeof ConfirmResetPasswordSchema>;

// Google OAuth login/register
export const GoogleLoginSchema = z.object({
  credential: z.string().min(1, "Credential is required"),
  deviceId: z.string().optional(),
});

export type GoogleLoginDto = z.infer<typeof GoogleLoginSchema>;
