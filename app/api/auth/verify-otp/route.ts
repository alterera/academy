/**
 * POST /api/auth/verify-otp
 * Verify OTP and complete login/signup
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { isAfter } from "date-fns";
import connectDB from "@/lib/db";
import { OtpRequest, User } from "@/lib/models";
import { verifyOTPSchema } from "@/lib/auth/validation";
import { maskPhone } from "@/lib/auth/phone";
import { verifyOTP } from "@/lib/auth/otp";
import { saveSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

const MAX_ATTEMPTS = 3;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = verifyOTPSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { requestId, otp } = validation.data;

    // Connect to database
    await connectDB();

    // Find OTP request
    const otpRequest = await OtpRequest.findOne({ requestId });
    if (!otpRequest) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "OTP request not found or expired"),
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

    // Check if expired
    if (isAfter(new Date(), otpRequest.expiresAt)) {
      return NextResponse.json(
        createError(ErrorCodes.OTP_EXPIRED, "OTP has expired. Please request a new one."),
        { status: 400 }
      );
    }

    // Check attempts
    if (otpRequest.attempts >= MAX_ATTEMPTS) {
      return NextResponse.json(
        createError(ErrorCodes.TOO_MANY_ATTEMPTS, "Too many failed attempts. Please request a new OTP."),
        { status: 400 }
      );
    }

    // Verify OTP
    const isValidOTP = await verifyOTP(otp, otpRequest.otpHash);
    if (!isValidOTP) {
      // Increment attempts
      await OtpRequest.updateOne(
        { _id: otpRequest._id },
        { $inc: { attempts: 1 } }
      );

      const remainingAttempts = MAX_ATTEMPTS - otpRequest.attempts - 1;
      return NextResponse.json(
        createError(
          ErrorCodes.OTP_INVALID,
          `Invalid OTP. ${remainingAttempts > 0 ? `${remainingAttempts} attempts remaining.` : "Please request a new OTP."}`
        ),
        { status: 400 }
      );
    }

    // Mark OTP as used
    await OtpRequest.updateOne(
      { _id: otpRequest._id },
      { used: true }
    );

    // Upsert user
    const now = new Date();
    let user = await User.findOne({ phone: otpRequest.phone });

    if (!user) {
      // Create new user (signup flow)
      user = await User.create({
        phone: otpRequest.phone,
        name: otpRequest.signupData?.name || undefined,
        // Password is stored in signupData.password but we don't need it for session
        lastLogin: now,
      });
    } else {
      // Update existing user (login flow)
      user.lastLogin = now;
      await user.save();
    }

    // Create session
    const sessionId = uuidv4();
    await saveSession({
      userId: user._id.toString(),
      phone: user.phone,
      sessionId,
      name: user.name,
      isLoggedIn: true,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: user._id.toString(),
        phone: user.phone,
        name: user.name,
      },
    });
  } catch (error) {
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to verify OTP"),
      { status: 500 }
    );
  }
}

