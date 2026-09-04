"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Sidebar } from "@/components/admin/Sidebar";
import { ShieldCheck, Loader2 } from "lucide-react";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!token || !user || user.role !== "admin") {
        router.replace("/user/login");
      }
    }
  }, [isLoading, token, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col items-center justify-center p-4 space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-white border border-[#D4AF37]/40 shadow-md flex items-center justify-center text-[#B8860B] animate-pulse">
          <ShieldCheck className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-2 text-xs font-bold text-[#B8860B]">
          <Loader2 className="w-4 h-4 animate-spin text-[#B8860B]" />
          <span>Verifying 2FA Admin Session...</span>
        </div>
      </div>
    );
  }

  if (!token || !user || user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-slate-900 antialiased selection:bg-[#D4AF37] selection:text-white">
      {/* Left Sticky Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>

        {/* Footer Branding */}
        <footer className="px-8 py-4 bg-white border-t border-slate-200 text-center text-xs text-slate-500 flex items-center justify-between shadow-sm">
          <div>© 2026 BH Reels Admin Portal. All rights reserved.</div>
          <div className="flex items-center gap-4 text-[11px] text-[#B8860B] font-medium">
            <span>Powered by BH Team</span>
            <span>•</span>
            <span>Next.js Fullstack</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
