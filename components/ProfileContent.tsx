"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

interface ProfileData {
  name: string;
  phone: string;
}

interface Payment {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseImage: string;
  amount: number; // Amount in paise
  currency: string;
  status: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  createdAt: string;
}

// Format price with Indian Rupee format
function formatPrice(amountInPaise: number, currency: string = "INR"): string {
  const amountInRupees = amountInPaise / 100;
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(amountInRupees);
  
  return `₹${formatted}`;
}

export default function ProfileContent() {
  const [profile, setProfile] = useState<ProfileData>({ name: "", phone: "" });
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nameValue, setNameValue] = useState("");

  // Fetch profile and payment data
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        
        // Fetch profile
        const profileRes = await fetch("/api/user/profile");
        if (profileRes.ok) {
          const profileData = await profileRes.json();
          if (profileData.ok) {
            setProfile(profileData.profile);
            setNameValue(profileData.profile.name);
          }
        }

        // Fetch payments
        const paymentsRes = await fetch("/api/user/payments");
        if (paymentsRes.ok) {
          const paymentsData = await paymentsRes.json();
          if (paymentsData.ok) {
            setPayments(paymentsData.payments);
          }
        }
      } catch (err) {
        console.error("Failed to fetch data:", err);
        setError("Failed to load profile data");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!nameValue.trim()) {
      setError("Name cannot be empty");
      return;
    }

    try {
      setUpdating(true);
      setError(null);
      setUpdateSuccess(false);

      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: nameValue.trim() }),
      });

      const data = await res.json();

      if (!res.ok || !data.ok) {
        throw new Error(data.message || "Failed to update name");
      }

      setProfile(data.profile);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name");
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Profile Information Section */}
      <div className="bg-white rounded-sm p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6">Profile Information</h2>

        <form onSubmit={handleUpdateName} className="space-y-6">
          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <div className="flex gap-3">
              <Input
                id="name"
                type="text"
                value={nameValue}
                onChange={(e) => setNameValue(e.target.value)}
                placeholder="Enter your name"
                className="flex-1"
                disabled={updating}
              />
              <Button
                type="submit"
                disabled={updating || nameValue.trim() === profile.name}
                className="bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
              >
                {updating ? "Updating..." : "Update"}
              </Button>
            </div>
            {updateSuccess && (
              <p className="text-sm text-green-600">Name updated successfully!</p>
            )}
            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}
          </div>

          {/* Phone Field */}
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={profile.phone}
              disabled
              className="bg-gray-50 cursor-not-allowed"
            />
            <p className="text-sm text-gray-600">
              To update your phone number, please{" "}
              <a
                href="#"
                className="text-[#00E785] hover:underline"
                onClick={(e) => {
                  e.preventDefault();
                  // You can add support ticket link here
                  alert("Please contact support to update your phone number.");
                }}
              >
                create a support ticket
              </a>
              .
            </p>
          </div>
        </form>
      </div>

      {/* Payment History Section */}
      <div className="bg-white  rounded-sm p-6 md:p-8">
        <h2 className="text-2xl font-semibold mb-6">Payment History</h2>

        {payments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No payment history found.</p>
            <Link href="/courses">
              <Button className="bg-[#00E785] hover:bg-[#00d675] text-black font-semibold">
                Browse Courses
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {payments.map((payment) => (
              <div
                key={payment.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Course Image */}
                  <div className="relative w-full md:w-32 h-32 flex-shrink-0 rounded-lg overflow-hidden">
                    <Image
                      src={payment.courseImage}
                      alt={payment.courseTitle}
                      fill
                      className="object-cover"
                    />
                  </div>

                  {/* Payment Details */}
                  <div className="flex-1 space-y-2">
                    <div>
                      <Link
                        href={`/courses/${payment.courseSlug}`}
                        className="text-lg font-semibold text-slate-900 hover:text-[#00E785] transition-colors"
                      >
                        {payment.courseTitle}
                      </Link>
                    </div>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium">Amount:</span>{" "}
                        <span className="text-slate-900 font-semibold">
                          {formatPrice(payment.amount, payment.currency)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{" "}
                        <span
                          className={`font-semibold ${
                            payment.status === "captured"
                              ? "text-green-600"
                              : payment.status === "authorized"
                              ? "text-blue-600"
                              : "text-gray-600"
                          }`}
                        >
                          {payment.status.charAt(0).toUpperCase() +
                            payment.status.slice(1)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium">Date:</span>{" "}
                        {format(new Date(payment.createdAt), "MMM dd, yyyy")}
                      </div>
                    </div>

                    <div className="text-xs text-gray-500 space-y-1">
                      <div>
                        <span className="font-medium">Order ID:</span>{" "}
                        {payment.razorpayOrderId}
                      </div>
                      <div>
                        <span className="font-medium">Payment ID:</span>{" "}
                        {payment.razorpayPaymentId}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


