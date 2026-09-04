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
  Loader2,
  Image as ImageIcon,
  X,
  Eye,
} from "lucide-react";

export default function PaymentPage() {
  const router = useRouter();
  const [bookingDraft, setBookingDraft] = useState<any>(null);
  const [utrNumber, setUtrNumber] = useState("");
  const [screenshotUrl, setScreenshotUrl] = useState("");
  const [uploading, setUploading] = useState(false);
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

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setError("File size exceeds 10MB. Please select a smaller screenshot.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to upload image");
      }

      setScreenshotUrl(data.url);
    } catch (err: any) {
      setError(err.message || "Failed to upload screenshot");
    } finally {
      setUploading(false);
    }
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
        title: bookingDraft?.projectTitle || `${bookingDraft?.producerName || "Producer"}'s Reel Campaign`,
        clientName: bookingDraft?.producerName || "Producer",
        producerName: bookingDraft?.producerName,
        producerEmail: bookingDraft?.producerEmail,
        producerPhone: bookingDraft?.producerPhone,
        budget: bookingDraft?.totalEstimatedPrice || 40000,
        reelsCount: bookingDraft?.totalReelsCount || 2,
        assignedInfluencers: bookingDraft?.selectedIds || [],
        selectedCreators: bookingDraft?.selectedCreators || [],
        selectedMap: bookingDraft?.selectedMap || {},
        utrNumber: utrNumber.trim(),
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
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-full bg-emerald-50 border-2 border-emerald-300 flex items-center justify-center text-emerald-600 mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-slate-900">Payment UTR &amp; Proof Submitted!</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            Your 12-digit UTR <span className="font-mono text-[#B8860B] font-bold">"{utrNumber}"</span> and screenshot have been received and sent to the BH Reels Admin team for verification.
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl text-left space-y-3 text-xs">
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-semibold">Payment Status:</span>
            <span className="font-extrabold text-[#B8860B] flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              PENDING ADMIN APPROVAL
            </span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-semibold">Producer Name:</span>
            <span className="font-bold text-slate-900">{bookingDraft?.producerName || "Producer"}</span>
          </div>
          <div className="flex justify-between border-b border-slate-100 pb-2">
            <span className="text-slate-500 font-semibold">Total Payable:</span>
            <span className="font-extrabold text-gold-gradient text-sm">
              {formatCurrency(bookingDraft?.totalEstimatedPrice || 40000)}
            </span>
          </div>
          {screenshotUrl && (
            <div className="flex justify-between items-center pt-1">
              <span className="text-slate-500 font-semibold">Payment Proof:</span>
              <a
                href={screenshotUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#B8860B] font-bold hover:underline flex items-center gap-1"
              >
                <Eye className="w-3.5 h-3.5" /> View Uploaded Screenshot
              </a>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-4 pt-2">
          <Link
            href="/user/profile"
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all"
          >
            Track Status in Portal
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition-all"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button & Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1 font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Estimator
        </button>

        <span className="text-xs text-[#B8860B] font-bold flex items-center gap-1">
          <ShieldCheck className="w-4 h-4" /> 256-Bit SSL Encrypted Payment
        </span>
      </div>

      <div className="text-center space-y-2">
        <h1 className="text-3xl font-black text-slate-900">
          Scan UPI &amp; Submit <span className="text-gold-gradient">UTR Reference</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 font-medium">
          Complete payment using Google Pay, PhonePe, Paytm or any BHIM UPI app
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Payment Split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        {/* Left Column: QR Code Scanner & UPI Details */}
        <div className="bg-white p-6 rounded-3xl space-y-6 text-center border-2 border-[#D4AF37]/30 shadow-sm">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-900">
            <QrCode className="w-3.5 h-3.5 text-amber-600" /> Official BH Reels Payment Gateway
          </div>

          {/* QR Code Scanner Display */}
          <div className="relative w-56 h-56 mx-auto bg-slate-50 p-4 rounded-2xl shadow-sm flex flex-col items-center justify-center border-4 border-[#D4AF37]">
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900">
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
          </div>

          {/* UPI ID Copy Bar */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Official UPI ID</div>
            <div className="flex items-center justify-center gap-2">
              <span className="font-mono text-base font-extrabold text-[#B8860B]">{upiId}</span>
              <button
                type="button"
                onClick={copyUpi}
                className="p-1.5 rounded-lg bg-white text-slate-700 hover:text-slate-900 border border-slate-300 shadow-sm transition-colors"
                title="Copy UPI ID"
              >
                {copiedUpi ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
              </button>
            </div>
          </div>

          <div className="text-xs text-slate-500 font-semibold flex items-center justify-center gap-3">
            <span>Google Pay</span> • <span>PhonePe</span> • <span>Paytm</span> • <span>BHIM</span>
          </div>
        </div>

        {/* Right Column: UTR Input & Summary Form */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl space-y-6 border border-slate-200 shadow-sm">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900">Payment Summary</h3>
            <span className="text-sm font-black text-gold-gradient">
              {formatCurrency(bookingDraft?.totalEstimatedPrice || 40000)}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Producer Name:</span>
              <span className="font-bold text-slate-900">{bookingDraft?.producerName || "Producer"}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Selected Creators:</span>
              <span className="font-bold text-[#B8860B]">{bookingDraft?.selectedIds?.length || 2} Creators</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span className="font-medium">Reels Requested:</span>
              <span className="font-bold text-slate-900">{bookingDraft?.totalReelsCount || 2} Reels</span>
            </div>
          </div>

          {/* UTR & Screenshot Upload Form */}
          <form onSubmit={handlePaymentSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-700 font-bold mb-1.5">
                Enter 12-Digit UPI UTR / Ref No. *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 918273645012"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-slate-900 font-mono text-base font-bold placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
              <p className="text-[11px] text-slate-500 mt-1 font-medium">
                You can find the 12-digit UTR / Ref No. in your UPI app transaction history details.
              </p>
            </div>

            {/* Payment Proof Screenshot Upload */}
            <div>
              <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                <span>Upload Payment Proof Screenshot</span>
                <span className="text-[10px] font-normal text-slate-500">PNG, JPG up to 10MB</span>
              </label>

              {screenshotUrl ? (
                /* Uploaded Preview State */
                <div className="relative rounded-2xl border border-slate-200 bg-slate-50 p-3 flex items-center gap-3">
                  <img
                    src={screenshotUrl}
                    alt="Payment Proof"
                    className="w-16 h-16 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                      <span>Screenshot Uploaded</span>
                    </div>
                    <p className="text-[10px] text-slate-500 truncate mt-0.5">{screenshotUrl}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setScreenshotUrl("")}
                    className="w-7 h-7 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 flex items-center justify-center transition-colors"
                    title="Remove Screenshot"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                /* Upload Dropzone */
                <label className="relative border-2 border-dashed border-slate-300 hover:border-[#D4AF37] rounded-2xl p-4 bg-slate-50 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all hover:bg-slate-100">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    disabled={uploading}
                  />
                  {uploading ? (
                    <div className="flex flex-col items-center gap-2 py-2 text-center">
                      <Loader2 className="w-6 h-6 text-[#B8860B] animate-spin" />
                      <span className="text-xs text-slate-700 font-semibold">Uploading payment proof...</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-1.5 py-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B8860B]">
                        <Upload className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-800">Click or drag screenshot to upload</span>
                      <span className="text-[10px] text-slate-500">Google Pay / PhonePe / Paytm receipt screenshot</span>
                    </div>
                  )}
                </label>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || uploading}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-sm shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
