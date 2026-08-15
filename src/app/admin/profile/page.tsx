"use client";

import React, { useState } from "react";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
import {
  UserCheck,
  ShieldCheck,
  KeyRound,
  Mail,
  Phone,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, toggle2FA } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "BH Admin",
    email: user?.email || "admin@bhreels.com",
    phone: user?.phone || "+91 98765 43210",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [is2FA, setIs2FA] = useState(user?.is2FAEnabled !== false);
  const [profileMsg, setProfileMsg] = useState("");
  const [passwordMsg, setPasswordMsg] = useState("");
  const [twoFaMsg, setTwoFaMsg] = useState("");

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileData);
      setProfileMsg("Profile updated successfully!");
      setTimeout(() => setProfileMsg(""), 4000);
    } catch (e: any) {
      setProfileMsg(e.message || "Failed to update profile");
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMsg("New passwords do not match!");
      return;
    }
    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setPasswordMsg("Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMsg(""), 4000);
    } catch (e: any) {
      setPasswordMsg(e.message || "Failed to update password");
    }
  };

  const handleToggle2FA = async () => {
    try {
      const nextState = !is2FA;
      await toggle2FA(nextState);
      setIs2FA(nextState);
      setTwoFaMsg(`2-Step OTP Authentication is now ${nextState ? "Enabled" : "Disabled"}.`);
      setTimeout(() => setTwoFaMsg(""), 4000);
    } catch (e: any) {
      setTwoFaMsg(e.message || "Failed to update 2FA status");
    }
  };

  return (
    <div className="space-y-8">
      <Header
        title="Admin Profile & Security"
        subtitle="Manage administrator credentials, 2-Step OTP verification & password settings"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Admin Profile Card */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 text-center space-y-4 relative overflow-hidden">
            <div className="w-24 h-24 rounded-full mx-auto p-1 bg-gradient-to-tr from-[#B38728] via-[#FDF0A6] to-[#AA771C] shadow-gold-md">
              <img
                src={user?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                alt={user?.name}
                className="w-full h-full rounded-full object-cover"
              />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
                {user?.name || "BH Admin"} <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </h2>
              <p className="text-xs text-[#C5A059] font-mono mt-0.5">{user?.email || "admin@bhreels.com"}</p>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                is2FA
                  ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                  : "bg-amber-950/60 border border-amber-500/30 text-amber-400"
              }`}
            >
              {is2FA ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {is2FA ? "2-Step OTP Security Active" : "2-Step OTP Disabled"}
            </div>
          </div>

          {/* 2FA Toggle Switch Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 border border-[#D4AF37]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 2-Factor Authentication
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Require 6-digit OTP verification code on sign in</p>
              </div>

              <button
                onClick={handleToggle2FA}
                className="text-[#D4AF37] hover:scale-105 transition-transform"
                title={is2FA ? "Disable 2FA" : "Enable 2FA"}
              >
                {is2FA ? (
                  <ToggleRight className="w-8 h-8 text-[#D4AF37]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-500" />
                )}
              </button>
            </div>

            {twoFaMsg && (
              <div className="p-2.5 rounded-xl bg-[#131622] border border-[#D4AF37]/30 text-xs font-semibold text-[#D4AF37]">
                {twoFaMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile Form & Change Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Edit Profile Details
              </h3>
            </div>

            {profileMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {profileMsg}
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Admin Name</label>
                  <input
                    type="text"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#D4AF37]" /> Change Security Password
              </h3>
            </div>

            {passwordMsg && (
              <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> {passwordMsg}
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 chars"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#181B2B] border border-[#D4AF37]/40 hover:border-[#D4AF37] text-white font-bold transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4 text-[#D4AF37]" /> Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
