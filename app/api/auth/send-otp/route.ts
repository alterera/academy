/**
 * POST /api/auth/send-otp
 * Send OTP for login flow
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import connectDB from "@/lib/db";
import { OtpRequest } from "@/lib/models";
import { sendOTPSchema } from "@/lib/auth/validation";
import { normalizePhone, maskPhone } from "@/lib/auth/phone";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendOTPViaWhatsApp } from "@/lib/auth/whatsapp";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = sendOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.errors[0].message),
        { status: 400 }
      );
    }

    // Normalize phone to E.164 format
    const e164Phone = normalizePhone(validation.data.phone);
    if (!e164Phone) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_PHONE, "Invalid phone number format"),
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Generate OTP and request ID
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const requestId = uuidv4();
    const now = new Date();
    const expiresAt = addMinutes(now, 5); // 5 minute TTL
    const nextAllowedResendAt = addMinutes(now, 1); // 60 second cooldown

    // Create OTP request
    await OtpRequest.create({
      requestId,
      phone: e164Phone,
      otpHash,
      expiresAt,
      used: false,
      attempts: 0,
      lastSentAt: now,
      channel: "whatsapp",
    });

    // Send OTP via WhatsApp
    const sendResult = await sendOTPViaWhatsApp(e164Phone, otp);

    if (!sendResult.success) {
      // Still return request ID for retry
      return NextResponse.json(
        {
          requestId,
          nextAllowedResendAt: nextAllowedResendAt.toISOString(),
          warning: "OTP may not have been delivered. You can resend.",
        },
        { status: 200 }
      );
    }

    return NextResponse.json({
      requestId,
      nextAllowedResendAt: nextAllowedResendAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to process request"),
      { status: 500 }
    );
  }
}

