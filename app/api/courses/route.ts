/**
 * GET /api/courses - Get all published courses (public)
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    await connectDB();

    const courses = await Course.find({ isPublished: true })
      .select("title slug featuredImage price")
      .sort({ createdAt: -1 });

    return NextResponse.json({
      ok: true,
      courses: courses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        featuredImage: course.featuredImage || "/v-poster.png",
        price: course.price || "0",
      })),
    });
  } catch (error) {
    console.error("Get courses error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch courses"),
      { status: 500 }
    );
  }
}

