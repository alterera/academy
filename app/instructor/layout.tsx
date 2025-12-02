"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { InstructorAuthProvider, useInstructorAuth } from "@/lib/auth/instructor-context";
import Link from "next/link";
import { BookOpen, User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

function InstructorLayoutContent({ children }: { children: React.ReactNode }) {
  const { instructor, isAuthenticated, isLoading, logout } = useInstructorAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/instructor/login";

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isLoginPage) {
      router.push("/instructor/login");
    }
    // If authenticated and on login page, redirect to dashboard
    if (!isLoading && isAuthenticated && isLoginPage) {
      router.push("/instructor");
    }
  }, [isAuthenticated, isLoading, router, pathname, isLoginPage]);

  // Allow login page to render without authentication
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated (handled by useEffect, but show message while redirecting)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 w-64 bg-white border-r shadow-sm">
        <div className="flex flex-col h-full">
          {/* Logo/Header */}
          <div className="p-6 border-b">
            <h1 className="text-xl font-bold text-gray-900">Instructor Portal</h1>
            <p className="text-sm text-gray-600 mt-1">{instructor?.name || "Instructor"}</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link
              href="/instructor"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === "/instructor"
                  ? "bg-[#00E785] text-black font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              Dashboard
            </Link>
            <Link
              href="/instructor/courses"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname?.startsWith("/instructor/courses")
                  ? "bg-[#00E785] text-black font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <BookOpen className="h-5 w-5" />
              My Courses
            </Link>
            <Link
              href="/instructor/profile"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${
                pathname === "/instructor/profile"
                  ? "bg-[#00E785] text-black font-medium"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              <User className="h-5 w-5" />
              Profile
            </Link>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              onClick={logout}
              variant="outline"
              className="w-full justify-start"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="ml-64">
        <div className="p-6 md:p-8 lg:p-10">
          {children}
        </div>
      </div>
    </div>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <InstructorAuthProvider>
      <InstructorLayoutContent>{children}</InstructorLayoutContent>
    </InstructorAuthProvider>
  );
}

