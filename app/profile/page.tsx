import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth/session";
import ProfileContent from "@/components/ProfileContent";

export default async function ProfilePage() {
  // Check authentication
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect("/");
  }

  return (
    <div className="w-full min-h-screen bg-[#FFF6DA]">
      <div className="max-w-4xl mx-auto py-8 md:py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Profile</h1>
        <ProfileContent />
      </div>
    </div>
  );
}


