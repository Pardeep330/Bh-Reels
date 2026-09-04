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
      <div className={`p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${isSuccess ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-red-50 border border-red-200 text-red-700"}`}>
        {isSuccess ? <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /> : <XCircle className="w-4 h-4 shrink-0 text-red-600" />}
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
          <div className="bg-white rounded-3xl p-6 text-center space-y-4 relative overflow-hidden border border-slate-200 shadow-sm">
            <div className="relative w-28 h-28 mx-auto group">
              <div className="w-full h-full rounded-full p-1 bg-gradient-to-tr from-[#B38728] via-[#FDF0A6] to-[#AA771C] shadow-sm">
                {profileData.avatar ? (
                  <img
                    src={profileData.avatar}
                    alt={profileData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-slate-100 flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-[#B8860B]" />
                  </div>
                )}
              </div>

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
              <h2 className="text-xl font-extrabold text-slate-900 flex items-center justify-center gap-1.5">
                {profileData.name || "BH Admin"} <Sparkles className="w-4 h-4 text-[#B8860B]" />
              </h2>
              <p className="text-xs text-[#B8860B] font-mono font-bold mt-0.5">{profileData.email}</p>
              <p className="text-[11px] text-slate-500 font-medium mt-1">Admin • BS Reels</p>
            </div>

            <label
              htmlFor="avatar-upload"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-[#B8860B] text-[11px] font-bold cursor-pointer hover:bg-amber-100 transition-all"
            >
              <Upload className="w-3.5 h-3.5" />
              {uploading ? "Uploading..." : "Change Profile Photo"}
            </label>

            <div className="text-left space-y-1">
              <div className="text-[10px] text-slate-500 font-medium">Or paste avatar URL:</div>
              <input
                type="text"
                placeholder="https://... or /uploads/..."
                value={profileData.avatar}
                onChange={(e) => setProfileData({ ...profileData, avatar: e.target.value })}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
              />
            </div>

            <div
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
                is2FA
                  ? "bg-emerald-50 border border-emerald-300 text-emerald-800"
                  : "bg-amber-50 border border-amber-300 text-amber-900"
              }`}
            >
              {is2FA ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <ShieldAlert className="w-4 h-4 text-amber-600" />}
              {is2FA ? "2-Step OTP Active" : "2-Step OTP Disabled"}
            </div>
          </div>

          {/* 2FA Toggle Card */}
          <div className="bg-white rounded-3xl p-6 space-y-4 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#B8860B]" /> 2-Factor Authentication
                </h3>
                <p className="text-[11px] text-slate-500 font-medium mt-0.5">Require 6-digit OTP verification on sign in</p>
              </div>

              <button
                onClick={handleToggle2FA}
                className="text-[#B8860B] hover:scale-105 transition-transform"
                title={is2FA ? "Disable 2FA" : "Enable 2FA"}
              >
                {is2FA ? (
                  <ToggleRight className="w-8 h-8 text-[#D4AF37]" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-slate-400" />
                )}
              </button>
            </div>

            {twoFaMsg && (
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs font-semibold text-amber-900">
                {twoFaMsg}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Edit Profile + Change Password */}
        <div className="lg:col-span-2 space-y-6">
          {/* Edit Profile Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-[#B8860B]" /> Edit Profile Details
              </h3>
            </div>

            <MsgBanner msg={profileMsg} />

            <form onSubmit={handleProfileSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <UserIcon className="w-3 h-3" /> Admin Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Mail className="w-3 h-3" /> Email Address
                  </label>
                  <input
                    type="email"
                    value={profileData.email}
                    disabled
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3.5 py-2.5 text-slate-500 cursor-not-allowed font-medium"
                    title="Email cannot be changed here"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">Email is fixed and cannot be changed.</p>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold shadow-gold-md hover:brightness-105 flex items-center gap-2"
                >
                  <Save className="w-4 h-4" /> Save Profile Changes
                </button>
              </div>
            </form>
          </div>

          {/* Change Password Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 space-y-5 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-[#B8860B]" /> Change Security Password
              </h3>
            </div>

            <MsgBanner msg={passwordMsg} />

            <form onSubmit={handlePasswordSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Current Password</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 chars"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat new password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    className={`w-full bg-slate-50 border rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none ${
                      passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword
                        ? "border-red-500"
                        : "border-slate-300 focus:border-[#D4AF37]"
                    }`}
                  />
                  {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                    <p className="text-[10px] text-red-600 mt-1 font-semibold">Passwords do not match</p>
                  )}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all flex items-center gap-2"
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
