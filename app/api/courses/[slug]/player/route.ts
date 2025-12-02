/**
 * GET /api/courses/[slug]/player - Get course curriculum for enrolled users
 */

import { NextRequest, NextResponse } from "next/server";
import { requireEnrollmentAPI } from "@/lib/auth/protection";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Check authentication and enrollment
    const authCheck = await requireEnrollmentAPI(slug);
    if (authCheck.response) return authCheck.response;
    const { course, user } = authCheck;

    return NextResponse.json({
      ok: true,
      course: {
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        curriculum: course.curriculum,
        certificationEnabled: course.certificationEnabled,
      },
    });
  } catch (error) {
    console.error("Get course player error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch course"),
      { status: 500 }
    );
  }
}

