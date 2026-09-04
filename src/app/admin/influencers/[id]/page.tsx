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
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 font-semibold text-xs">
          Loading creator metrics from MongoDB...
        </div>
      </div>
    );
  }

  if (error || !influencer) {
    return (
      <div className="space-y-6">
        <Header title="Influencer Profile" subtitle="Creator details" />
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
          <Video className="w-12 h-12 text-[#B8860B] mx-auto opacity-40" />
          <h3 className="text-lg font-bold text-slate-900">Influencer Not Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">{error}</p>
          <Link
            href="/admin/influencers"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-bold text-xs"
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
          className="px-4 py-2 rounded-xl bg-white border border-slate-300 text-xs font-bold text-slate-700 flex items-center gap-2 hover:border-[#D4AF37] hover:text-[#B8860B] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Influencer Directory
        </button>

        <a
          href={influencer.instaProfileUrl}
          target="_blank"
          rel="noreferrer"
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center gap-2"
        >
          <Instagram className="w-4 h-4" /> Open Instagram Profile <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Main Profile Header Banner */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-5">
            <img
              src={influencer.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
              alt={influencer.name}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-[#D4AF37] shadow-sm"
            />
            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-black text-slate-900">{influencer.name}</h1>
                <span className="px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-bold text-[#B8860B]">
                  {influencer.category}
                </span>
              </div>
              <div className="text-sm font-mono text-[#B8860B] flex items-center gap-1.5 font-bold">
                <Instagram className="w-4 h-4" /> {influencer.instaHandle}
              </div>
              <p className="text-xs text-slate-600 font-medium max-w-xl">{influencer.bio || "Content Creator & Instagram Reel Specialist."}</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-right space-y-1 min-w-[200px]">
            <span className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">Rate Per Reel</span>
            <div className="text-2xl font-black text-gold-gradient">{formatCurrency(influencer.ratePerReel)}</div>
            <div className="text-[10px] text-emerald-700 font-bold flex items-center justify-end gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Creator Rate
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Followers</span>
            <div className="text-xl font-black text-slate-900 mt-1">{formatNumber(influencer.followersCount)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Engagement Rate</span>
            <div className="text-xl font-black text-[#B8860B] mt-1">{influencer.engagementRate || 4.8}%</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Completed Reels</span>
            <div className="text-xl font-black text-slate-900 mt-1">{influencer.totalReelsCompleted || 12} Reels</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] text-slate-500 font-bold uppercase">Average Rating</span>
            <div className="text-xl font-black text-amber-500 mt-1 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" /> {influencer.averageRating || 4.9} / 5.0
            </div>
          </div>
        </div>
      </div>

      {/* Details Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Contact & Bio Information */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-[#B8860B]" /> Contact Information
            </h3>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Mail className="w-4 h-4 text-[#B8860B]" /> Email
                </span>
                <span className="font-mono text-slate-900 font-bold">{influencer.email || "Not specified"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Phone className="w-4 h-4 text-[#B8860B]" /> Phone
                </span>
                <span className="font-mono text-slate-900 font-bold">{influencer.phone || "+91 98765 00000"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <MapPin className="w-4 h-4 text-[#B8860B]" /> Location
                </span>
                <span className="text-slate-900 font-bold">{influencer.location || "Mumbai, India"}</span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-slate-500 flex items-center gap-2 font-medium">
                  <Calendar className="w-4 h-4 text-[#B8860B]" /> Status
                </span>
                <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-bold border border-emerald-300">
                  {(influencer.status || "active").toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Assigned Marketing Campaigns */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Sparkles className="w-4 h-4 text-[#B8860B]" /> Brand Campaigns & Placements ({campaigns.length})
            </h3>

            {campaigns.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 font-medium rounded-xl bg-slate-50 border border-slate-200">
                No active campaigns assigned to this creator currently.
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between hover:border-[#D4AF37] transition-all"
                  >
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-slate-900">{c.title}</div>
                      <div className="text-[11px] text-slate-500">Client: {c.clientName}</div>
                    </div>

                    <div className="text-right space-y-1">
                      <div className="text-xs font-bold text-[#B8860B]">{formatCurrency(c.budget)}</div>
                      <Link
                        href={`/admin/campaigns/${c.id}`}
                        className="text-[11px] text-slate-600 hover:text-[#B8860B] underline font-medium"
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
