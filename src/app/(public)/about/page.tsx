import React from "react";
import { BHLogo } from "@/components/common/BHLogo";
import { ShieldCheck, Award, Users, TrendingUp, Sparkles } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
      <div className="text-center space-y-3">
        <BHLogo size="lg" />
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-4">
          About <span className="text-gold-gradient">BH Reels</span>
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed">
          BH Reels (by BH Team) is India's leading influencer marketing and reel distribution network built specifically for film producers, record labels, and high-growth brands.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <Users className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Top Influencer Roster</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Handpicked creators across Tech, Fashion, Fitness, Food, Skits, Beauty & Entertainment with verified engagement rates.
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Verified UPI Payments</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Every booking is backed by 12-digit UPI UTR transaction reference verification and Admin quality approval.
          </p>
        </div>

        <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-3xl space-y-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mx-auto">
            <TrendingUp className="w-6 h-6" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-base">Guaranteed Reach</h3>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Combine multiple top influencers into single campaigns to generate viral movie song audio tracks and brand visibility.
          </p>
        </div>
      </div>
    </div>
  );
}
