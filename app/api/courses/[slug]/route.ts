/**
 * GET /api/courses/[slug] - Get a published course by slug (public)
 */

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    await connectDB();

    const course = await Course.findOne({
      slug: slug,
      isPublished: true,
    });

    if (!course) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Course not found"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      course: {
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        shortDescription: course.shortDescription,
        featuredImage: course.featuredImage,
        chapters: course.chapters,
        assessments: course.assessments,
        videos: course.videos,
        days: course.days,
        learnings: course.learnings,
        overviewVideoUrl: course.overviewVideoUrl,
        curriculum: course.curriculum,
        certificationEnabled: course.certificationEnabled,
        priceTitle: course.priceTitle,
        price: course.price,
        priceDescription: course.priceDescription,
        priceSubDescription: course.priceSubDescription,
        priceFeatures: course.priceFeatures,
        priceButtonText: course.priceButtonText,
        priceFooterText: course.priceFooterText,
      },
    });
  } catch (error) {
    console.error("Get course by slug error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch course"),
      { status: 500 }
    );
  }
}

