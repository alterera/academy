import CourseDetails from "@/components/CourseDetails";
import CourseOverview from "@/components/CourseOverview";
import CoursePrice from "@/components/CoursePrice";
import Curriculum from "@/components/Curriculum";
import Learning from "@/components/Learning";
import WhyUsGreen from "@/components/WhyUsGreen";
import connectDB from "@/lib/db";
import { Course } from "@/lib/models";

async function getCourse(slug: string) {
  try {
    await connectDB();
    const course = await Course.findOne({
      slug: slug,
      isPublished: true,
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

  return (
    <div className="w-full pt-10 md:pt-20">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-center px-4">
          {course.title}
        </h2>
        <p className="text-center text-sm md:text-base lg:text-lg nunito text-[#1d1d1d] pt-4 px-4">
          {course.shortDescription}
        </p>
      </div>
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
      <CourseDetails
        chapters={course.chapters}
        assessments={course.assessments}
        videos={course.videos}
        days={course.days}
      />
      <Learning learnings={course.learnings} />
      <CourseOverview overviewVideoUrl={course.overviewVideoUrl} />
      <Curriculum
        curriculum={course.curriculum}
        certificationEnabled={course.certificationEnabled}
      />
      <WhyUsGreen />
    </div>
  );
}
