"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  QrCode,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ArrowLeft,
  FileCheck,
  Sparkles,
  Upload,
  Lock,
} from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState(
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400"
  );
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [error, setError] = useState("");

  const upiId = "bhreels@upi";

  useEffect(() => {
    const savedDraft = sessionStorage.getItem("bh_booking_draft");
    if (savedDraft) {
      try {
        setBookingDraft(JSON.parse(savedDraft));
      } catch (e) {}
    }
  }, []);

  const copyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!utrNumber || utrNumber.trim().length < 6) {
      setError("Please enter a valid 12-digit UPI UTR transaction reference number.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const payload = {
        title: bookingDraft?.projectTitle || "Producer Reel Campaign",
        clientName: bookingDraft?.producerName || "Producer",
        producerName: bookingDraft?.producerName,
        producerEmail: bookingDraft?.producerEmail,
        producerPhone: bookingDraft?.producerPhone,
        budget: bookingDraft?.totalEstimatedPrice || 40000,
        reelsCount: bookingDraft?.totalReelsCount || 2,
        assignedInfluencers: bookingDraft?.selectedIds || [],
        utrNumber,
        paymentScreenshot: screenshotUrl,
        notes: bookingDraft?.notes || "",
      };

      const res = await fetch("/api/public/campaign-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSubmitted(true);
      sessionStorage.removeItem("bh_booking_draft");
    } catch (err: any) {
      setError(err.message || "Failed to submit UTR payment");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  if (submitted) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-950/80 border-2 border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto shadow-gold-md">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white">Payment UTR Submitted!</h1>
          <p className="text-xs text-gray-300">
            Your 12-digit UTR <span className="font-mono text-[#D4AF37] font-bold">"{utrNumber}"</span> has been received and sent to the BH Reels Admin team for verification.
          </p>
        </div>

        <div className="glass-panel p-6 rounded-2xl text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Payment Status:</span>
            <span className="font-extrabold text-[#D4AF37]">PENDING ADMIN APPROVAL</span>
          </div>
          <div className="flex justify-between border-b border-gray-800 pb-2">
            <span className="text-gray-400">Producer Name:</span>
            <span className="font-bold text-white">{bookingDraft?.producerName || "Producer"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Total Payable:</span>
            <span className="font-extrabold text-gold-gradient">
              {formatCurrency(bookingDraft?.totalEstimatedPrice || 40000)}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4">
          <Link
            href="/admin/campaigns"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md"
          >
            View in Admin Review Portal
          </Link>
          <Link href="/" className="px-6 py-3 rounded-xl bg-[#131622] text-white text-xs font-semibold">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-xs text-gray-400 hover:text-white flex items-center gap-1 font-semibold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Estimator
        </button>

        <span className="text-xs text-[#D4AF37] font-bold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Payment
        </span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-white">
          Scan UPI & Submit <span className="text-gold-gradient">UTR Reference</span>
        </h1>
        <p className="text-xs text-gray-400">
          Complete payment using Google Pay, PhonePe, Paytm or any BHIM UPI app
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Payment Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: QR Code Scanner & UPI Details */}
        <div className="glass-panel p-6 rounded-3xl space-y-6 text-center border-2 border-[#D4AF37]/30 shadow-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[11px] font-bold text-[#D4AF37]">
            <QrCode className="w-3.5 h-3.5" /> Official BH Reels Payment Gateway
          </div>

          {/* QR Code Scanner Vector Display */}
          <div className="relative w-56 h-56 mx-auto bg-white p-4 rounded-2xl shadow-gold-md flex flex-col items-center justify-center border-4 border-[#D4AF37]">
            {/* Styled QR placeholder / SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-black">
              <path
                d="M 10 10 H 40 V 40 H 10 Z M 15 15 V 35 H 35 V 15 Z M 20 20 H 30 V 30 H 20 Z"
                fill="currentColor"
              />
              <path
                d="M 60 10 H 90 V 40 H 60 Z M 65 15 V 35 H 85 V 15 Z M 70 20 H 80 V 30 H 70 Z"
                fill="currentColor"
              />
              <path
                d="M 10 60 H 40 V 90 H 10 Z M 15 65 V 85 H 35 V 65 Z M 20 70 H 30 V 80 H 20 Z"
                fill="currentColor"
              />
              <rect x="45" y="45" width="10" height="10" fill="currentColor" />
              <rect x="60" y="60" width="15" height="15" fill="currentColor" />
              <rect x="80" y="80" width="10" height="10" fill="currentColor" />
              <rect x="45" y="75" width="10" height="15" fill="currentColor" />
              <rect x="75" y="45" width="15" height="10" fill="currentColor" />
            </svg>
            <div className="absolute inset-0 border-2 border-[#D4AF37] rounded-2xl pointer-events-none animate-pulse-slow" />
          </div>

          {/* UPI ID Copy Bar */}
          <div className="p-3 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 space-y-1">
            <div className="text-[10px] text-gray-400 uppercase font-semibold">Official UPI ID</div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-base font-extrabold text-[#D4AF37]">{upiId}</span>
              <button
                type="button"
                onClick={copyUpi}
                className="p-1.5 rounded-lg bg-[#181B2B] text-gray-300 hover:text-white border border-[#D4AF37]/30"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <div className="text-[11px] text-gray-400 flex items-center justify-center gap-3">
            <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
          </div>
        </div>

        {/* Right Column: UTR Input & Summary Form */}
        <div className="glass-panel p-6 rounded-3xl space-y-6">
          <div className="pb-3 border-b border-[#D4AF37]/20 flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Payment Summary</h3>
            <span className="text-xs font-black text-gold-gradient">
              {formatCurrency(bookingDraft?.totalEstimatedPrice || 40000)}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0E1017] space-y-2 text-xs">
            <div className="flex justify-between text-gray-300">
              <span>Producer Name:</span>
              <span className="font-bold text-white">{bookingDraft?.producerName || "Producer"}</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Selected Creators:</span>
              <span className="font-bold text-[#D4AF37]">{bookingDraft?.selectedIds?.length || 2} Creators</span>
            </div>
            <div className="flex justify-between text-gray-300">
              <span>Reels Requested:</span>
              <span className="font-bold text-white">{bookingDraft?.totalReelsCount || 2} Reels</span>
            </div>
          </div>

          {/* UTR Input Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-gray-300 font-bold mb-1">
                Enter 12-Digit UPI UTR / Ref No. *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 918273645012"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full bg-[#0E1017] border border-[#D4AF37]/40 rounded-xl px-4 py-3 text-white font-mono text-base font-bold placeholder-gray-600 focus:outline-none focus:border-[#D4AF37]"
              />
              <p className="text-[10px] text-gray-500 mt-1">
                You can find the 12-digit UTR / Ref No. in your UPI app transaction history details.
              </p>
            </div>

            <div>
              <label className="block text-gray-300 font-bold mb-1">Payment Proof Screenshot URL</label>
              <input
                type="url"
                value={screenshotUrl}
                onChange={(e) => setScreenshotUrl(e.target.value)}
                className="w-full bg-[#0E1017] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Submitting UTR to Admin...</span>
              ) : (
                <>
                  <FileCheck className="w-5 h-5" />
                  <span>Submit Payment Proof for Admin Approval</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
