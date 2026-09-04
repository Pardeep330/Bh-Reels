"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BHLogo } from "../common/BHLogo";
import {
  Video,
  Sparkles,
  Calculator,
  User,
  Menu,
  X,
  LogOut,
  Info,
  PhoneCall,
} from "lucide-react";

export const PublicNavbar: React.FC = () => {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  const syncUser = () => {
    try {
      const publicUser = localStorage.getItem("bh_public_user");
      const authUser = localStorage.getItem("bh_auth_user");

      if (publicUser) {
        setUser(JSON.parse(publicUser));
      } else if (authUser) {
        setUser(JSON.parse(authUser));
      } else {
        setUser(null);
      }
    } catch (e) {
      setUser(null);
    }
  };

  useEffect(() => {
    syncUser();

    // Listen for real-time login/logout events and cross-tab storage changes
    const handleAuthChange = () => syncUser();
    window.addEventListener("bh_auth_change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("bh_auth_change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem("bh_public_user");
    localStorage.removeItem("bh_auth_user");
    localStorage.removeItem("bh_auth_token");
    window.dispatchEvent(new Event("bh_auth_change"));
    setUser(null);
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Influencers", href: "/influencers" },
    { name: "Price Estimator", href: "/select-influencers", badge: "Engine" },
    ...(user ? [{ name: "My Campaigns", href: "/user/profile", badge: "Portal" }] : []),
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="hover:opacity-90 transition-opacity">
          <BHLogo size="md" />
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? "bg-[#D4AF37]/15 text-[#B8860B] border border-[#D4AF37]/40 font-bold shadow-gold-sm"
                    : "text-slate-700 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37] text-white font-extrabold">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Controls */}
        <div className="hidden lg:flex items-center gap-3">
          {/* User Sign In / Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <Link
                href="/user/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-[#D4AF37]/30 text-xs font-semibold text-slate-800 hover:border-[#D4AF37] hover:bg-white"
              >
                <img
                  src={user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                  alt=""
                  className="w-6 h-6 rounded-full object-cover border border-[#D4AF37]"
                />
                <span>{user.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/user/login"
                className="px-4 py-2 rounded-xl bg-white border border-slate-300 hover:border-slate-400 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                Sign In
              </Link>
              <Link
                href="/select-influencers"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" /> Select Creators
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-slate-700 hover:text-slate-900"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-2 animate-in fade-in shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 hover:text-[#B8860B]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <Link
              href="/user/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold text-[#B8860B] bg-slate-50 border border-slate-200 text-center"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
