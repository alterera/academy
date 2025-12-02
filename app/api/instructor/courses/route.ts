/**
 * GET /api/instructor/courses - Get all courses for the instructor
 * POST /api/instructor/courses - Create a new course
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";
import { requireInstructorAPI } from "@/lib/auth/protection";
import { ErrorCodes, createError } from "@/lib/auth/errors";

const courseSchema = z.object({
  title: z.string().min(1, "Title is required"),
  slug: z.string().min(1, "Slug is required").toLowerCase(),
  shortDescription: z.string().min(1, "Short description is required"),
  featuredImage: z.string().url("Invalid image URL").optional().or(z.literal("")),
  chapters: z.number().min(0),
  assessments: z.number().min(0),
  videos: z.number().min(0),
  days: z.number().min(0),
  learnings: z.array(z.string()).min(1, "At least one learning point is required"),
  overviewVideoUrl: z.string().url("Invalid video URL"),
  curriculum: z.array(
    z.object({
      title: z.string().min(1, "Chapter title is required"),
      isPro: z.boolean(),
      lessons: z.array(
        z.object({
          name: z.string().min(1, "Lesson name is required"),
          videoUrl: z.string().url("Invalid video URL").optional().or(z.literal("")),
        })
      ),
    })
  ),
  certificationEnabled: z.boolean().default(true),
  isPublished: z.boolean().default(false),
  priceTitle: z.string().optional(),
  price: z.string().optional(),
  priceDescription: z.string().optional(),
  priceSubDescription: z.string().optional(),
  priceFeatures: z.array(z.string()).optional(),
  priceButtonText: z.string().optional(),
  priceFooterText: z.string().optional(),
}).refine(
  (data) => {
    // Allow empty featuredImage or valid URL
    if (data.featuredImage === "" || !data.featuredImage) {
      return true;
    }
    try {
      new URL(data.featuredImage);
      return true;
    } catch {
      return false;
    }
  },
  {
    message: "Invalid image URL",
    path: ["featuredImage"],
  }
);

export async function GET() {
  try {
    const authCheck = await requireInstructorAPI();
    if (authCheck.response) return authCheck.response;
    const { session } = authCheck;

    await connectDB();
    
    // Convert string instructorId to ObjectId for query
    const instructorObjectId = new mongoose.Types.ObjectId(session.instructorId);
    
    const courses = await Course.find({ instructorId: instructorObjectId }).sort({
      createdAt: -1,
    });

    return NextResponse.json({
      ok: true,
      courses: courses.map((course) => ({
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
        isPublished: course.isPublished,
        priceTitle: course.priceTitle,
        price: course.price,
        priceDescription: course.priceDescription,
        priceSubDescription: course.priceSubDescription,
        priceFeatures: course.priceFeatures,
        priceButtonText: course.priceButtonText,
        priceFooterText: course.priceFooterText,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
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

export async function POST(request: NextRequest) {
  try {
    const authCheck = await requireInstructorAPI();
    if (authCheck.response) return authCheck.response;
    const { session } = authCheck;

    // Verify instructorId exists in session
    if (!session.instructorId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Instructor ID not found in session"),
        { status: 401 }
      );
    }

    const body = await request.json();
    const validation = courseSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    await connectDB();

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug: validation.data.slug });
    if (existingCourse) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, "Course with this slug already exists"),
        { status: 400 }
      );
    }

    // Convert string instructorId to ObjectId - verify it's valid
    if (!session.instructorId || !mongoose.Types.ObjectId.isValid(session.instructorId)) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Invalid instructor ID in session"),
        { status: 401 }
      );
    }
    
    const instructorObjectId = new mongoose.Types.ObjectId(session.instructorId);
    
    // Remove featuredImage if it's empty string
    const cleanedData: any = { ...validation.data };
    if (!cleanedData.featuredImage || cleanedData.featuredImage === "") {
      delete cleanedData.featuredImage;
    }
    
    // Build course data - ensure instructorId is set
    const courseDataToSave: any = {
      ...cleanedData,
      instructorId: instructorObjectId, // Set instructorId in the data object
    };
    
    // Use new Course() constructor with instructorId included
    const course = new Course(courseDataToSave);
    
    // Explicitly mark instructorId as modified to ensure it's saved
    course.markModified('instructorId');
    
    // Save the course
    await course.save();
    
    // Verify instructorId was saved by fetching the course again
    const verifyCourse = await Course.findById(course._id);
    if (verifyCourse && !verifyCourse.instructorId) {
      // If still not saved, update directly in database
      await Course.updateOne(
        { _id: course._id },
        { $set: { instructorId: instructorObjectId } }
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
        isPublished: course.isPublished,
        priceTitle: course.priceTitle,
        price: course.price,
        priceDescription: course.priceDescription,
        priceSubDescription: course.priceSubDescription,
        priceFeatures: course.priceFeatures,
        priceButtonText: course.priceButtonText,
        priceFooterText: course.priceFooterText,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
      },
    });
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to create course"),
      { status: 500 }
    );
  }
}

