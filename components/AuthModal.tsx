"use client";

/**
 * Authentication Modal Component
 * Handles login and signup flows with OTP verification
 */

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth/context";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

type AuthStep = "form" | "otp" | "success";

interface FormError {
  message: string;
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const { refreshSession } = useAuth();
  const [activeTab, setActiveTab] = React.useState<"login" | "signup">(defaultTab);
  
  // Login state
  const [loginPhone, setLoginPhone] = React.useState("");
  const [loginOTP, setLoginOTP] = React.useState("");
  const [loginRequestId, setLoginRequestId] = React.useState("");
  const [loginStep, setLoginStep] = React.useState<AuthStep>("form");
  
  // Signup state
  const [signupData, setSignupData] = React.useState({
    name: "",
    phone: "",
    password: "",
  });
  const [signupOTP, setSignupOTP] = React.useState("");
  const [signupRequestId, setSignupRequestId] = React.useState("");
  const [signupStep, setSignupStep] = React.useState<AuthStep>("form");
  
  // Common state
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<FormError | null>(null);
  const [canResend, setCanResend] = React.useState(false);
  const [resendTimer, setResendTimer] = React.useState(0);

  // Reset form when modal opens/closes
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    } else {
      // Reset all state
      setLoginPhone("");
      setLoginOTP("");
      setLoginRequestId("");
      setLoginStep("form");
      setSignupData({ name: "", phone: "", password: "" });
      setSignupOTP("");
      setSignupRequestId("");
      setSignupStep("form");
      setIsLoading(false);
      setError(null);
      setCanResend(false);
      setResendTimer(0);
    }
  }, [open, defaultTab]);

  // Update tab when defaultTab changes
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, open]);

  // Resend timer
  React.useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0 && (loginStep === "otp" || signupStep === "otp")) {
      setCanResend(true);
    }
  }, [resendTimer, loginStep, signupStep]);

  // Start resend cooldown
  const startResendTimer = () => {
    setResendTimer(60);
    setCanResend(false);
  };

  // Login: Send OTP
  const handleLoginSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: loginPhone }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      setLoginRequestId(data.requestId);
      setLoginStep("otp");
      startResendTimer();
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Failed to send OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // Login: Verify OTP
  const handleLoginVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: loginRequestId, otp: loginOTP }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setLoginStep("success");
      await refreshSession();
      
      // Close modal after brief success message, then hard refresh and navigate to dashboard
      setTimeout(() => {
        onOpenChange(false);
        // Hard refresh and navigate to dashboard
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Failed to verify OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup: Send OTP
  const handleSignupSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const requestBody = {
        name: signupData.name.trim(),
        phone: signupData.phone.trim(),
        password: signupData.password,
      };

      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        throw new Error("Invalid server response");
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `Server error: ${response.status}`;
        throw new Error(errorMessage);
      }

      if (!data.requestId) {
        throw new Error("No request ID received from server");
      }
      setSignupRequestId(data.requestId);
      setSignupStep("otp");
      startResendTimer();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create account";
      setError({ message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  // Signup: Verify OTP
  const handleSignupVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: signupRequestId, otp: signupOTP }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to verify OTP");
      }

      setSignupStep("success");
      await refreshSession();
      
      // Close modal after brief success message, then hard refresh and navigate to dashboard
      setTimeout(() => {
        onOpenChange(false);
        // Hard refresh and navigate to dashboard
        window.location.href = "/dashboard";
      }, 1500);
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Failed to verify OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOTP = async (requestId: string) => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }

      startResendTimer();
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : "Failed to resend OTP" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

  // Success view
  const renderSuccess = (message: string) => (
    <div className="flex flex-col items-center justify-center py-8 space-y-4">
      <div className="rounded-full bg-[#00E785]/20 p-4">
        <CheckCircle2 className="h-12 w-12 text-[#00E785]" />
      </div>
      <h3 className="text-xl font-semibold text-center">{message}</h3>
      <p className="text-sm text-muted-foreground text-center">
        Redirecting...
      </p>
    </div>
  );

  // OTP input view
  const renderOTPInput = (
    otp: string,
    setOTP: (value: string) => void,
    phone: string,
    onSubmit: (e: React.FormEvent) => void,
    onBack: () => void,
    requestId: string
  ) => (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-lg font-semibold">Verify Your Phone</h3>
        <p className="text-sm text-muted-foreground">
          We sent a 6-digit code to <span className="font-medium">{phone}</span>
        </p>
      </div>

      <div className="flex justify-center">
        <InputOTP
          maxLength={6}
          value={otp}
          onChange={setOTP}
          disabled={isLoading}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error.message}</span>
        </div>
      )}

      <div className="flex flex-col gap-3">
        <Button
          type="submit"
          disabled={isLoading || otp.length !== 6}
          className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            "Verify"
          )}
        </Button>

        <div className="flex items-center justify-between text-sm">
          <button
            type="button"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground"
            disabled={isLoading}
          >
            ← Back
          </button>
          
          {canResend ? (
            <button
              type="button"
              onClick={() => handleResendOTP(requestId)}
              className="text-[#00E785] hover:text-[#00d675] font-medium"
              disabled={isLoading}
            >
              Resend Code
            </button>
          ) : resendTimer > 0 ? (
            <span className="text-muted-foreground">
              Resend in {resendTimer}s
            </span>
          ) : null}
        </div>
      </div>
    </form>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-[calc(100%-2rem)] sm:w-full p-0 gap-0 overflow-hidden">
        <div className="bg-gradient-to-br from-[#00E785]/10 to-[#00E785]/5 p-6 sm:p-8">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-center">
              {activeTab === "login" ? "Welcome Back" : "Get Started"}
            </DialogTitle>
            <DialogDescription className="text-center text-base">
              {activeTab === "login"
                ? "Sign in to continue learning"
                : "Create your account to start learning"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) => {
              setActiveTab(value as "login" | "signup");
              setError(null);
            }}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login" className="text-sm font-medium">
                Login
              </TabsTrigger>
              <TabsTrigger value="signup" className="text-sm font-medium">
                Sign Up
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login" className="mt-0 min-h-[280px]">
              {loginStep === "success" ? (
                renderSuccess("Login Successful!")
              ) : loginStep === "otp" ? (
                renderOTPInput(
                  loginOTP,
                  setLoginOTP,
                  loginPhone,
                  handleLoginVerify,
                  () => {
                    setLoginStep("form");
                    setLoginOTP("");
                    setError(null);
                  },
                  loginRequestId
                )
              ) : (
                <form onSubmit={handleLoginSendOTP} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="login-phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="login-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value)}
                      required
                      className="w-full h-11"
                      disabled={isLoading}
                    />
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isLoading || !loginPhone}
                    className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending OTP...
                      </>
                    ) : (
                      "Continue"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="mt-0 min-h-[280px]">
              {signupStep === "success" ? (
                renderSuccess("Account Created!")
              ) : signupStep === "otp" ? (
                renderOTPInput(
                  signupOTP,
                  setSignupOTP,
                  signupData.phone,
                  handleSignupVerify,
                  () => {
                    setSignupStep("form");
                    setSignupOTP("");
                    setError(null);
                  },
                  signupRequestId
                )
              ) : (
                <form onSubmit={handleSignupSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name" className="text-sm font-medium">
                      Full Name
                    </Label>
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your full name"
                      value={signupData.name}
                      onChange={(e) => handleSignupChange("name", e.target.value)}
                      required
                      className="w-full h-11"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-phone" className="text-sm font-medium">
                      Phone Number
                    </Label>
                    <Input
                      id="signup-phone"
                      type="tel"
                      placeholder="Enter your phone number"
                      value={signupData.phone}
                      onChange={(e) => handleSignupChange("phone", e.target.value)}
                      required
                      className="w-full h-11"
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-sm font-medium">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a secure password"
                      value={signupData.password}
                      onChange={(e) => handleSignupChange("password", e.target.value)}
                      required
                      className="w-full h-11"
                      disabled={isLoading}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      At least 6 characters
                    </p>
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-lg">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{error.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={
                      isLoading ||
                      !signupData.name ||
                      !signupData.phone ||
                      !signupData.password ||
                      signupData.password.length < 6
                    }
                    className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating Account...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
