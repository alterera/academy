/**
 * Route protection utilities
 * Helper functions for checking authentication and authorization
 */

import { redirect } from "next/navigation";
import { getSession } from "./session";
import connectDB from "@/lib/db";
import { User, Course } from "@/lib/models";
import { ErrorCodes, createError } from "./errors";
import { NextResponse } from "next/server";

/**
 * Check if user is authenticated (for pages)
 * Redirects to home if not authenticated
 */
export async function requireAuth() {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    redirect("/");
  }
  return session;
}

/**
 * Check if user is authenticated (for API routes)
 * Returns error response if not authenticated
 */
export async function requireAuthAPI(): Promise<
  | { session: any; response: null }
  | { session: null; response: NextResponse }
> {
  const session = await getSession();
  if (!session.isLoggedIn || !session.userId) {
    return {
      session: null,
      response: NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}

/**
 * Check if admin is authenticated (for pages)
 * Redirects to admin login if not authenticated
 */
export async function requireAdmin() {
  const session = await getSession();
  if (!session.isAdmin || !session.adminId) {
    redirect("/admin/login");
  }
  return session;
}

/**
 * Check if instructor is authenticated (for pages)
 * Redirects to instructor login if not authenticated
 */
export async function requireInstructor() {
  const session = await getSession();
  if (!session.isInstructor || !session.instructorId) {
    redirect("/instructor/login");
  }
  return session;
}

/**
 * Check if admin is authenticated (for API routes)
 * Returns error response if not authenticated
 */
export async function requireAdminAPI(): Promise<
  | { session: any; response: null }
  | { session: null; response: NextResponse }
> {
  const session = await getSession();
  if (!session.isAdmin || !session.adminId) {
    return {
      session: null,
      response: NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Unauthorized"),
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}

/**
 * Check if instructor is authenticated (for API routes)
 * Returns error response if not authenticated
 */
export async function requireInstructorAPI(): Promise<
  | { session: any; response: null }
  | { session: null; response: NextResponse }
> {
  const session = await getSession();
  if (!session.isInstructor || !session.instructorId) {
    return {
      session: null,
      response: NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Unauthorized"),
        { status: 401 }
      ),
    };
  }
  return { session, response: null };
}

/**
 * Check if user is enrolled in a course (for pages)
 * Redirects to course page if not enrolled
 */
export async function requireEnrollment(courseSlug: string) {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    redirect(`/courses/${courseSlug}`);
  }

  await connectDB();
  
  const course = await Course.findOne({ slug: courseSlug, isPublished: true });
  if (!course) {
    redirect("/courses");
  }

  const user = await User.findById(session.userId);
  if (!user) {
    redirect(`/courses/${courseSlug}`);
  }

  const isEnrolled = user.enrolledCourses?.some(
    (enrolledCourseId) => enrolledCourseId.toString() === course._id.toString()
  );

  if (!isEnrolled) {
    redirect(`/courses/${courseSlug}`);
  }

  return { session, course, user };
}

/**
 * Check if user is enrolled in a course (for API routes)
 * Returns error response if not enrolled
 */
export async function requireEnrollmentAPI(
  courseSlug: string
): Promise<
  | { session: any; course: any; user: any; response: null }
  | { session: null; course: null; user: null; response: NextResponse }
> {
  const session = await getSession();
  
  if (!session.isLoggedIn || !session.userId) {
    return {
      session: null,
      course: null,
      user: null,
      response: NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Not authenticated"),
        { status: 401 }
      ),
    };
  }

  await connectDB();
  
  const course = await Course.findOne({ slug: courseSlug, isPublished: true });
  if (!course) {
    return {
      session: null,
      course: null,
      user: null,
      response: NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "Course not found"),
        { status: 404 }
      ),
    };
  }

  const user = await User.findById(session.userId);
  if (!user) {
    return {
      session: null,
      course: null,
      user: null,
      response: NextResponse.json(
        createError(ErrorCodes.REQUEST_NOT_FOUND, "User not found"),
        { status: 404 }
      ),
    };
  }

  const isEnrolled = user.enrolledCourses?.some(
    (enrolledCourseId) => enrolledCourseId.toString() === course._id.toString()
  );

  if (!isEnrolled) {
    return {
      session: null,
      course: null,
      user: null,
      response: NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "You are not enrolled in this course"),
        { status: 403 }
      ),
    };
  }

  return { session, course, user, response: null };
}

