"use client";

import Image from "next/image";
import React, { useState, useEffect } from "react";
import { Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/context";
import { AuthModal } from "@/components/AuthModal";

interface CourseDetailsProps {
  chapters: number;
  assessments: number;
  videos: number;
  days: number;
  isEnrolled: boolean;
  courseSlug: string;
}

const CourseDetails: React.FC<CourseDetailsProps> = ({
  chapters,
  assessments,
  videos,
  days,
  isEnrolled,
  courseSlug,
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, refreshSession } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shouldRedirectAfterLogin, setShouldRedirectAfterLogin] = useState(false);

  const checkoutLink = `/checkout/${courseSlug}`;
  const playerLink = `/path-player/${courseSlug}`;

  // Handle redirect after successful login (only if user clicked Start Now first)
  useEffect(() => {
    if (isAuthenticated && !showAuthModal && shouldRedirectAfterLogin && courseSlug) {
      // User just logged in after clicking Start Now, redirect to checkout
      setShouldRedirectAfterLogin(false); // Reset flag
      router.push(checkoutLink);
    }
  }, [isAuthenticated, showAuthModal, shouldRedirectAfterLogin, courseSlug, checkoutLink, router]);

  // Handle button click
  const handleStartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If enrolled, go to player
    if (isEnrolled) {
      router.push(playerLink);
      return;
    }
    
    // If auth is still loading, wait
    if (authLoading) return;
    
    // If not authenticated, show login modal and set flag to redirect after login
    if (!isAuthenticated) {
      setShouldRedirectAfterLogin(true);
      setShowAuthModal(true);
      return;
    }
    
    // If authenticated but not enrolled, navigate to checkout
    router.push(checkoutLink);
  };

  return (
    <div className="w-full py-5 px-4 md:px-0">
      <div className="flex flex-col md:flex-row justify-between gap-6 md:gap-4 my-6 md:mt-10 max-w-4xl mx-auto items-center">
        <button
          onClick={handleStartClick}
          disabled={authLoading}
          className="bg-[#00E785] hover:bg-[#00d675] transition-colors h-fit w-full md:w-80 px-6 md:px-8 py-2.5 md:py-2 rounded-full font-semibold text-sm md:text-base flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {!isEnrolled && <Lock className="h-4 w-4" />}
          Start Now!
        </button>
        <AuthModal
          open={showAuthModal}
          onOpenChange={async (open) => {
            setShowAuthModal(open);
            // Refresh session when modal closes to check if user logged in
            if (!open) {
              await refreshSession();
              // If user closed modal without logging in, reset redirect flag
              if (!isAuthenticated) {
                setShouldRedirectAfterLogin(false);
              }
            }
          }}
          defaultTab="login"
        />
        <div className="w-full md:w-auto">
          <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold">
            Course details
          </h2>

          <div className="grid grid-cols-2 grid-rows-2 gap-4 md:gap-6 lg:gap-8 mt-4 md:mt-5">
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/chapters.png"}
                  fill
                  alt="chapters"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{chapters} {chapters === 1 ? 'Chapter' : 'Chapters'}</p>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/assessments.svg"}
                  fill
                  alt="assessments"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{assessments} {assessments === 1 ? 'Assessment' : 'Assessments'}</p>
            </div>
            <div className="row-start-2 flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/videos.svg"}
                  fill
                  alt="videos"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{videos} {videos === 1 ? 'Video' : 'Videos'}</p>
            </div>
            <div className="row-start-2 flex items-center gap-2 md:gap-4">
              <div className="relative w-5 h-5 md:w-6 md:h-6 shrink-0">
                <Image
                  src={"/icons/clock.svg"}
                  fill
                  alt="course duration"
                  className="object-contain"
                />
              </div>
              <p className="text-sm md:text-base">{days} {days === 1 ? 'Day' : 'Days'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
