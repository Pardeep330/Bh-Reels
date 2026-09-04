import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-6 text-sm text-slate-700">
      <h1 className="text-3xl sm:text-4xl font-black text-slate-900">Privacy Policy</h1>
      <p className="text-xs text-slate-500 font-medium">Last updated: August 2026</p>

      <div className="bg-white border border-slate-200 shadow-sm p-6 sm:p-8 rounded-3xl space-y-5 leading-relaxed">
        <h2 className="text-base font-extrabold text-[#B8860B]">1. Information We Collect</h2>
        <p className="text-slate-600 font-normal">
          At BH Reels (BH Team), we collect producer contact information (Name, Email, Phone), UPI UTR reference numbers, and campaign specifications strictly to process reel bookings and verify payments.
        </p>

        <h2 className="text-base font-extrabold text-[#B8860B]">2. Payment & UTR Verification</h2>
        <p className="text-slate-600 font-normal">
          All payments are processed using UPI QR codes. UTR transaction numbers and payment proof screenshots submitted by producers are securely verified by our Admin team and stored with SSL encryption.
        </p>

        <h2 className="text-base font-extrabold text-[#B8860B]">3. Creator Data Rights</h2>
        <p className="text-slate-600 font-normal">
          Influencers listed on BH Reels have consented to showcase their public Instagram handles, follower counts, and reel rates for producer campaign matching.
        </p>
      </div>
    </div>
  );
}
