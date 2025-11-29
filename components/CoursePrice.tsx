"use client";

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth/context";
import { AuthModal } from "@/components/AuthModal";

interface CoursePriceProps {
  priceTitle?: string;
  price?: string;
  priceDescription?: string;
  priceSubDescription?: string;
  priceFeatures?: string[];
  priceButtonText?: string;
  courseSlug?: string; // Course slug for checkout link
  priceFooterText?: string;
}

const CoursePrice: React.FC<CoursePriceProps> = ({
  priceTitle = "Zero subscription, pay-as-you-go plan",
  price = "₹1,499",
  priceDescription = "For Businesses who ONLY want to send bulk campaigns",
  priceSubDescription = "Cheapest plan if you send up to ~2,100 messages in 3 months.",
  priceFeatures = [],
  priceButtonText = "Buy Now",
  courseSlug = "",
  priceFooterText = "One time fee, no recurring subscription",
}) => {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, refreshSession } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [shouldRedirectAfterLogin, setShouldRedirectAfterLogin] = useState(false);

  // Generate checkout link based on course slug
  const checkoutLink = courseSlug ? `/checkout/${courseSlug}` : "/checkout";

  // Handle redirect after successful login (only if user clicked Buy Now first)
  useEffect(() => {
    if (isAuthenticated && !showAuthModal && shouldRedirectAfterLogin && courseSlug) {
      // User just logged in after clicking Buy Now, redirect to checkout
      setShouldRedirectAfterLogin(false); // Reset flag
      router.push(checkoutLink);
    }
  }, [isAuthenticated, showAuthModal, shouldRedirectAfterLogin, courseSlug, checkoutLink, router]);

  // Handle buy button click
  const handleBuyClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // If auth is still loading, wait
    if (authLoading) return;
    
    // If not authenticated, show login modal and set flag to redirect after login
    if (!isAuthenticated) {
      setShouldRedirectAfterLogin(true);
      setShowAuthModal(true);
      return;
    }
    
    // If authenticated, navigate to checkout
    router.push(checkoutLink);
  };
  
  // Format price with ₹ prefix and comma separator for Indian Rupee
  const formatPrice = (priceValue: string): string => {
    if (!priceValue) return "";
    
    // Remove any existing ₹ symbol and commas
    const numericValue = priceValue.replace(/[₹,]/g, "").trim();
    
    // Check if it's a valid number
    const numValue = parseFloat(numericValue);
    if (isNaN(numValue)) {
      // If not a number, return as is (might already be formatted)
      return priceValue.startsWith("₹") ? priceValue : `₹${priceValue}`;
    }
    
    // Format with Indian number system (lakhs, crores)
    const formatted = new Intl.NumberFormat("en-IN", {
      maximumFractionDigits: 0,
    }).format(numValue);
    
    return `₹${formatted}`;
  };

  const formattedPrice = formatPrice(price);
  
  if (!priceTitle && !price) {
    return null;
  }

  return (
    <div className="w-full bg-transparent py-6 md:py-10">
      <div className="max-w-6xl mx-auto px-4">
        <div className="bg-[#cafde8] rounded-xl p-4 md:p-6 lg:p-10 border border-[#00e785] border-r-2 md:border-r-4 border-r-[#00e785] border-b-2 md:border-b-4 border-b-[#00e785]">
          {/* Header: Title and Price */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-4 md:mb-6">
            {priceTitle && (
              <h2 className="text-lg md:text-xl font-semibold flex-1">
                {priceTitle}
              </h2>
            )}
            {price && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold shrink-0">
                {formattedPrice}
              </h2>
            )}
          </div>

          {/* Content Section */}
          <div className="mt-4 md:mt-6">
            <div className="flex flex-col lg:flex-row lg:justify-between gap-6">
              <div className="flex-1">
                {priceDescription && (
                  <h4 className="text-base md:text-lg font-semibold mb-2">
                    {priceDescription}
                  </h4>
                )}
                {priceSubDescription && (
                  <p className="text-sm md:text-base text-gray-700 mb-4">
                    {priceSubDescription}
                  </p>
                )}

                {priceFeatures && priceFeatures.length > 0 && (
                  <ul className="list-disc pl-4 md:pl-6 space-y-2 text-sm md:text-base mb-4 md:mb-6">
                    {priceFeatures.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                )}

                {priceButtonText && (
                  <>
                    <button
                      onClick={handleBuyClick}
                      disabled={authLoading}
                      className="relative inline-flex items-center justify-center h-fit w-full sm:w-auto sm:min-w-[200px] md:min-w-[280px] mt-4 md:mt-5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {/* Blue shadow background */}
                      <span className="absolute inset-0 translate-x-1  translate-y-1 bg-[#4fc3ff] rounded-[10px] z-0" />

                      {/* Button surface */}
                      <span className="relative z-10 inline-block px-4 py-2 text-xs md:text-[13px] text-center font-semibold border-2 w-full sm:w-auto sm:min-w-[200px] md:min-w-[280px] border-black rounded-[10px] bg-transparent">
                        {priceButtonText}
                      </span>
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
                  </>
                )}
              </div>

              {/* Footer Text - Right side on desktop, bottom on mobile */}
              {priceFooterText && (
                <div className="lg:flex lg:items-end lg:justify-end shrink-0">
                  <p className="text-sm md:text-base text-gray-700 lg:text-right">
                    {priceFooterText}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursePrice;
