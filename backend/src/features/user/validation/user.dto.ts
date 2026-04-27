import { z } from "zod";
import { EmployeeRole } from "@prisma/client";

export const CreateAccountSchema = z.object({
  email: z.string().email("Invalid email format"),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  role: z.nativeEnum(EmployeeRole, {
    message: "Invalid employee role",
  }),
  branchId: z.string().uuid("Invalid branch ID"),
});

export const UpdateAccountSchema = z.object({
  email: z.string().email("Invalid email format").optional(),
  username: z.string().min(3, "Username must be at least 3 characters").optional(),
  fullName: z.string().min(3, "Full name must be at least 3 characters").optional(),
  role: z.nativeEnum(EmployeeRole).optional(),
  branchId: z.string().uuid("Invalid branch ID").optional(),
});

export type CreateAccountDto = z.infer<typeof CreateAccountSchema>;
export type UpdateAccountDto = z.infer<typeof UpdateAccountSchema>;

// Update basic profile
export const UpdateProfileSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
  fullName: z.string().min(3, { message: "Full name must be at least 3 characters" }).optional(),
});

export type UpdateProfileDto = z.infer<typeof UpdateProfileSchema>;

// Change Password
export const ChangePasswordSchema = z.object({
  oldPassword: z.string().min(1, "Old password is required"),
  newPassword: z.string().min(6, "New password must be at least 6 characters"),
  confirmPassword: z.string().min(6),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export type ChangePasswordDto = z.infer<typeof ChangePasswordSchema>;

// Change Email
export const ChangeEmailSchema = z.object({
  oldEmail: z.string().email("Invalid old email"),
  newEmail: z.string().email("Invalid new email"),
  password: z.string().min(1, "Password is required for verification"),
});

export type ChangeEmailDto = z.infer<typeof ChangeEmailSchema>;
