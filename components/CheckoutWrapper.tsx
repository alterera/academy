"use client";

import { useEffect } from "react";
import { useCheckoutStore } from "@/lib/store/checkout-store";

/**
 * Client component wrapper that clears checkout store when component unmounts
 * This ensures that if user leaves checkout page without payment, the cart is cleared
 */
export function CheckoutWrapper({ children }: { children: React.ReactNode }) {
  const clearCheckout = useCheckoutStore((state) => state.clearCheckout);

  useEffect(() => {
    // Clear checkout when component unmounts (user leaves the checkout page)
    return () => {
      clearCheckout();
    };
  }, [clearCheckout]);

  // Also clear checkout store when page is about to unload (browser back/forward, navigation)
  useEffect(() => {
    const handleBeforeUnload = () => {
      clearCheckout();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [clearCheckout]);

  return <>{children}</>;
}

