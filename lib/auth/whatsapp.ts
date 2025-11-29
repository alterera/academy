/**
 * WhatsApp OTP sending utility
 * Wrapper around the WhatsApp API using axios
 */

import axios from "axios";
import { maskPhone } from "./phone";

const WA_API_URL = process.env.WA_API_URL || "https://wa.alterera.net/send-message";
const WA_API_KEY = process.env.WA_API_KEY;
const WA_SENDER = process.env.WA_SENDER_NUMBER;

export interface SendOTPResult {
  success: boolean;
  message?: string;
  error?: string;
}

/**
 * Send OTP via WhatsApp API
 * @param phone - Phone number in E.164 format (will strip + prefix)
 * @param otp - 6-digit OTP code
 * @returns Success/failure status
 */
export async function sendOTPViaWhatsApp(
  phone: string,
  otp: string
): Promise<SendOTPResult> {
  if (!WA_API_KEY || !WA_SENDER) {
    return {
      success: false,
      error: "WhatsApp configuration missing",
    };
  }

  // Remove + prefix for API (E.164 includes +, but API may not expect it)
  const cleanPhone = phone.replace(/^\+/, "");

  // Format OTP message
  const message = `Your Alterera Academy verification code is: ${otp}\n\nThis code expires in 5 minutes. Do not share this code with anyone.`;
  const footer = "Alterera Academy";

  try {
    const response = await axios.get(WA_API_URL, {
      params: {
        api_key: WA_API_KEY,
        sender: WA_SENDER,
        number: cleanPhone,
        message: message,
        footer: footer,
      },
      timeout: 10000, // 10 second timeout
    });

    // Check response status
    if (response.status === 200) {
      return {
        success: true,
        message: "OTP sent successfully",
      };
    }

    return {
      success: false,
      error: "Unexpected response from WhatsApp API",
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {
        success: false,
        error: error.response?.data?.message || "Failed to send OTP",
      };
    }

    return {
      success: false,
      error: "Failed to send OTP",
    };
  }
}

