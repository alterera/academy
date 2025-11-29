/**
 * POST /api/auth/signup
 * Register new user and send OTP for verification
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { addMinutes } from "date-fns";
import connectDB from "@/lib/db";
import { OtpRequest, User } from "@/lib/models";
import { signupSchema } from "@/lib/auth/validation";
import { normalizePhone, maskPhone } from "@/lib/auth/phone";
import { generateOTP, hashOTP, hashPassword } from "@/lib/auth/otp";
import { sendOTPViaWhatsApp } from "@/lib/auth/whatsapp";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = signupSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { name, phone, password } = validation.data;

    // Normalize phone to E.164 format
    const e164Phone = normalizePhone(phone);
    if (!e164Phone) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_PHONE, "Invalid phone number format"),
        { status: 400 }
      );
    }

    // Connect to database
    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ phone: e164Phone });
    if (existingUser) {
      return NextResponse.json(
        createError(ErrorCodes.USER_EXISTS, "An account with this phone number already exists. Please login."),
        { status: 400 }
      );
    }

    // Generate OTP and hashes
    const otp = generateOTP();
    const otpHash = await hashOTP(otp);
    const passwordHash = await hashPassword(password);
    const requestId = uuidv4();
    const now = new Date();
    const expiresAt = addMinutes(now, 5); // 5 minute TTL
    const nextAllowedResendAt = addMinutes(now, 1); // 60 second cooldown

    // Create OTP request with signup data
    await OtpRequest.create({
      requestId,
      phone: e164Phone,
      otpHash,
      expiresAt,
      used: false,
      attempts: 0,
      lastSentAt: now,
      channel: "whatsapp",
      signupData: {
        name: name.trim(),
        password: passwordHash,
      },
    });

    // Send OTP via WhatsApp
    const sendResult = await sendOTPViaWhatsApp(e164Phone, otp);

    if (!sendResult.success) {
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
    const errorMessage = error instanceof Error ? error.message : "Failed to process request";
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, errorMessage),
      { status: 500 }
    );
  }
}

