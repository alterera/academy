/**
 * POST /api/instructor/login
 * Instructor login with email and password
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { Instructor } from "@/lib/models";
import { instructorLoginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/otp";
import { saveSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = instructorLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    // Connect to database
    await connectDB();

    // Find instructor by email
    const instructor = await Instructor.findOne({ email: email.toLowerCase() });
    if (!instructor) {
      return NextResponse.json(
        createError(ErrorCodes.INSTRUCTOR_NOT_FOUND, "Invalid email or password"),
        { status: 401 }
      );
    }

    // Check if instructor is active
    if (!instructor.isActive) {
      return NextResponse.json(
        createError(ErrorCodes.INSTRUCTOR_INACTIVE, "Instructor account is inactive"),
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, instructor.password);
    if (!isValidPassword) {
      return NextResponse.json(
        createError(ErrorCodes.INSTRUCTOR_INVALID_CREDENTIALS, "Invalid email or password"),
        { status: 401 }
      );
    }

    // Update last login
    instructor.lastLogin = new Date();
    await instructor.save();

    // Create instructor session
    const sessionId = uuidv4();
    await saveSession({
      instructorId: instructor._id.toString(),
      instructorEmail: instructor.email,
      name: instructor.name,
      isInstructor: true,
      isLoggedIn: true,
      sessionId,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: instructor._id.toString(),
        email: instructor.email,
        name: instructor.name,
      },
    });
  } catch (error) {
    console.error("Instructor login error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to login"),
      { status: 500 }
    );
  }
}

