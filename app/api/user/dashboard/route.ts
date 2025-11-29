/**
 * GET /api/user/dashboard
 * Get user dashboard data including enrolled courses, course count, and certificate count
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { User, Course } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

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

    // Get user with enrolled courses populated
    const user = await User.findById(session.userId).populate({
      path: "enrolledCourses",
      select: "title slug featuredImage shortDescription",
    });

    if (!user) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "User not found"),
        { status: 404 }
      );
    }

    const enrolledCourses = user.enrolledCourses || [];
    const courseCount = enrolledCourses.length;

    // Certificate count will be 0 for now - completion logic will be added later
    const certificateCount = 0;

    return NextResponse.json({
      ok: true,
      user: {
        name: user.name || "User",
        courseCount,
        certificateCount,
      },
      enrolledCourses: enrolledCourses.map((course: any) => ({
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        featuredImage: course.featuredImage || "/v-poster.png",
        shortDescription: course.shortDescription,
      })),
    });
  } catch (error) {
    console.error("Get dashboard error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch dashboard data"),
      { status: 500 }
    );
  }
}

