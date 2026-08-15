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

  useEffect(() => {
    const savedUser = localStorage.getItem("bh_public_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("bh_public_user");
    setUser(null);
    window.location.href = "/";
  };

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Influencers", href: "/influencers" },
    { name: "Price Estimator", href: "/select-influencers", badge: "Engine" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#08090C]/90 backdrop-blur-md border-b border-[#D4AF37]/20 shadow-2xl">
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
                    ? "bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 font-bold shadow-gold-sm"
                    : "text-gray-300 hover:text-white hover:bg-[#131622]"
                }`}
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#D4AF37] text-black font-extrabold">
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
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131622] border border-[#D4AF37]/30 text-xs font-semibold text-white hover:border-[#D4AF37]"
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
                className="p-2 rounded-lg bg-red-950/40 text-red-400 hover:bg-red-900/60 transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/user/login"
                className="px-4 py-2 rounded-xl bg-transparent border border-gray-700 hover:border-gray-500 text-xs font-bold text-gray-300 transition-all"
              >
                Sign In
              </Link>
              <Link
                href="/select-influencers"
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:brightness-110 transition-all flex items-center gap-1.5"
              >
                <Calculator className="w-3.5 h-3.5" /> Select Creators
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 text-gray-300 hover:text-white"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0E1017] border-b border-[#D4AF37]/30 px-4 py-4 space-y-2 animate-in fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-semibold text-gray-200 hover:bg-[#131622] hover:text-[#D4AF37]"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-2 border-t border-gray-800 space-y-2">
            <Link
              href="/user/login"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-4 py-2.5 rounded-xl text-xs font-bold text-[#D4AF37] bg-[#131622]"
            >
              Sign In
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
