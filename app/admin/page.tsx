import React from "react";
import { LayoutDashboard, BookOpen, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

const stats = [
  {
    title: "Total Courses",
    value: "12",
    icon: BookOpen,
    color: "bg-blue-500",
    href: "/admin/courses",
  },
  {
    title: "Total Users",
    value: "1,234",
    icon: Users,
    color: "bg-green-500",
    href: "/admin/users",
  },
  {
    title: "Active Enrollments",
    value: "856",
    icon: BarChart3,
    color: "bg-purple-500",
    href: "/admin/enrollments",
  },
  {
    title: "Completion Rate",
    value: "68%",
    icon: LayoutDashboard,
    color: "bg-orange-500",
    href: "/admin/analytics",
  },
];

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

export default function AdminDashboard() {
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
        {stats.map((stat) => {
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