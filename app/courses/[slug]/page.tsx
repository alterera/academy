import CourseDetails from "@/components/CourseDetails";
import CourseOverview from "@/components/CourseOverview";
import CoursePrice from "@/components/CoursePrice";
import Curriculum from "@/components/Curriculum";
import Learning from "@/components/Learning";
import WhyUsGreen from "@/components/WhyUsGreen";
import connectDB from "@/lib/db";
import { Course, User, Instructor } from "@/lib/models";
import { getSession } from "@/lib/auth/session";
import Image from "next/image";
import InstructorComponent from "@/components/Instructor";

async function getCourse(slug: string) {
  try {
    await connectDB();
    const course = await Course.findOne({
      slug: slug,
      isPublished: true,
    }).populate({
      path: "instructorId",
      select: "name about image socialLinks",
    });

    if (!course) {
      return null;
    }

    return {
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
      priceTitle: course.priceTitle,
      price: course.price,
      priceDescription: course.priceDescription,
      priceSubDescription: course.priceSubDescription,
      priceFeatures: course.priceFeatures,
      priceButtonText: course.priceButtonText,
      priceFooterText: course.priceFooterText,
      instructor: course.instructorId
        ? {
            name: (course.instructorId as any).name,
            about: (course.instructorId as any).about,
            image: (course.instructorId as any).image,
            socialLinks: (course.instructorId as any).socialLinks || {},
          }
        : null,
    };
  } catch (error) {
    console.error("Failed to fetch course:", error);
    return null;
  }
}

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);

  if (!course) {
    return (
      <div className="w-full pt-10 md:pt-20">
        <div className="max-w-6xl mx-auto text-center py-20">
          <h1 className="text-2xl font-bold mb-4">Course Not Found</h1>
          <p className="text-gray-600">
            The course you're looking for doesn't exist or hasn't been published yet.
          </p>
        </div>
      </div>
    );
  }

  // Check if user is enrolled in this course
  let isEnrolled = false;
  try {
    const session = await getSession();
    if (session.isLoggedIn && session.userId) {
      await connectDB();
      const user = await User.findById(session.userId);
      if (user && user.enrolledCourses && user.enrolledCourses.length > 0) {
        // Compare course IDs (both as strings for comparison)
        isEnrolled = user.enrolledCourses.some(
          (enrolledCourseId) => enrolledCourseId.toString() === course.id
        );
      }
    }
  } catch (error) {
    // If error checking enrollment, assume not enrolled (show price)
    console.error("Error checking enrollment:", error);
  }

  return (
    <div className="w-full pt-10 md:pt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center px-4 relative">
          {course.title}
          <Image src={'/shapes/green-3.svg'} height={40} width={40} alt="green 3 line" className="hidden md:block absolute -top-2 left-15"/>
        </h2>
        <p className="text-center text-sm md:text-base lg:text-lg nunito text-[#1d1d1d] pt-4 px-4">
          {course.shortDescription}
        </p>
      </div>
      {!isEnrolled && (
        <CoursePrice
          priceTitle={course.priceTitle}
          price={course.price}
          priceDescription={course.priceDescription}
          priceSubDescription={course.priceSubDescription}
          priceFeatures={course.priceFeatures}
          priceButtonText={course.priceButtonText}
          courseSlug={course.slug}
          priceFooterText={course.priceFooterText}
        />
      )}
      <CourseDetails
        chapters={course.chapters}
        assessments={course.assessments}
        videos={course.videos}
        days={course.days}
        isEnrolled={isEnrolled}
        courseSlug={course.slug}
      />
      <Learning learnings={course.learnings} />
      <CourseOverview overviewVideoUrl={course.overviewVideoUrl} />
      <Curriculum
        curriculum={course.curriculum}
        certificationEnabled={course.certificationEnabled}
      />
      {course.instructor && (
        <InstructorComponent
          name={course.instructor.name}
          about={course.instructor.about}
          image={course.instructor.image}
          socialLinks={course.instructor.socialLinks}
        />
      )}
      <WhyUsGreen />
    </div>
  );
}
