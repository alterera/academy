/**
 * GET /api/instructor/session
 * Get current instructor session
 */

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import connectDB from "@/lib/db";
import { Instructor } from "@/lib/models";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    const session = await getSession();

    // Check if instructor session exists
    if (!session.isInstructor || !session.instructorId) {
      return NextResponse.json({
        ok: false,
        user: null,
      });
    }

    // Connect to database and verify instructor still exists and is active
    await connectDB();
    const instructor = await Instructor.findById(session.instructorId);

    if (!instructor || !instructor.isActive) {
      return NextResponse.json({
        ok: false,
        user: null,
      });
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: instructor._id.toString(),
        email: instructor.email,
        name: instructor.name,
        about: instructor.about,
        image: instructor.image,
        socialLinks: instructor.socialLinks,
      },
    });
  } catch (error) {
    console.error("Instructor session error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to get session"),
      { status: 500 }
    );
  }
}

