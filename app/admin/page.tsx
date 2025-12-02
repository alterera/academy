import React from "react";
import { BookOpen, Users, BarChart3, TrendingUp } from "lucide-react";
import Link from "next/link";
import connectDB from "@/lib/db";
import { Course, User } from "@/lib/models";
import { requireAdmin } from "@/lib/auth/protection";

async function getAdminStats() {
  try {
    await connectDB();
    // requireAdmin already checks authentication

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

    return {
      totalCourses,
      totalUsers,
      totalEnrollments,
      totalRevenue: `₹${formatRevenue(totalRevenueWithFees)}`,
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    return null;
  }
}

const recentActivities = [
  {
    id: 1,
    action: "New user registered",
    user: "John Doe",
    time: "2 minutes ago",
  },
  {
    id: 2,
    action: "Course completed",
    user: "Jane Smith",
    time: "15 minutes ago",
  },
  {
    id: 3,
    action: "New enrollment",
    user: "Mike Johnson",
    time: "1 hour ago",
  },
  {
    id: 4,
    action: "Certificate issued",
    user: "Sarah Williams",
    time: "2 hours ago",
  },
];

export default async function AdminDashboard() {
  // Check admin authentication - redirects if not authenticated
  await requireAdmin();
  
  const stats = await getAdminStats();

  // Provide default values if stats is null
  const defaultStats = {
    totalCourses: 0,
    totalUsers: 0,
    totalEnrollments: 0,
    totalRevenue: "₹0",
  };

  const statsData = [
    {
      title: "Total Revenue",
      value: stats?.totalRevenue || defaultStats.totalRevenue,
      icon: TrendingUp,
      color: "bg-orange-500",
      href: "/admin/enrollments",
    },
    {
      title: "Total Courses",
      value: (stats?.totalCourses ?? defaultStats.totalCourses).toString(),
      icon: BookOpen,
      color: "bg-blue-500",
      href: "/admin/courses",
    },
    {
      title: "Active Enrollments",
      value: (stats?.totalEnrollments ?? defaultStats.totalEnrollments).toLocaleString("en-IN"),
      icon: BarChart3,
      color: "bg-purple-500",
      href: "/admin/enrollments",
    },
    {
      title: "Total Users",
      value: (stats?.totalUsers ?? defaultStats.totalUsers).toLocaleString("en-IN"),
      icon: Users,
      color: "bg-green-500",
      href: "/admin/users",
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome to Alterera Academy Admin Panel
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
              className="bg-card border rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div
                  className={`${stat.color} p-3 rounded-lg text-white`}
                >
                  <Icon className="h-6 w-6" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div className="flex-1">
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">
                    {activity.user}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/admin/courses/new"
              className="block w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold px-4 py-3 rounded-lg text-center transition-colors"
            >
              Create New Course
            </Link>
            <Link
              href="/admin/users"
              className="block w-full border-2 border-border hover:bg-accent px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              Manage Users
            </Link>
            <Link
              href="/admin/analytics"
              className="block w-full border-2 border-border hover:bg-accent px-4 py-3 rounded-lg text-center font-medium transition-colors"
            >
              View Analytics
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}