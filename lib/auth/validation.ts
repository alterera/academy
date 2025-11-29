/**
 * Zod validation schemas for auth endpoints
 * Provides type-safe request body validation
 */

import { z } from "zod";

/**
 * Send OTP request validation (for login)
 */
export const sendOTPSchema = z.object({
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
});

/**
 * Signup request validation
 */
export const signupSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number is too long"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password is too long"),
});

/**
 * Verify OTP request validation
 */
export const verifyOTPSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});

/**
 * Resend OTP request validation
 */
export const resendOTPSchema = z.object({
  requestId: z.string().uuid("Invalid request ID"),
});

/**
 * Admin login request validation
 */
export const adminLoginSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(50, "Username is too long")
    .trim()
    .toLowerCase(),
  password: z
    .string()
    .min(1, "Password is required"),
});

// Export types
export type SendOTPInput = z.infer<typeof sendOTPSchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type VerifyOTPInput = z.infer<typeof verifyOTPSchema>;
export type ResendOTPInput = z.infer<typeof resendOTPSchema>;
export type AdminLoginInput = z.infer<typeof adminLoginSchema>;

