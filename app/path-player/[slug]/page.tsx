import CoursePlayer from "@/components/CoursePlayer";
import { requireEnrollment } from "@/lib/auth/protection";

export default async function PathPlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Check authentication and enrollment - redirects if not enrolled
  await requireEnrollment(slug);

  return <CoursePlayer courseSlug={slug} />;
}

