"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { BHLogo } from "@/components/common/BHLogo";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  ArrowRight,
  Mail,
  RefreshCw,
  Sparkles,
} from "lucide-react";

function VerifyEmailContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("Verifying your email address...");
  const [user, setUser] = useState<any>(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Verification token is missing from the link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Verification failed");
        }

        // Auto-login session established
        localStorage.setItem("bh_auth_token", data.token);
        localStorage.setItem("bh_auth_user", JSON.stringify(data.user));
        localStorage.setItem("bh_public_user", JSON.stringify(data.user));
        window.dispatchEvent(new Event("bh_auth_change"));

        setUser(data.user);
        setStatus("success");
        setMessage("Email verified successfully! You are now automatically logged in.");

        // Redirect after brief celebration
        setTimeout(() => {
          router.push("/select-influencers");
        }, 1800);
      } catch (err: any) {
        setStatus("error");
        setMessage(err.message || "Failed to verify email. The link may have expired.");
      }
    };

    verify();
  }, [token, router]);

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResending(true);
    setResendError("");
    setResendMessage("");

    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resendEmail }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to resend verification link");
      }

      setResendMessage(data.message || "A new verification link has been sent to your email!");
    } catch (err: any) {
      setResendError(err.message || "Failed to resend link");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <BHLogo size="lg" />
          <h2 className="text-2xl font-black text-slate-900 mt-4">
            Email Verification
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Account activation &amp; instant sign-in
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl space-y-6 text-center">
          {status === "loading" && (
            <div className="py-8 space-y-4">
              <div className="relative inline-flex">
                <div className="w-16 h-16 rounded-full bg-amber-50 border-2 border-[#D4AF37] flex items-center justify-center animate-spin">
                  <Loader2 className="w-8 h-8 text-[#B8860B]" />
                </div>
              </div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Verifying Your Account
              </h3>
              <p className="text-xs text-slate-600 max-w-xs mx-auto">
                Please wait while we confirm your email and set up your active session...
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="py-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-50 border-2 border-emerald-500 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-9 h-9 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Verified &amp; Signed In
                </span>
                <h3 className="text-xl font-black text-slate-900 pt-2">
                  Welcome, {user?.name || "Producer"}!
                </h3>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Your email has been successfully verified. You are logged in and being redirected to select influencers...
                </p>
              </div>

              <div className="pt-3">
                <Link
                  href="/select-influencers"
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2"
                >
                  <span>Go to Price Estimator Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}

          {status === "error" && (
            <div className="py-4 space-y-5">
              <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-500 flex items-center justify-center mx-auto shadow-md">
                <AlertCircle className="w-9 h-9 text-red-600" />
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-black text-slate-900">
                  Verification Failed
                </h3>
                <p className="text-xs text-red-600 font-semibold px-2">
                  {message}
                </p>
              </div>

              {/* Resend Link Form */}
              <div className="pt-4 border-t border-slate-200 text-left space-y-3">
                <label className="block text-xs font-bold text-slate-700">
                  Request a New Verification Link
                </label>

                {resendMessage && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
                    {resendMessage}
                  </div>
                )}

                {resendError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold">
                    {resendError}
                  </div>
                )}

                <form onSubmit={handleResend} className="space-y-2">
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="Enter your registered email"
                      value={resendEmail}
                      onChange={(e) => setResendEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={resending}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-bold text-xs shadow-gold-sm hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {resending ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Sending Link...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-3.5 h-3.5" />
                        <span>Resend Verification Link</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <Link
                    href="/user/login"
                    className="text-xs font-extrabold text-[#B8860B] hover:underline"
                  >
                    ← Back to Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full border-2 border-[#D4AF37] border-t-transparent animate-spin" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
