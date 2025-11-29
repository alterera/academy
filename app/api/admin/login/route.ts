/**
 * POST /api/admin/login
 * Admin login with username and password
 */

import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import connectDB from "@/lib/db";
import { Admin } from "@/lib/models";
import { adminLoginSchema } from "@/lib/auth/validation";
import { verifyPassword } from "@/lib/auth/otp";
import { saveSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input with zod
    const validation = adminLoginSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    const { username, password } = validation.data;

    // Connect to database
    await connectDB();

    // Find admin by username
    const admin = await Admin.findOne({ username: username.toLowerCase() });
    if (!admin) {
      return NextResponse.json(
        createError(ErrorCodes.ADMIN_NOT_FOUND, "Invalid username or password"),
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        createError(ErrorCodes.ADMIN_INACTIVE, "Admin account is inactive"),
        { status: 403 }
      );
    }

    // Verify password
    const isValidPassword = await verifyPassword(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json(
        createError(ErrorCodes.ADMIN_INVALID_CREDENTIALS, "Invalid username or password"),
        { status: 401 }
      );
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Create admin session
    const sessionId = uuidv4();
    await saveSession({
      adminId: admin._id.toString(),
      username: admin.username,
      name: admin.name,
      isAdmin: true,
      isLoggedIn: true,
      sessionId,
    });

    return NextResponse.json({
      ok: true,
      user: {
        id: admin._id.toString(),
        username: admin.username,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to login"),
      { status: 500 }
    );
  }
}

