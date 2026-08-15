"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { BHLogo } from "@/components/common/BHLogo";
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, Copy, Check, RefreshCw } from "lucide-react";

export default function UserLoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState("producer@studio.com");
  const [password, setPassword] = useState("user123");
  const [otp, setOtp] = useState(["1", "2", "3", "4", "5", "6"]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser = {
      name: "Producer Client",
      email,
      role: "user",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    };
    localStorage.setItem("bh_public_user", JSON.stringify(mockUser));
    router.push("/select-influencers");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <BHLogo size="lg" />
          <h2 className="text-xl font-extrabold text-white mt-2">
            {step === 1 ? "Producer & Client Sign In" : "User 2-Step OTP Verification"}
          </h2>
          <p className="text-xs text-gray-400">
            {step === 1 ? "Access your reel campaign bookings" : `Enter the 6-digit OTP code sent to ${email}`}
          </p>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-[#D4AF37]/30 shadow-2xl space-y-6">
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
                  <Link href="/user/forgot-password" className="text-[11px] text-[#D4AF37] hover:underline">
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
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 flex items-center justify-center gap-2"
              >
                <span>Proceed to 2-Step OTP</span>
                <ArrowRight className="w-4 h-4" />
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
                  Enter 6-Digit OTP Code (Demo: 123456)
                </label>
                <div className="flex items-center justify-between gap-2">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => {
                        const newOtp = [...otp];
                        newOtp[idx] = e.target.value;
                        setOtp(newOtp);
                      }}
                      className="w-12 h-14 bg-[#131622] border-2 border-[#D4AF37]/40 rounded-xl text-center font-mono text-xl font-extrabold text-white focus:outline-none focus:border-[#D4AF37]"
                    />
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                <span>Verify OTP & Enter Portal</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
