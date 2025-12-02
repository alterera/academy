"use client";

import { useState } from "react";
import { X, Award, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CertificateRequestProps {
  courseId: string;
  courseTitle: string;
  onClose: () => void;
}

export default function CertificateRequest({
  courseId,
  courseTitle,
  onClose,
}: CertificateRequestProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // TODO: Implement API call to request certificate
      // For now, just simulate a request
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {submitted ? (
          <div className="text-center py-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Award className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Request Submitted!</h3>
            <p className="text-gray-600 mb-6">
              Your certificate request has been submitted successfully. We will review
              your course completion and issue your certificate soon.
            </p>
            <Button
              onClick={onClose}
              className="bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
            >
              Close
            </Button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#00E785]/20 rounded-full flex items-center justify-center">
                <Award className="h-6 w-6 text-[#00E785]" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Request Certificate</h3>
                <p className="text-sm text-gray-600">Course: {courseTitle}</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> To receive your certificate, you must have
                  completed all lessons in this course. Our team will review your
                  progress and issue the certificate accordingly.
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-[#00E785] hover:bg-[#00d675] text-black font-semibold"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Submit Request
                    </>
                  )}
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

