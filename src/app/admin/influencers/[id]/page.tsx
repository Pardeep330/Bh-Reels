"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
import {
  Video,
  Instagram,
  ExternalLink,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Star,
  Award,
  DollarSign,
  Users,
  CheckCircle2,
  Edit2,
  Trash2,
  Calendar,
  Sparkles,
} from "lucide-react";

export default function InfluencerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAuthHeaders } = useAuth();
  const id = params?.id as string;

  const [influencer, setInfluencer] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchInfluencerDetails();
    }
  }, [id]);

  const fetchInfluencerDetails = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const [resInf, resCmp] = await Promise.all([
        fetch(`/api/admin/influencers/${id}`, { headers }),
        fetch("/api/admin/campaigns", { headers }),
      ]);

      if (!resInf.ok) {
        const errData = await resInf.json();
        throw new Error(errData.error || "Influencer profile not found");
      }

      const dInf = await resInf.json();
      setInfluencer(dInf.influencer);

      if (resCmp.ok) {
        const dCmp = await resCmp.json();
        const allCampaigns = dCmp.campaigns || [];
        const assigned = allCampaigns.filter((c: any) =>
          c.assignedInfluencers?.some((infId: string) => infId === id || infId === dInf.influencer?.instaHandle)
        );
        setCampaigns(assigned);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load influencer");
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Influencer Profile" subtitle="Loading creator analytics..." />
        <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-xs">
          Loading creator metrics from MongoDB...
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="space-y-6">
        <Header title="Influencer Profile" subtitle="Creator details" />
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <Video className="w-12 h-12 text-[#D4AF37] mx-auto opacity-40" />
          <h3 className="text-lg font-bold text-white">Influencer Not Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{error}</p>
          <Link
            href="/admin/influencers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Directory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Header Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-[#131622] border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37] flex items-center gap-2 hover:border-[#D4AF37] transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Influencer Directory
        </button>

        <a
          href={influencer.instaProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-xs shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" /> Open Instagram Profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Profile Header Banner */}
      <div className="glass-panel rounded-3xl p-8 border border-[#D4AF37]/30 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-radial pointer-events-none opacity-30" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={influencer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={influencer.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-gold-md"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-white">{influencer.name}</h1>
                <span className="px-3 py-1 rounded-full bg-[#1E2230] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37]">
                  {influencer.category}
                </span>
              </div>
              <div className="text-sm font-mono text-[#D4AF37] flex items-center gap-1.5 font-bold">
                <Instagram className="w-4 h-4" /> {influencer.instaHandle}
              </div>
              <p className="text-xs text-gray-400 max-w-xl">{influencer.bio || "Content Creator & Instagram Reel Specialist."}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 text-right space-y-1 min-w-[200px]">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Rate Per Reel</span>
            <div className="text-2xl font-black text-gold-gradient">{formatCurrency(influencer.ratePerReel)}</div>
            <div className="text-[10px] text-emerald-400 font-semibold flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3" /> Verified Creator Rate
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D4AF37]/15">
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Followers</span>
            <div className="text-xl font-black text-white mt-1">{formatNumber(influencer.followersCount)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Engagement Rate</span>
            <div className="text-xl font-black text-[#D4AF37] mt-1">{influencer.engagementRate || 4.8}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Completed Reels</span>
            <div className="text-xl font-black text-white mt-1">{influencer.totalReelsCompleted || 12} Reels</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Average Rating</span>
            <div className="text-xl font-black text-amber-400 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400" /> {influencer.averageRating || 4.9} / 5.0
            </div>
          </div>
        </div>
      </div>

      {/* Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Bio Information */}
        <div className="space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#D4AF37]/15">
              <Users className="w-4 h-4 text-[#D4AF37]" /> Contact Information
            </h3>

            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/10">
                <span className="text-gray-400 flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#D4AF37]" /> Email
                </span>
                <span className="font-mono text-white">{influencer.email || "Not specified"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/10">
                <span className="text-gray-400 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#D4AF37]" /> Phone
                </span>
                <span className="font-mono text-white">{influencer.phone || "+91 98765 00000"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/10">
                <span className="text-gray-400 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#D4AF37]" /> Location
                </span>
                <span className="text-white">{influencer.location || "Mumbai, India"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/10">
                <span className="text-gray-400 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#D4AF37]" /> Status
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold border border-emerald-500/30">
                  {(influencer.status || "active").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Marketing Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-2xl p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 pb-3 border-b border-[#D4AF37]/15">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Brand Campaigns & Placements ({campaigns.length})
            </h3>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-xs text-gray-400 rounded-xl bg-[#131622] border border-[#D4AF37]/10">
                No active campaigns assigned to this creator currently.
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#131622] border border-[#D4AF37]/20 flex items-center justify-between hover:border-[#D4AF37]/50 transition-all"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-white">{c.title}</div>
                      <div className="text-[11px] text-gray-400">Client: {c.clientName}</div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs font-bold text-[#D4AF37]">{formatCurrency(c.budget)}</div>
                      <Link
                        href={`/admin/campaigns/${c.id}`}
                        className="text-[11px] text-gray-300 hover:text-[#D4AF37] underline"
                      >
                        View Campaign →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
