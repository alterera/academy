/**
 * GET /api/instructor/stats
 * Get instructor dashboard statistics
 */

import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/db";
import { Course, User, Payment } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    // Check instructor authentication
    const session = await getSession();
    if (!session.isInstructor || !session.instructorId) {
      return NextResponse.json(
        createError(ErrorCodes.NOT_AUTHENTICATED, "Unauthorized"),
        { status: 401 }
      );
    }

    await connectDB();

    // Get instructor's courses
    // Convert string instructorId to ObjectId for query
    const instructorObjectId = new mongoose.Types.ObjectId(session.instructorId);
    const instructorCourses = await Course.find({ instructorId: instructorObjectId });
    const totalCourses = instructorCourses.length;

    // Get total enrollments for instructor's courses
    const courseIds = instructorCourses.map((course) => course._id);
    const users = await User.find({
      enrolledCourses: { $in: courseIds },
    });
    
    let totalEnrollments = 0;
    users.forEach((user) => {
      if (user.enrolledCourses) {
        const enrolledInInstructorCourses = user.enrolledCourses.filter((courseId) =>
          courseIds.some((id) => id.toString() === courseId.toString())
        );
        totalEnrollments += enrolledInInstructorCourses.length;
      }
    });

    // Calculate total revenue from instructor's courses
    const payments = await Payment.find({
      courseId: { $in: courseIds },
      status: "captured",
    });

    let totalRevenue = 0;
    payments.forEach((payment) => {
      // Amount is in paise, convert to rupees
      totalRevenue += payment.amount / 100;
    });

    // Get total users in the application
    const totalUsers = await User.countDocuments();

    // Format revenue with Indian numbering
    const formatRevenue = (amount: number): string => {
      return new Intl.NumberFormat("en-IN", {
        maximumFractionDigits: 0,
      }).format(amount);
    };

    return NextResponse.json({
      ok: true,
      stats: {
        totalCourses,
        totalEnrollments,
        totalRevenue: `₹${formatRevenue(totalRevenue)}`,
        totalUsers,
      },
    });
  } catch (error) {
    console.error("Get instructor stats error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch stats"),
      { status: 500 }
    );
  }
}

