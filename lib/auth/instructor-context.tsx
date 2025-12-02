"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

interface InstructorUser {
  id: string;
  email: string;
  name: string;
  about?: string;
  image?: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
    website?: string;
  };
}

interface InstructorAuthContextType {
  instructor: InstructorUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const InstructorAuthContext = createContext<InstructorAuthContextType>({
  instructor: null,
  isLoading: true,
  isAuthenticated: false,
  refreshSession: async () => {},
  logout: async () => {},
});

export function InstructorAuthProvider({ children }: { children: React.ReactNode }) {
  const [instructor, setInstructor] = useState<InstructorUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/instructor/session");
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.user) {
          setInstructor(data.user);
        } else {
          setInstructor(null);
        }
      } else {
        setInstructor(null);
      }
    } catch (error) {
      setInstructor(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/instructor/logout", { method: "POST" });
      setInstructor(null);
      // Hard refresh and navigate to login page
      window.location.href = "/instructor/login";
    } catch (error) {
      // Silent fail, but still refresh
      window.location.href = "/instructor/login";
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <InstructorAuthContext.Provider
      value={{
        instructor,
        isLoading,
        isAuthenticated: !!instructor,
        refreshSession,
        logout,
      }}
    >
      {children}
    </InstructorAuthContext.Provider>
  );
}

export function useInstructorAuth() {
  return useContext(InstructorAuthContext);
}

