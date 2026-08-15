"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
  is2FAEnabled?: boolean;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStep1: (email: string, pass: string) => Promise<{ requiresOtp: boolean; demoOtp?: string }>;
  verifyOtpStep2: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<AdminUser> & { currentPassword?: string; newPassword?: string }) => Promise<void>;
  toggle2FA: (enabled: boolean) => Promise<boolean>;
  getAuthHeaders: () => Record<string, string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Restore session from localStorage
    const savedToken = localStorage.getItem("bh_auth_token");
    const savedUser = localStorage.getItem("bh_auth_user");

    if (savedToken && savedUser) {
      try {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem("bh_auth_token");
        localStorage.removeItem("bh_auth_user");
      }
    } else {
      // Default initial session fallback for seamless experience
      const defaultAdmin: AdminUser = {
        id: "admin-1",
        name: "BH Admin",
        email: "admin@bhreels.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        is2FAEnabled: true,
      };
      setToken("demo-admin-session-token");
      setUser(defaultAdmin);
      localStorage.setItem("bh_auth_token", "demo-admin-session-token");
      localStorage.setItem("bh_auth_user", JSON.stringify(defaultAdmin));
    }
    setIsLoading(false);
  }, []);

  const getAuthHeaders = () => {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    const currentToken = token || localStorage.getItem("bh_auth_token");
    if (currentToken) {
      headers["Authorization"] = `Bearer ${currentToken}`;
    }
    return headers;
  };

  const loginStep1 = async (email: string, pass: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: pass }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Login credentials failed");
    }

    return {
      requiresOtp: data.requiresOtp,
      demoOtp: data.demoOtp,
    };
  };

  const verifyOtpStep2 = async (email: string, otp: string) => {
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "Invalid OTP code");
    }

    setToken(data.token);
    setUser(data.admin);
    localStorage.setItem("bh_auth_token", data.token);
    localStorage.setItem("bh_auth_user", JSON.stringify(data.admin));

    return true;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("bh_auth_token");
    localStorage.removeItem("bh_auth_user");
    router.push("/login");
  };

  const updateProfile = async (data: Partial<AdminUser> & { currentPassword?: string; newPassword?: string }) => {
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to update profile");
    }

    if (result.profile) {
      const updatedUser = { ...user, ...result.profile } as AdminUser;
      setUser(updatedUser);
      localStorage.setItem("bh_auth_user", JSON.stringify(updatedUser));
    }
  };

  const toggle2FA = async (enabled: boolean) => {
    const res = await fetch("/api/admin/2fa/toggle", {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ is2FAEnabled: enabled }),
    });

    const result = await res.json();
    if (!res.ok) {
      throw new Error(result.error || "Failed to toggle 2FA");
    }

    if (user) {
      const updatedUser = { ...user, is2FAEnabled: enabled };
      setUser(updatedUser);
      localStorage.setItem("bh_auth_user", JSON.stringify(updatedUser));
    }
    return true;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        loginStep1,
        verifyOtpStep2,
        logout,
        updateProfile,
        toggle2FA,
        getAuthHeaders,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
