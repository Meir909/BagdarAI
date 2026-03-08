"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

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

  // Load user from session on mount
  useEffect(() => {
    refreshUser().finally(() => setIsLoading(false));
  }, []);

  const refreshUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
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
