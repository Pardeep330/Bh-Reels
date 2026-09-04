import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-sm text-slate-700">
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Terms & Conditions</h1>
      <p className="text-xs text-slate-500 font-medium">Last updated: August 2026</p>

      <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 rounded-3xl space-y-5 leading-relaxed">
        <h2 className="text-base font-extrabold text-[#B8860B]">1. Reel Booking Terms</h2>
        <p className="text-slate-600 font-normal">
          By selecting creators and submitting payment on BH Reels, producers agree to the specified reel budget and guidelines. Campaign execution begins upon Admin UTR verification.
        </p>

        <h2 className="text-base font-extrabold text-[#B8860B]">2. Payment Verification & Refunds</h2>
        <p className="text-slate-600 font-normal">
          Submitted 12-digit UTR transaction numbers are verified against bank records. In case of payment rejection by Admin, refund processing or reel adjustments will be communicated directly to the producer.
        </p>

        <h2 className="text-base font-extrabold text-[#B8860B]">3. Intellectual Property</h2>
        <p className="text-slate-600 font-normal">
          All BH Reels branding, gold badge logos, and platform code are property of BH Team.
        </p>
      </div>
    </div>
  );
}
