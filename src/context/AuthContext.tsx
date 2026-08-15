"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  avatar?: string;
}

interface AuthContextType {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  loginStep1: (email: string, pass: string) => Promise<{ requiresOtp: boolean; demoOtp?: string }>;
  verifyOtpStep2: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<AdminUser>) => Promise<void>;
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
      // Seed default admin session for seamless immediate access
      const defaultAdmin = {
        id: "admin-1",
        name: "BH Admin",
        email: "admin@bhreels.com",
        role: "admin",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      };
      setToken("demo-admin-session-token");
      setUser(defaultAdmin);
      localStorage.setItem("bh_auth_token", "demo-admin-session-token");
      localStorage.setItem("bh_auth_user", JSON.stringify(defaultAdmin));
    }
    setIsLoading(false);
  }, []);

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

  const updateProfile = async (data: Partial<AdminUser>) => {
    const res = await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      const updatedUser = { ...user, ...data } as AdminUser;
      setUser(updatedUser);
      localStorage.setItem("bh_auth_user", JSON.stringify(updatedUser));
    }
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
