"use client";

import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { saveSessionToStorage, getSessionFromStorage, clearSessionStorage } from "@/lib/auth-client";

export type UserRole = "admin" | "director" | "curator" | "student" | "parent";

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  schoolId?: string;
  schoolName?: string;
  studentClass?: string;
  studentCode?: string;
  subscriptionPlan?: string;
  aiRequestsUsed?: number;
  careerResult?: object | null;
  badges?: object[];
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (role: UserRole, data: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  register: (role: string, data: Record<string, string>) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  getSchoolName: () => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const refreshAbortController = useRef<AbortController | null>(null);

  // Load user from session on mount (from localStorage first, then API)
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        // 1. Check localStorage first
        const session = getSessionFromStorage();
        if (session?.user && isMounted) {
          setUser(session.user);
          setIsLoading(false);
          return;
        }

        // 2. Verify with API (in case cookie is still valid but localStorage expired)
        if (refreshAbortController.current) {
          refreshAbortController.current.abort();
        }
        refreshAbortController.current = new AbortController();

        const res = await fetch("/api/auth/me", {
          signal: refreshAbortController.current.signal,
        });

        if (res.ok && isMounted) {
          const data = await res.json();
          setUser(data.user);
          saveSessionToStorage(data.user, true); // Remember by default
        } else if (isMounted) {
          setUser(null);
        }
      } catch {
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isMounted = false;
      if (refreshAbortController.current) {
        refreshAbortController.current.abort();
      }
    };
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        saveSessionToStorage(data.user, true);
      } else {
        setUser(null);
        clearSessionStorage();
      }
    } catch {
      setUser(null);
      clearSessionStorage();
    }
  };

  const login = async (role: UserRole, data: Record<string, string>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setUser(result.user);
        // Save to localStorage with "remember me" from login form
        const remember = (data as Record<string, string> & { remember?: string }).remember === "true";
        saveSessionToStorage(result.user, remember);
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const register = async (role: string, data: Record<string, string>): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, ...data }),
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setUser(result.user);
        // Save to localStorage after registration (remember by default)
        saveSessionToStorage(result.user, true);
        return { success: true };
      }

      return { success: false, error: result.error };
    } catch {
      return { success: false, error: "Network error" };
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } finally {
      setUser(null);
      clearSessionStorage();
    }
  };

  const getSchoolName = () => user?.schoolName || "";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        getSchoolName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
