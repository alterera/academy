"use client";

/**
 * Admin Auth Context for client-side admin authentication state
 * Provides admin info and auth methods to admin components
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

interface AdminUser {
  id: string;
  username: string;
  name?: string;
  email?: string;
}

interface AdminAuthContextType {
  admin: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  refreshSession: () => Promise<void>;
  logout: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType>({
  admin: null,
  isLoading: true,
  isAuthenticated: false,
  refreshSession: async () => {},
  logout: async () => {},
});

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/admin/session");
      if (response.ok) {
        const data = await response.json();
        if (data.ok && data.user) {
          setAdmin(data.user);
        } else {
          setAdmin(null);
        }
      } else {
        setAdmin(null);
      }
    } catch (error) {
      setAdmin(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      setAdmin(null);
      // Hard refresh and navigate to login page
      window.location.href = "/admin/login";
    } catch (error) {
      // Silent fail, but still refresh
      window.location.href = "/admin/login";
    }
  }, []);

  // Check session on mount
  useEffect(() => {
    refreshSession();
  }, [refreshSession]);

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        isLoading,
        isAuthenticated: !!admin,
        refreshSession,
        logout,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}

export default AdminAuthContext;

