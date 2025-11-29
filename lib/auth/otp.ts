/**
 * OTP generation and hashing utilities
 * Uses bcrypt for secure OTP storage
 */

import bcrypt from "bcrypt";
import { randomInt } from "crypto";

const BCRYPT_ROUNDS = 10;

/**
 * Generate a cryptographically secure 6-digit OTP
 * Uses crypto.randomInt for secure random number generation
 */
export function generateOTP(): string {
  // Generate random number between 100000 and 999999
  const otp = randomInt(100000, 1000000);
  return otp.toString();
}

/**
 * Hash OTP using bcrypt
 * @param otp - Plain text OTP
 * @returns bcrypt hash
 */
export async function hashOTP(otp: string): Promise<string> {
  return bcrypt.hash(otp, BCRYPT_ROUNDS);
}

/**
 * Verify OTP against hash
 * @param otp - Plain text OTP to verify
 * @param hash - bcrypt hash to compare against
 * @returns true if OTP matches
 */
export async function verifyOTP(otp: string, hash: string): Promise<boolean> {
  return bcrypt.compare(otp, hash);
}

/**
 * Hash password for user storage
 * @param password - Plain text password
 * @returns bcrypt hash
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

/**
 * Verify password against hash
 * @param password - Plain text password to verify
 * @param hash - bcrypt hash to compare against
 * @returns true if password matches
 */
export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

