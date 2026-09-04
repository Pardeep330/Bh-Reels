"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BHLogo } from "@/components/common/BHLogo";
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  Copy,
  Check,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function UserLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("admin@bhreels.com");
  const [password, setPassword] = useState("admin123");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoOtp, setDemoOtp] = useState<string | null>("123456");
  const [isAdminLogin, setIsAdminLogin] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Authenticate against server API
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Fallback for demo user client login if not admin
        if (email !== "admin@bhreels.com") {
          setIsAdminLogin(false);
          setStep(2);
          return;
        }
        throw new Error(data.error || "Invalid login credentials");
      }

      setIsAdminLogin(true);
      if (data.demoOtp) {
        setDemoOtp(data.demoOtp);
      }
      setStep(2);
    } catch (err: any) {
      setError(err.message || "Sign in failed");
    } finally {
      setLoading(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullOtp = otp.join("");
    if (fullOtp.length !== 6) {
      setError("Please enter the 6-digit code from your Authenticator App / SMS");
      return;
    }

    setError("");
    setLoading(true);

    try {
      if (isAdminLogin || email.toLowerCase() === "admin@bhreels.com") {
        const res = await fetch("/api/auth/verify-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: fullOtp }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Invalid 2FA Authenticator code");
        }

        localStorage.setItem("bh_auth_token", data.token);
        localStorage.setItem("bh_auth_user", JSON.stringify(data.admin));
        window.dispatchEvent(new Event("bh_auth_change"));

        // Redirect to Admin Portal
        router.push("/admin/dashboard");
      } else {
        const mockUser = {
          name: "Producer Client",
          email,
          role: "user",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        };
        localStorage.setItem("bh_public_user", JSON.stringify(mockUser));
        window.dispatchEvent(new Event("bh_auth_change"));
        router.push("/select-influencers");
      }
    } catch (err: any) {
      setError(err.message || "OTP Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`public-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const fillDemoOtp = () => {
    const code = demoOtp || "123456";
    setOtp(code.split(""));
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <BHLogo size="lg" />
          <h2 className="text-2xl font-black text-slate-900 mt-3">
            {step === 1 ? "Sign In to BH Reels" : "2-Step Authenticator Verification"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            {step === 1
              ? "Enter your account email & password to log in"
              : `Enter the 6-digit code from your Authenticator App for ${email}`}
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 2 && demoOtp && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-between text-xs">
              <span className="text-amber-900 font-bold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> Authenticator Code:
              </span>
              <button
                type="button"
                onClick={fillDemoOtp}
                className="text-xs px-2.5 py-1 rounded bg-amber-200 border border-amber-400 text-amber-950 font-mono font-bold hover:bg-amber-300 transition-colors"
              >
                Auto-fill ({demoOtp})
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 font-bold">Password</label>
                  <Link href="/forgot-password" className="text-xs font-bold text-[#B8860B] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Checking Account...</span>
                ) : (
                  <>
                    <span>Proceed to 2-Step Verification</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="text-center pt-2">
                <span className="text-slate-600 text-xs font-medium">Don't have an account? </span>
                <Link href="/user/register" className="text-xs font-extrabold text-[#B8860B] hover:underline">
                  Register Here
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 text-center">
                  Enter 6-Digit Authenticator App / Security Code
                </label>
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`public-otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      className="w-12 h-14 bg-slate-50 border-2 border-slate-300 rounded-xl text-center font-mono text-xl font-black text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Authenticating Session...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-5 h-5" />
                    <span>Verify Code & Sign In</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
