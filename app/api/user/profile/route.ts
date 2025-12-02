/**
 * GET /api/user/profile - Get user profile data
 * PUT /api/user/profile - Update user profile (name only)
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { User } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
});

export async function GET() {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      );
    }

    await connectDB();

    const user = await User.findById(session.userId).select("name phone");

    if (!user) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "User not found"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile: {
        name: user.name || "",
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch profile"),
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getSession();

    if (!session.isLoggedIn || !session.userId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findByIdAndUpdate(
      session.userId,
      { name: validation.data.name },
      { new: true, runValidators: true }
    ).select("name phone");

    if (!user) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "User not found"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Profile updated successfully",
      profile: {
        name: user.name || "",
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to update profile"),
      { status: 500 }
    );
  }
}


