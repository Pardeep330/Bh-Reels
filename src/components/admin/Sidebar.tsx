"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BHLogo } from "../common/BHLogo";
import {
  LayoutDashboard,
  Users,
  Video,
  Megaphone,
  CreditCard,
  UserCheck,
  KeyRound,
  LogOut,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
    badge: "Live",
  },
  {
    name: "Influencer Module",
    href: "/admin/influencers",
    icon: Video,
    badge: "Core",
  },
  {
    name: "Payment Review",
    href: "/admin/payments",
    icon: CreditCard,
    badge: "Review",
  },
  {
    name: "Ada (Masuri) Ads",
    href: "/admin/ads",
    icon: Megaphone,
    badge: "Ads",
  },
  {
    name: "User Module",
    href: "/admin/users",
    icon: Users,
  },
  {
    name: "Admin Profile",
    href: "/admin/profile",
    icon: UserCheck,
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { logout, user } = useAuth();

  return (
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen sticky top-0 z-40 select-none shadow-sm">
      {/* Brand Logo Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        <Link href="/admin/dashboard">
          <BHLogo size="md" />
        </Link>
      </div>

      {/* Security Status Badge */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
          <ShieldCheck className="w-4 h-4 text-[#B8860B]" />
          <span>2-Step Auth Active</span>
        </div>
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
      </div>

      {/* Main Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3 mb-2">
          Admin Portal Navigation
        </div>

        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center justify-between px-3.5 py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? "bg-gradient-to-r from-[#D4AF37]/15 to-transparent border-l-4 border-[#B8860B] text-slate-900 shadow-sm font-semibold"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? "text-[#B8860B]" : "text-slate-400 group-hover:text-[#B8860B]"
                  }`}
                />
                <span className="text-sm font-medium">{item.name}</span>
              </div>

              {item.badge && (
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                    isActive
                      ? "bg-[#D4AF37] text-white"
                      : "bg-slate-200 text-slate-700 group-hover:bg-[#D4AF37]/20"
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Admin User Footer Menu */}
      <div className="p-4 border-t border-slate-200 bg-slate-50">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-white border border-slate-200 shadow-sm mb-3">
          <img
            src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
            alt={user?.name || "Admin"}
            className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]"
          />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-slate-900 truncate flex items-center gap-1">
              {user?.name || "BH Admin"}
              <Sparkles className="w-3 h-3 text-[#B8860B] inline" />
            </div>
            <div className="text-xs text-slate-500 truncate">{user?.email || "admin@bhreels.com"}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 text-xs font-semibold transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out Admin</span>
        </button>
      </div>
    </aside>
  );
};
