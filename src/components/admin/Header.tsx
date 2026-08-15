"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Search, Bell, Shield, Sparkles, User, Key, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const { user } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="h-20 bg-[#0E1017]/90 backdrop-blur-md border-b border-[#D4AF37]/20 px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Title & Section breadcrumb */}
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>{title}</span>
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-mono">
            ADMIN
          </span>
        </h1>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-4">
        {/* Global Search Bar */}
        <div className="relative hidden md:block w-64">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search influencer, user..."
            className="w-full bg-[#131622] border border-[#D4AF37]/20 rounded-full pl-9 pr-4 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
          />
        </div>

        {/* 2FA Shield Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#131622] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
          <Shield className="w-3.5 h-3.5" />
          <span>2-Step Verified</span>
        </div>

        {/* Notifications Icon with Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="w-10 h-10 rounded-full bg-[#131622] border border-[#D4AF37]/20 flex items-center justify-center text-gray-300 hover:text-white hover:border-[#D4AF37] transition-colors relative"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#D4AF37]" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 bg-[#131622] border border-[#D4AF37]/30 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
                <span className="text-xs font-bold text-white flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" /> Notifications
                </span>
                <span className="text-[10px] text-[#D4AF37]">2 New</span>
              </div>
              <div className="py-3 space-y-3">
                <div className="flex items-start gap-2.5 text-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">New Influencer Joined</div>
                    <div className="text-gray-400 text-[11px]">Rohan Sharma (@rohan_vlogs) rate updated</div>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 text-xs">
                  <Shield className="w-4 h-4 text-[#D4AF37] mt-0.5 shrink-0" />
                  <div>
                    <div className="font-semibold text-white">2-Step Security Verified</div>
                    <div className="text-gray-400 text-[11px]">Admin session active with OTP token</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Profile Avatar Quick Link */}
        <Link
          href="/admin/profile"
          className="flex items-center gap-3 p-1.5 rounded-full bg-[#131622] border border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all"
        >
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
            alt={user?.name || "Admin"}
            className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
          />
        </Link>
      </div>
    </header>
  );
};
