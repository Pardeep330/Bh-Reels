"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/admin/Header";
import { GlobalLoader } from "@/components/common/GlobalLoader";
import { useAuth } from "@/context/AuthContext";
import {
  UserCheck,
  ShieldCheck,
  KeyRound,
  Save,
  CheckCircle2,
  Lock,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  ShieldAlert,
  Upload,
  Loader2,
  Camera,
  User as UserIcon,
  Mail,
  Phone,
  XCircle,
} from "lucide-react";

export default function ProfilePage() {
  const { user, updateProfile, toggle2FA, getAuthHeaders } = useAuth();

  const [profileData, setProfileData] = useState({
    name: user?.name || "BH Admin",
    email: user?.email || "admin@bhreels.com",
    phone: user?.phone || "",
    avatar: user?.avatar || "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [is2FA, setIs2FA] = useState(user?.is2FAEnabled !== false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });
  const [passwordMsg, setPasswordMsg] = useState({ type: "", text: "" });
  const [twoFaMsg, setTwoFaMsg] = useState("");
  const [globalSaving, setGlobalSaving] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("Saving changes...");
  const [uploading, setUploading] = useState(false);

  // Sync user from context when it loads
  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        avatar: user.avatar || "",
      });
      setIs2FA(user.is2FAEnabled !== false);
    }
  }, [user]);

  const showMsg = (
    setter: (v: { type: string; text: string }) => void,
    type: string,
    text: string
  ) => {
    setter({ type, text });
    setTimeout(() => setter({ type: "", text: "" }), 5000);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setLoaderMsg("Uploading profile photo to server...");
    setGlobalSaving(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      if (res.ok) {
        const data = await res.json();
        setProfileData((prev) => ({ ...prev, avatar: data.url }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setGlobalSaving(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoaderMsg("Saving profile details to MongoDB...");
    setGlobalSaving(true);
    try {
      await updateProfile({
        name: profileData.name,
        phone: profileData.phone,
        avatar: profileData.avatar,
      });
      showMsg(setProfileMsg, "success", "Profile updated successfully!");
    } catch (e: any) {
      showMsg(setProfileMsg, "error", e.message || "Failed to update profile");
    } finally {
      setGlobalSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showMsg(setPasswordMsg, "error", "New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showMsg(setPasswordMsg, "error", "Password must be at least 6 characters.");
      return;
    }
    setLoaderMsg("Updating security password...");
    setGlobalSaving(true);
    try {
      await updateProfile({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      showMsg(setPasswordMsg, "success", "Password changed successfully!");
      setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (e: any) {
      showMsg(setPasswordMsg, "error", e.message || "Failed to update password");
    } finally {
      setGlobalSaving(false);
    }
  };

  const handleToggle2FA = async () => {
    setLoaderMsg("Updating 2FA security settings...");
    setGlobalSaving(true);
    try {
      const nextState = !is2FA;
      await toggle2FA(nextState);
      setIs2FA(nextState);
      setTwoFaMsg(`2-Step OTP Authentication is now ${nextState ? "Enabled" : "Disabled"}.`);
      setTimeout(() => setTwoFaMsg(""), 5000);
    } catch (e: any) {
      setTwoFaMsg(e.message || "Failed to update 2FA status");
    } finally {
      setGlobalSaving(false);
    }
  };

  const MsgBanner = ({ msg }: { msg: { type: string; text: string } }) => {
    if (!msg.text) return null;
    const isSuccess = msg.type === "success";
    return (
      <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${isSuccess ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-300" : "bg-red-950/60 border border-red-500/30 text-red-300"}`}>
        {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
        {msg.text}
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <GlobalLoader isLoading={globalSaving} message={loaderMsg} />

      <Header
        title="Admin Profile & Security"
        subtitle="Edit profile details, upload avatar, change password & manage 2FA"
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Avatar + 2FA */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="glass-panel rounded-2xl p-6 text-center space-y-4 relative overflow-hidden border border-[#D4AF37]/20">
            {/* Avatar with Upload Overlay */}
            <div className="relative w-28 h-28 mx-auto group">
              <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-[#B38728] via-[#FDF0A6] to-[#AA771C] shadow-gold-md">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-[#1E2230] flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-[#D4AF37]" />
                  </div>
                )}
              </div>

              {/* Camera overlay on hover */}
              <label
                htmlFor="avatar-upload"
                className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploading ? (
                  <Loader2 className="w-6 h-6 text-white animate-spin" />
                ) : (
                  <Camera className="w-6 h-6 text-white" />
                )}
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center justify-center gap-1.5">
                {profileData.name || "BH Admin"} <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </h2>
              <p className="text-xs text-[#C5A059] font-mono mt-0.5">{profileData.email}</p>
              <p className="text-[11px] text-gray-500 mt-1">Admin • BS Reels</p>
            </div>

            {/* Upload hint */}
            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37] text-[11px] font-bold cursor-pointer hover:bg-[#D4AF37]/20 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </label>

            {/* Or paste URL */}
            <div className="text-left space-y-1">
              <div className="text-[10px] text-gray-500">Or paste avatar URL:</div>
              <input
                type="text"
                placeholder="https://... or /uploads/..."
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full bg-[#0E1017] border border-gray-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            {/* 2FA Status Badge */}
            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                is2FA
                  ? "bg-emerald-950/60 border border-emerald-500/30 text-emerald-400"
                  : "bg-amber-950/60 border border-amber-500/30 text-amber-400"
              }`}
            >
              {is2FA ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
              {is2FA ? "2-Step OTP Active" : "2-Step OTP Disabled"}
            </div>
          </div>

          {/* 2FA Toggle Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4 border border-[#D4AF37]/30">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 2-Factor Authentication
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">Require 6-digit OTP verification on sign in</p>
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

        {/* Right Column: Edit Profile + Change Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="glass-panel rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#D4AF37]" /> Edit Profile Details
              </h3>
            </div>

            <MsgBanner msg={profileMsg} />

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Admin Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-[#0E1017] border border-gray-800 rounded-xl px-3.5 py-2.5 text-gray-500 cursor-not-allowed"
                    title="Email cannot be changed here"
                  />
                  <p className="text-[10px] text-gray-500 mt-1">Email is fixed and cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
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

            <MsgBanner msg={passwordMsg} />

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
                    className={`w-full bg-[#131622] border rounded-xl px-3.5 py-2.5 text-white focus:outline-none ${
                      passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500"
                        : "border-[#D4AF37]/30 focus:border-[#D4AF37]"
                    }`}
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-[10px] text-red-400 mt-1">Passwords do not match</p>
                  )}
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
