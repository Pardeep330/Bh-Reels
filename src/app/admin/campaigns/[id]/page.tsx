"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
import {
  Megaphone,
  ArrowLeft,
  DollarSign,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  UserCheck,
  Building,
  CreditCard,
  XCircle,
} from "lucide-react";

export default function CampaignDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { getAuthHeaders } = useAuth();
  const id = params?.id as string;

  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCampaignDetails();
    }
  }, [id]);

  const fetchCampaignDetails = async () => {
    setLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch(`/api/admin/campaigns/${id}`, { headers });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Campaign details not found");
      }

      const d = await res.json();
      setCampaign(d.campaign);
    } catch (err: any) {
      setError(err.message || "Failed to load campaign");
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentAction = async (action: "approve" | "reject") => {
    setActionLoading(true);
    try {
      const headers = getAuthHeaders();
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers,
        body: JSON.stringify({
          campaignId: id,
          action,
          reason: action === "reject" ? "Payment screenshot or UTR number incomplete." : undefined,
        }),
      });

      if (res.ok) {
        fetchCampaignDetails();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setActionLoading(false);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Header title="Campaign Details" subtitle="Loading campaign metrics..." />
        <div className="glass-panel p-12 rounded-2xl text-center text-gray-400 text-xs">
          Loading campaign data from MongoDB...
        </div>
      </div>
    );
  }

  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <Header title="Campaign Details" subtitle="Brand placement view" />
        <div className="glass-panel p-12 rounded-2xl text-center space-y-4">
          <Megaphone className="w-12 h-12 text-[#D4AF37] mx-auto opacity-40" />
          <h3 className="text-lg font-bold text-white">Campaign Not Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">{error}</p>
          <Link
            href="/admin/campaigns"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Campaigns
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
          <ArrowLeft className="w-4 h-4" /> Back to Campaigns List
        </button>

        <span
          className={`px-3.5 py-1.5 rounded-full text-xs font-black uppercase border ${
            campaign.paymentStatus === "approved"
              ? "bg-emerald-950 text-emerald-400 border-emerald-500/30"
              : campaign.paymentStatus === "rejected"
              ? "bg-red-950 text-red-400 border-red-500/30"
              : "bg-amber-950 text-amber-400 border-amber-500/30"
          }`}
        >
          Payment: {campaign.paymentStatus.replace("_", " ")}
        </span>
      </div>

      {/* Main Campaign Card */}
      <div className="glass-panel rounded-3xl p-8 border border-[#D4AF37]/30 relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 w-80 h-80 bg-gold-radial pointer-events-none opacity-30" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37]">
              <Building className="w-3.5 h-3.5" /> Client: {campaign.clientName}
            </div>
            <h1 className="text-3xl font-black text-white">{campaign.title}</h1>
            <p className="text-xs text-gray-400 max-w-xl">{campaign.notes || "No special instructions attached."}</p>
          </div>

          <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 text-right space-y-1 min-w-[220px]">
            <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">Campaign Budget</span>
            <div className="text-3xl font-black text-gold-gradient">{formatCurrency(campaign.budget)}</div>
            <div className="text-[11px] text-gray-300 font-bold">{campaign.reelsCount} Instagram Reels</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#D4AF37]/15">
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Campaign Status</span>
            <div className="text-base font-black text-white capitalize mt-1">{campaign.status}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Target Category</span>
            <div className="text-base font-black text-[#D4AF37] mt-1">{campaign.targetCategory}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">Delivered Reels</span>
            <div className="text-base font-black text-white mt-1">
              {campaign.deliveredReels} / {campaign.reelsCount}
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/20">
            <span className="text-[11px] text-gray-400 font-bold uppercase">UTR Reference</span>
            <div className="text-base font-mono font-black text-[#D4AF37] mt-1">
              {campaign.utrNumber || "N/A"}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Proof Verification Panel */}
      {campaign.paymentStatus === "pending_verification" && (
        <div className="glass-panel p-6 rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-950/30 to-[#131622] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
              <AlertTriangle className="w-5 h-5" /> Payment Verification Required
            </div>
            <span className="text-xs text-gray-400">Submitted by Producer {campaign.producerName}</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-2 text-xs text-gray-300">
              <div>
                Producer Name: <span className="font-bold text-white">{campaign.producerName || "N/A"}</span>
              </div>
              <div>
                Email: <span className="font-mono text-white">{campaign.producerEmail || "N/A"}</span>
              </div>
              <div>
                Phone: <span className="font-mono text-white">{campaign.producerPhone || "N/A"}</span>
              </div>
              <div>
                UTR Transaction Code:{" "}
                <span className="font-mono text-[#D4AF37] font-extrabold">{campaign.utrNumber || "N/A"}</span>
              </div>
              {campaign.paymentScreenshot && (
                <div className="pt-2 flex items-center gap-3">
                  <img
                    src={campaign.paymentScreenshot}
                    alt="Payment Proof"
                    className="w-14 h-14 rounded-xl object-cover border border-[#D4AF37] bg-black"
                  />
                  <div>
                    <div className="font-bold text-white text-[11px]">Payment Proof Uploaded</div>
                    <a
                      href={campaign.paymentScreenshot}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D4AF37] font-bold text-[10px] hover:underline flex items-center gap-1 mt-0.5"
                    >
                      <ExternalLink className="w-3 h-3" /> View Full Screenshot
                    </a>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => handlePaymentAction("reject")}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1.5"
              >
                <XCircle className="w-4 h-4" /> Reject Payment
              </button>
              <button
                onClick={() => handlePaymentAction("approve")}
                disabled={actionLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg"
              >
                <CheckCircle2 className="w-4 h-4" /> Approve & Activate Campaign
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
