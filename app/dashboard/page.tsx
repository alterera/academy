import DashboardInfo from "@/components/DashboardInfo";
import EnrolledCourses from "@/components/EnrolledCourses";
import { redirect } from "next/navigation";
import { isAuthenticated, getSession } from "@/lib/auth/session";
import connectDB from "@/lib/db";
import { User } from "@/lib/models";

async function getDashboardData() {
  try {
    await connectDB();
    const session = await getSession();
    
    if (!session.isLoggedIn || !session.userId) {
      return null;
    }

    const user = await User.findById(session.userId).populate({
      path: "enrolledCourses",
      select: "title slug featuredImage shortDescription certificationEnabled",
    });

    if (!user) {
      return null;
    }

    const enrolledCourses = (user.enrolledCourses || []) as any[];
    const courseCount = enrolledCourses.length;
    const certificateCount = enrolledCourses.filter(
      (course) => course.certificationEnabled
    ).length;

    return {
      userName: user.name || "User",
      courseCount,
      certificateCount,
      enrolledCourses: enrolledCourses.map((course) => ({
        id: course._id.toString(),
        title: course.title,
        slug: course.slug,
        featuredImage: course.featuredImage || "/v-poster.png",
        shortDescription: course.shortDescription,
      })),
    };
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return null;
  }
}

export default async function DashboardPage() {
  // Check authentication
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  const dashboardData = await getDashboardData();

  if (!dashboardData) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Failed to load dashboard data</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="w-full bg-[#1d1d1d]">
        <DashboardInfo
          userName={dashboardData.userName}
          courseCount={dashboardData.courseCount}
          certificateCount={dashboardData.certificateCount}
        />
      </div>

      <div className="w-full bg-[#FFF6DA]">
        <EnrolledCourses courses={dashboardData.enrolledCourses} />
      </div>
    </div>
  );
}
