import React from "react";
import { BookOpen, Users, TrendingUp, BarChart3 } from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db";
import { Course, User, Payment } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import { requireInstructor } from "@/lib/auth/protection";

async function getInstructorStats() {
  try {
    await connectDB();
    const session = await getSession();
    
    if (!session.isInstructor || !session.instructorId) {
      return null;
    }

    // Get instructor's courses
    const instructorCourses = await Course.find({ instructorId: session.instructorId });
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

    return {
      totalCourses,
      totalEnrollments,
      totalRevenue: `₹${formatRevenue(totalRevenue)}`,
      totalUsers,
    };
  } catch (error) {
    console.error("Failed to fetch instructor stats:", error);
    return null;
  }
}

export default async function InstructorDashboard() {
  // Check instructor authentication - redirects if not authenticated
  await requireInstructor();
  
  const stats = await getInstructorStats();

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  const statsData = [
    {
      title: "Total Courses",
      value: stats.totalCourses.toString(),
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/instructor/courses",
    },
    {
      title: "Total Enrollments",
      value: stats.totalEnrollments.toLocaleString("en-IN"),
      icon: BarChart3,
      color: "bg-purple-500",
      href: "/instructor/courses",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: TrendingUp,
      color: "bg-orange-500",
      href: "/instructor/courses",
    },
    {
      title: "Total Users",
      value: stats.totalUsers.toLocaleString("en-IN"),
      icon: Users,
      color: "bg-green-500",
      href: "#",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to your Instructor Portal
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsData.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="bg-white border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg text-white`}>
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="bg-white border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="space-y-3">
          <Link
            href="/instructor/courses/new"
            className="block w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold px-4 py-3 rounded-lg text-center transition-colors"
          >
            Create New Course
          </Link>
          <Link
            href="/instructor/profile"
            className="block w-full border-2 border-gray-300 hover:bg-gray-50 px-4 py-3 rounded-lg text-center font-medium transition-colors"
          >
            Update Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

