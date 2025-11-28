"use client";

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
import { Loader2 } from "lucide-react";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultTab?: "login" | "signup";
}

export function AuthModal({ open, onOpenChange, defaultTab = "login" }: AuthModalProps) {
  const [activeTab, setActiveTab] = React.useState<"login" | "signup">(defaultTab);
  const [loginPhone, setLoginPhone] = React.useState("");
  const [loginOTP, setLoginOTP] = React.useState("");
  const [signupData, setSignupData] = React.useState({
    name: "",
    phone: "",
    password: "",
  });
  const [signupOTP, setSignupOTP] = React.useState("");
  const [loginOtpSent, setLoginOtpSent] = React.useState(false);
  const [signupOtpSent, setSignupOtpSent] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  // Reset form when modal opens/closes and update tab when defaultTab changes
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    } else {
      // Reset all form data when modal closes
      setLoginPhone("");
      setLoginOTP("");
      setLoginOtpSent(false);
      setSignupData({
        name: "",
        phone: "",
        password: "",
      });
      setSignupOTP("");
      setSignupOtpSent(false);
      setIsLoading(false);
    }
  }, [open, defaultTab]);

  // Update active tab when defaultTab changes while modal is open
  React.useEffect(() => {
    if (open) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab, open]);

  const handleSendLoginOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone) {
      setIsLoading(true);
      // Here you would typically send OTP to the phone number
      console.log("Sending OTP to:", loginPhone);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setLoginOtpSent(true);
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loginPhone && loginOTP.length === 6) {
      setIsLoading(true);
      // Here you would typically verify OTP and login
      console.log("Logging in with phone:", loginPhone, "OTP:", loginOTP);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleSendSignupOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.name && signupData.phone && signupData.password) {
      setIsLoading(true);
      // Here you would typically send signup data and OTP
      console.log("Signing up with:", signupData);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSignupOtpSent(true);
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (signupData.name && signupData.phone && signupData.password && signupOTP.length === 6) {
      setIsLoading(true);
      // Here you would typically verify OTP and complete signup
      console.log("Completing signup with OTP:", signupOTP);
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsLoading(false);
      onOpenChange(false);
    }
  };

  const handleSignupChange = (field: string, value: string) => {
    setSignupData((prev) => ({ ...prev, [field]: value }));
  };

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
                ? "Sign in to continue to your account"
                : "Create your account to get started"}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="p-6 sm:p-8">
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as "login" | "signup")}
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
            <TabsContent value="login" className="space-y-6 mt-0">
              <form
                onSubmit={loginOtpSent ? handleLogin : handleSendLoginOTP}
                className="space-y-5"
              >
                {!loginOtpSent ? (
                  <>
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

                    <Button
                      type="submit"
                      disabled={isLoading || !loginPhone}
                      className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11 text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send OTP"
                      )}
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="login-otp" className="text-sm font-medium">
                          Enter Verification Code
                        </Label>
                        <div className="flex justify-center">
                          <InputOTP
                            maxLength={6}
                            value={loginOTP}
                            onChange={(value) => setLoginOTP(value)}
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
                        <p className="text-xs text-muted-foreground text-center mt-2">
                          We sent a 6-digit code to <span className="font-medium">{loginPhone}</span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setLoginOtpSent(false);
                          setLoginOTP("");
                        }}
                        className="text-xs text-[#00E785] hover:text-[#00d675] hover:underline w-full text-center font-medium"
                        disabled={isLoading}
                      >
                        Change phone number
                      </button>
                    </div>

                    <Button
                      type="submit"
                      disabled={isLoading || loginOTP.length !== 6}
                      className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11 text-base"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Verifying...
                        </>
                      ) : (
                        "Verify & Login"
                      )}
                    </Button>
                  </>
                )}
              </form>
            </TabsContent>

            {/* Signup Tab */}
            <TabsContent value="signup" className="space-y-6 mt-0">
              {!signupOtpSent ? (
                <form onSubmit={handleSendSignupOTP} className="space-y-5">
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
                      Must be at least 6 characters long
                    </p>
                  </div>

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
              ) : (
                <form onSubmit={handleSignup} className="space-y-5">
                  <div className="text-center space-y-2 mb-4">
                    <h3 className="text-lg font-semibold">Verify Your Phone</h3>
                    <p className="text-sm text-muted-foreground">
                      We've sent a verification code to <span className="font-medium">{signupData.phone}</span>
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="signup-otp" className="text-sm font-medium">
                        Enter Verification Code
                      </Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={signupOTP}
                          onChange={(value) => setSignupOTP(value)}
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
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setSignupOtpSent(false);
                        setSignupOTP("");
                      }}
                      className="text-xs text-[#00E785] hover:text-[#00d675] hover:underline w-full text-center font-medium"
                      disabled={isLoading}
                    >
                      Change phone number
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={isLoading || signupOTP.length !== 6}
                    className="w-full bg-[#00E785] hover:bg-[#00d675] text-black font-semibold h-11 text-base"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Verifying...
                      </>
                    ) : (
                      "Verify & Complete Signup"
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
