/**
 * GET /api/instructor/profile - Get instructor profile
 * PUT /api/instructor/profile - Update instructor profile
 */

import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import connectDB from "@/lib/db";
import { Instructor } from "@/lib/models";
import { requireInstructorAPI } from "@/lib/auth/protection";
import { ErrorCodes, createError } from "@/lib/auth/errors";

const updateProfileSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name is too long").trim(),
  about: z.string().max(1000, "About is too long").trim().optional(),
  image: z.string().url("Invalid image URL").optional().or(z.literal("")),
  socialLinks: z.object({
    linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
    twitter: z.string().url("Invalid Twitter URL").optional().or(z.literal("")),
    github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
    website: z.string().url("Invalid website URL").optional().or(z.literal("")),
  }).optional(),
});

export async function GET() {
  try {
    const authCheck = await requireInstructorAPI();
    if (authCheck.response) return authCheck.response;
    const { session } = authCheck;

    await connectDB();

    const instructor = await Instructor.findById(session.instructorId).select(
      "name email about image socialLinks"
    );

    if (!instructor) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Instructor not found"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      profile: {
        name: instructor.name,
        email: instructor.email,
        about: instructor.about || "",
        image: instructor.image || "",
        socialLinks: instructor.socialLinks || {},
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
    const authCheck = await requireInstructorAPI();
    if (authCheck.response) return authCheck.response;
    const { session } = authCheck;

    const body = await request.json();
    const validation = updateProfileSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        createError(ErrorCodes.INVALID_INPUT, validation.error.issues[0].message),
        { status: 400 }
      );
    }

    await connectDB();

    const updateData: any = {
      name: validation.data.name,
    };

    if (validation.data.about !== undefined) {
      updateData.about = validation.data.about || undefined;
    }

    if (validation.data.image !== undefined) {
      updateData.image = validation.data.image || undefined;
    }

    if (validation.data.socialLinks) {
      updateData.socialLinks = {};
      if (validation.data.socialLinks.linkedin) {
        updateData.socialLinks.linkedin = validation.data.socialLinks.linkedin;
      }
      if (validation.data.socialLinks.twitter) {
        updateData.socialLinks.twitter = validation.data.socialLinks.twitter;
      }
      if (validation.data.socialLinks.github) {
        updateData.socialLinks.github = validation.data.socialLinks.github;
      }
      if (validation.data.socialLinks.website) {
        updateData.socialLinks.website = validation.data.socialLinks.website;
      }
    }

    const instructor = await Instructor.findByIdAndUpdate(
      session.instructorId,
      updateData,
      { new: true, runValidators: true }
    ).select("name email about image socialLinks");

    if (!instructor) {
      return NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Instructor not found"),
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Profile updated successfully",
      profile: {
        name: instructor.name,
        email: instructor.email,
        about: instructor.about || "",
        image: instructor.image || "",
        socialLinks: instructor.socialLinks || {},
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

