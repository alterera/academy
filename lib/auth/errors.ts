/**
 * Typed error codes for consistent API responses
 */

export const ErrorCodes = {
  INVALID_INPUT: "INVALID_INPUT",
  INVALID_PHONE: "INVALID_PHONE",
  OTP_EXPIRED: "OTP_EXPIRED",
  OTP_INVALID: "OTP_INVALID",
  TOO_MANY_ATTEMPTS: "TOO_MANY_ATTEMPTS",
  SEND_FAILED: "SEND_FAILED",
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
  RESEND_TOO_SOON: "RESEND_TOO_SOON",
  USER_EXISTS: "USER_EXISTS",
  SERVER_ERROR: "SERVER_ERROR",
  // Admin errors
  ADMIN_NOT_FOUND: "ADMIN_NOT_FOUND",
  ADMIN_INVALID_CREDENTIALS: "ADMIN_INVALID_CREDENTIALS",
  ADMIN_INACTIVE: "ADMIN_INACTIVE",
  // Instructor errors
  INSTRUCTOR_NOT_FOUND: "INSTRUCTOR_NOT_FOUND",
  INSTRUCTOR_INVALID_CREDENTIALS: "INSTRUCTOR_INVALID_CREDENTIALS",
  INSTRUCTOR_INACTIVE: "INSTRUCTOR_INACTIVE",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export interface APIError {
  error: ErrorCode;
  message: string;
}

export interface APISuccess<T = unknown> {
  ok: true;
  data?: T;
}

/**
 * Create an error response object
 */
export function createError(code: ErrorCode, message: string): APIError {
  return { error: code, message };
}

/**
 * Create a success response object
 */
export function createSuccess<T>(data?: T): APISuccess<T> {
  return { ok: true, data };
}

