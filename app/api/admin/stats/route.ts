/**
 * GET /api/admin/stats
 * Get admin dashboard statistics
 */

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import { Course, User } from "@/lib/models";
import { requireAdminAPI } from "@/lib/auth/protection";
import { ErrorCodes, createError } from "@/lib/auth/errors";

export async function GET() {
  try {
    // Check admin authentication
    const authCheck = await requireAdminAPI();
    if (authCheck.response) return authCheck.response;

    await connectDB();

    // Get total courses count
    const totalCourses = await Course.countDocuments();

    // Get total users count
    const totalUsers = await User.countDocuments();

    // Get total enrollments (sum of all enrolledCourses arrays)
    const users = await User.find({ enrolledCourses: { $exists: true, $ne: [] } });
    const totalEnrollments = users.reduce((sum, user) => {
      return sum + (user.enrolledCourses?.length || 0);
    }, 0);

    // Calculate total revenue from enrolled courses
    // Get all users with enrolled courses and populate course details
    const usersWithEnrollments = await User.find({
      enrolledCourses: { $exists: true, $ne: [] },
    }).populate({
      path: "enrolledCourses",
      select: "price",
    });

    let totalRevenue = 0;
    usersWithEnrollments.forEach((user) => {
      if (user.enrolledCourses && Array.isArray(user.enrolledCourses)) {
        user.enrolledCourses.forEach((course: any) => {
          if (course && course.price) {
            // Remove ₹ and commas, convert to number
            const numericPrice = parseFloat(
              course.price.toString().replace(/[₹,]/g, "").trim()
            ) || 0;
            totalRevenue += numericPrice;
          }
        });
      }
    });

    // Calculate platform fee and GST for each enrollment
    const PLATFORM_FEE = 20;
    // const GST_RATE = 0.18; // 18%
    
    // For each enrollment, add platform fee and GST
    const revenueWithFees = totalEnrollments * PLATFORM_FEE;
    // const gstOnRevenue = totalRevenue * GST_RATE;
    // const gstOnFees = revenueWithFees * GST_RATE;
    
    const totalRevenueWithFees = totalRevenue + revenueWithFees;

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
        totalUsers,
        totalEnrollments,
        totalRevenue: formatRevenue(totalRevenueWithFees),
      },
    });
  } catch (error) {
    console.error("Get admin stats error:", error);
    return NextResponse.json(
      createError(ErrorCodes.SERVER_ERROR, "Failed to fetch stats"),
      { status: 500 }
    );
  }
}

