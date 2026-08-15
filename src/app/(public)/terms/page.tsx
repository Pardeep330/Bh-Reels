import React from "react";

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-xs text-gray-300">
      <h1 className="text-3xl font-black text-white">Terms & Conditions</h1>
      <p className="text-gray-400">Last updated: August 2026</p>

      <div className="glass-panel p-8 rounded-3xl space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-[#D4AF37]">1. Reel Booking Terms</h2>
        <p>
          By selecting creators and submitting payment on BH Reels, producers agree to the specified reel budget and guidelines. Campaign execution begins upon Admin UTR verification.
        </p>

        <h2 className="text-base font-bold text-[#D4AF37]">2. Payment Verification & Refunds</h2>
        <p>
          Submitted 12-digit UTR transaction numbers are verified against bank records. In case of payment rejection by Admin, refund processing or reel adjustments will be communicated directly to the producer.
        </p>

        <h2 className="text-base font-bold text-[#D4AF37]">3. Intellectual Property</h2>
        <p>
          All BH Reels branding, gold badge logos, and platform code are property of BH Team.
        </p>
      </div>
    </div>
  );
}
