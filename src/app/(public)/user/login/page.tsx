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
          <h2 className="text-xl font-extrabold text-white mt-2">
            {step === 1 ? "Sign In to BH Reels" : "2-Step Authenticator Verification"}
          </h2>
          <p className="text-xs text-gray-400">
            {step === 1
              ? "Enter your account email & password to log in"
              : `Enter the 6-digit code from your Authenticator App for ${email}`}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6">
          {error && (
            <div className="p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {step === 2 && demoOtp && (
            <div className="p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/30 flex items-center justify-between text-xs">
              <span className="text-[#D4AF37] font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Authenticator Code:
              </span>
              <button
                type="button"
                onClick={fillDemoOtp}
                className="text-[11px] px-2 py-0.5 rounded bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#D4AF37] font-mono font-bold"
              >
                Auto-fill ({demoOtp})
              </button>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleStep1} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-bold mb-1.5">Email Address</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-gray-300 font-bold">Password</label>
                  <Link href="/forgot-password" className="text-[11px] text-[#D4AF37] hover:underline">
                    Forgot Password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
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
                <span className="text-gray-400 text-xs">Don't have an account? </span>
                <Link href="/user/register" className="text-xs font-bold text-[#D4AF37] hover:underline">
                  Register Here
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleStep2} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-xs font-bold text-gray-300 text-center">
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
                      className="w-12 h-14 bg-[#131622] border-2 border-[#D4AF37]/40 rounded-xl text-center font-mono text-xl font-extrabold text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 flex items-center justify-center gap-2 disabled:opacity-50"
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
