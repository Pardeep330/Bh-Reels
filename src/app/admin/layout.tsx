"use client";

import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import { Sidebar } from "@/components/admin/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="flex min-h-screen bg-[#08090C] text-gray-100 antialiased selection:bg-[#D4AF37] selection:text-black">
        {/* Left Sticky Sidebar */}
        <Sidebar />

        {/* Main Workspace Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 p-8 overflow-y-auto">{children}</main>

          {/* Footer Branding */}
          <footer className="px-8 py-4 bg-[#08090C] border-t border-[#D4AF37]/10 text-center text-xs text-gray-500 flex items-center justify-between">
            <div>© 2026 BH Reels Admin Portal. All rights reserved.</div>
            <div className="flex items-center gap-4 text-[11px] text-[#C5A059]">
              <span>Powered by BH Team</span>
              <span>•</span>
              <span>Next.js Fullstack</span>
            </div>
          </footer>
        </div>
      </div>
    </AuthProvider>
  );
};
