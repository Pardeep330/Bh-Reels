import React from "react";

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6 text-xs text-gray-300">
      <h1 className="text-3xl font-black text-white">Privacy Policy</h1>
      <p className="text-gray-400">Last updated: August 2026</p>

      <div className="glass-panel p-8 rounded-3xl space-y-4 leading-relaxed">
        <h2 className="text-base font-bold text-[#D4AF37]">1. Information We Collect</h2>
        <p>
          At BH Reels (BH Team), we collect producer contact information (Name, Email, Phone), UPI UTR reference numbers, and campaign specifications strictly to process reel bookings and verify payments.
        </p>

        <h2 className="text-base font-bold text-[#D4AF37]">2. Payment & UTR Verification</h2>
        <p>
          All payments are processed using UPI QR codes. UTR transaction numbers and payment proof screenshots submitted by producers are securely verified by our Admin team and stored with SSL encryption.
        </p>

        <h2 className="text-base font-bold text-[#D4AF37]">3. Creator Data Rights</h2>
        <p>
          Influencers listed on BH Reels have consented to showcase their public Instagram handles, follower counts, and reel rates for producer campaign matching.
        </p>
      </div>
    </div>
  );
}
