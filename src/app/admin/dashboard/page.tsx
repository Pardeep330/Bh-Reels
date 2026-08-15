"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
import {
  Video,
  Users,
  Megaphone,
  TrendingUp,
  DollarSign,
  Plus,
  ExternalLink,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const { getAuthHeaders } = useAuth();
  const [stats, setStats] = useState({
    totalInfluencers: 0,
    totalUsers: 0,
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalReach: 0,
    avgReelRate: 0,
    totalBudget: 0,
  });

  const [influencers, setInfluencers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const headers = getAuthHeaders();
      const [resStats, resInf, resCmp] = await Promise.all([
        fetch("/api/admin/stats", { headers }),
        fetch("/api/admin/influencers", { headers }),
        fetch("/api/admin/campaigns", { headers }),
      ]);

      if (resStats.ok) {
        const d = await resStats.json();
        if (d.stats) setStats(d.stats);
      }
      if (resInf.ok) {
        const d = await resInf.json();
        setInfluencers(d.influencers || []);
      }
      if (resCmp.ok) {
        const d = await resCmp.json();
        setCampaigns(d.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <Header
        title="Admin Overview"
        subtitle="BH Reels platform analytics, influencer performance & campaign management"
      />

      {/* Top Banner Alert */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#181B2B] via-[#131622] to-[#0E1017] p-6 border border-[#D4AF37]/30 shadow-2xl">
        <div className="absolute -right-10 -bottom-10 w-60 h-60 bg-gold-radial pointer-events-none opacity-40" />
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5" /> Welcome to BH Reels Admin
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              Manage Influencers, Track Reel Rates & Control Campaigns
            </h2>
            <p className="text-xs text-gray-400 max-w-2xl">
              Add new content creators, set rate per reel, track Instagram profile metrics, and oversee active marketing campaigns in real-time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/influencers"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Influencer
            </Link>
            <Link
              href="/admin/campaigns"
              className="px-5 py-2.5 rounded-xl bg-[#181B2B] border border-[#D4AF37]/30 text-white font-semibold text-xs hover:border-[#D4AF37] transition-all flex items-center gap-2"
            >
              <Megaphone className="w-4 h-4 text-[#D4AF37]" /> Create Campaign
            </Link>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Influencers */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Total Influencers</span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Video className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.totalInfluencers}</span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5" /> +100%
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Active content creators on platform</p>
        </div>

        {/* Average Reel Rate */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Avg Rate / Reel</span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-gold-gradient">
              {formatCurrency(stats.avgReelRate)}
            </span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Calculated across registered influencers</p>
        </div>

        {/* Total Reach */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Combined Reach</span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{formatNumber(stats.totalReach)}</span>
            <span className="text-xs text-gray-400">Followers</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Instagram combined audience</p>
        </div>

        {/* Active Campaigns */}
        <div className="glass-panel glass-panel-hover rounded-2xl p-6 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Campaigns</span>
            <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37]">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-3xl font-black text-white">{stats.activeCampaigns}</span>
            <span className="text-xs text-[#D4AF37] font-semibold">({formatCurrency(stats.totalBudget)})</span>
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Ongoing brand ads & reel placements</p>
        </div>
      </div>

      {/* Main Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Influencers Quick Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/15">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#D4AF37]" /> Registered Influencers
                </h3>
                <p className="text-xs text-gray-400">Direct rates, follower metrics and Instagram profiles</p>
              </div>
              <Link
                href="/admin/influencers"
                className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
              >
                View All ({influencers.length}) <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Influencer Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-[#D4AF37]/10 text-gray-400 uppercase font-semibold">
                    <th className="py-3 px-2">Influencer</th>
                    <th className="py-3 px-2">Insta Handle</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Rate / Reel</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {influencers.slice(0, 5).map((inf) => (
                    <tr key={inf.id} className="hover:bg-[#181B2B]/60 transition-colors">
                      <td className="py-3.5 px-2">
                        <div className="flex items-center gap-3">
                          <img
                            src={inf.avatar}
                            alt={inf.name}
                            className="w-8 h-8 rounded-full object-cover border border-[#D4AF37]"
                          />
                          <div>
                            <div className="font-bold text-white">{inf.name}</div>
                            <div className="text-[10px] text-gray-400">{formatNumber(inf.followersCount)} followers</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-2 font-mono text-[#D4AF37]">{inf.instaHandle}</td>
                      <td className="py-3.5 px-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#1E2230] text-gray-300 font-medium">
                          {inf.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-2 font-bold text-white">{formatCurrency(inf.ratePerReel)}</td>
                      <td className="py-3.5 px-2 text-right">
                        <a
                          href={inf.instaProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 text-[11px] font-semibold text-[#D4AF37] transition-all"
                        >
                          Profile <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Active Campaigns & Platform Info */}
        <div className="space-y-6">
          {/* Active Campaigns Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/15">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-[#D4AF37]" /> Active Campaigns
              </h3>
              <Link href="/admin/campaigns" className="text-xs text-[#D4AF37] hover:underline">
                Manage
              </Link>
            </div>

            <div className="space-y-3">
              {campaigns.map((cmp) => (
                <div
                  key={cmp.id}
                  className="p-3.5 rounded-xl bg-[#131622] border border-[#D4AF37]/20 space-y-2 hover:border-[#D4AF37]/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-xs font-bold text-white">{cmp.title}</div>
                      <div className="text-[11px] text-gray-400">{cmp.clientName}</div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/30">
                      {cmp.status.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-gray-400">{cmp.reelsCount} Reels requested</span>
                    <span className="font-bold text-[#D4AF37]">{formatCurrency(cmp.budget)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Platform Security Badge Card */}
          <div className="glass-panel rounded-2xl p-6 space-y-3 bg-gradient-to-br from-[#131622] to-[#1E2230]">
            <div className="flex items-center gap-2 text-xs font-bold text-[#D4AF37]">
              <ShieldCheck className="w-4 h-4" /> 2-Factor Authentication Enabled
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Your BH Reels Admin account is protected with 2-Step OTP verification during sign in. You can update your security settings or password anytime in your Profile.
            </p>
            <Link
              href="/admin/profile"
              className="inline-block text-xs font-bold text-white hover:text-[#D4AF37] underline"
            >
              Go to Profile Settings →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
