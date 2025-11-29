/**
 * POST /api/auth/resend-otp
 * Resend OTP with cooldown enforcement
 */

import { NextRequest, NextResponse } from "next/server";
import { addMinutes, isAfter, differenceInSeconds } from "date-fns";
import connectDB from "@/lib/db";
import { OtpRequest } from "@/lib/models";
import { resendOTPSchema } from "@/lib/auth/validation";
import { maskPhone } from "@/lib/auth/phone";
import { generateOTP, hashOTP } from "@/lib/auth/otp";
import { sendOTPViaWhatsApp } from "@/lib/auth/whatsapp";
import { ErrorCodes, createError } from "@/lib/auth/errors";

const RESEND_COOLDOWN_SECONDS = 60;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = resendOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { requestId } = validation.data;

    // Connect to database
    await connectDB();

    // Find OTP request
    const otpRequest = await OtpRequest.findOne({ requestId });
    if (!otpRequest) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "OTP request not found"),
        { status: 400 }
      );
    }

    // Check if already used
    if (otpRequest.used) {
      return NextResponse.json(
        createError(ErrorCodes.OTP_EXPIRED, "OTP has already been used"),
        { status: 400 }
      );
    }

    // Check resend cooldown
    const now = new Date();
    if (otpRequest.lastSentAt) {
      const cooldownEnd = new Date(otpRequest.lastSentAt.getTime() + RESEND_COOLDOWN_SECONDS * 1000);
      if (isAfter(cooldownEnd, now)) {
        const remainingSeconds = differenceInSeconds(cooldownEnd, now);
        return NextResponse.json(
          createError(
            ErrorCodes.RESEND_TOO_SOON,
            `Please wait ${remainingSeconds} seconds before requesting a new OTP`
          ),
          { status: 429 }
        );
      }
    }

    // Generate new OTP and update request
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const expiresAt = addMinutes(now, 5);
    const nextAllowedResendAt = addMinutes(now, 1);

    await OtpRequest.updateOne(
      { _id: otpRequest._id },
      {
        otpHash,
        expiresAt,
        lastSentAt: now,
        attempts: 0, // Reset attempts on resend
      }
    );

    // Send OTP via WhatsApp
    const sendResult = await sendOTPViaWhatsApp(otpRequest.phone, otp);

    if (!sendResult.success) {
      return NextResponse.json(
        createError(ErrorCodes.SEND_FAILED, "Failed to send OTP. Please try again."),
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      nextAllowedResendAt: nextAllowedResendAt.toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to resend OTP"),
      { status: 500 }
    );
  }
}

