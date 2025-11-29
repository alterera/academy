"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import Script from "next/script";

interface CheckoutPaymentProps {
  courseId: string;
  courseTitle: string;
  totalAmount: number;
  razorpayKey: string;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export function CheckoutPayment({
  courseId,
  courseTitle,
  totalAmount,
  razorpayKey,
}: CheckoutPaymentProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  const handlePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create order
      const orderResponse = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId,
          amount: totalAmount,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.ok) {
        throw new Error(orderData.message || "Failed to create order");
      }

      // Initialize Razorpay checkout
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Training Portal",
        description: `Purchase: ${courseTitle}`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch("/api/payment/verify", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: courseId,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (!verifyResponse.ok || !verifyData.ok) {
              throw new Error(verifyData.message || "Payment verification failed");
            }

            // Redirect to dashboard on success
            window.location.href = "/dashboard";
          } catch (err) {
            console.error("Payment verification error:", err);
            setError(err instanceof Error ? err.message : "Payment verification failed");
            setIsLoading(false);
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        theme: {
          color: "#00E785",
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response: any) {
        setError("Payment failed. Please try again.");
        setIsLoading(false);
      });

      razorpay.open();
    } catch (err) {
      console.error("Payment error:", err);
      setError(err instanceof Error ? err.message : "Failed to initiate payment");
      setIsLoading(false);
    }
  };

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setRazorpayLoaded(true)}
        onError={() => setError("Failed to load Razorpay. Please refresh the page.")}
      />

      {error && (
        <div className="mb-4 flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Desktop CTA */}
      <div className="hidden sm:block">
        <Button
          onClick={handlePayment}
          disabled={isLoading || !razorpayLoaded}
          className="ml-4 bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
      </div>

      {/* Mobile CTA (full width) */}
      <div className="block sm:hidden mt-4">
        <Button
          onClick={handlePayment}
          disabled={isLoading || !razorpayLoaded}
          className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Proceed to Checkout"
          )}
        </Button>
      </div>
    </>
  );
}

