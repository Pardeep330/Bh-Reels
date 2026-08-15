"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/admin/Header";
import {
  Megaphone,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Users,
  Video,
  X,
  FileCheck,
  ShieldAlert,
} from "lucide-react";

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "pending">("all");

  const [showAddModal, setShowAddModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    clientName: "",
    budget: "100000",
    reelsCount: "4",
    targetCategory: "Fashion & Lifestyle",
    assignedInfluencers: [] as string[],
    notes: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resCmp, resInf] = await Promise.all([
        fetch("/api/admin/campaigns"),
        fetch("/api/admin/influencers"),
      ]);

      if (resCmp.ok) {
        const d = await resCmp.json();
        setCampaigns(d.campaigns || []);
      }
      if (resInf.ok) {
        const d = await resInf.json();
        setInfluencers(d.influencers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprovePayment = async (campaignId: string) => {
    try {
      const res = await fetch("/api/admin/payments/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ campaignId }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectPayment = async () => {
    if (!selectedCampaign) return;
    try {
      const res = await fetch("/api/admin/payments/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          campaignId: selectedCampaign.id,
          reason: rejectionReason,
        }),
      });

      if (res.ok) {
        setShowRejectModal(false);
        setRejectionReason("");
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setShowAddModal(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const pendingCampaigns = campaigns.filter((c) => c.paymentStatus === "pending_verification");
  const filteredCampaigns = (activeTab === "pending" ? pendingCampaigns : campaigns).filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName.toLowerCase().includes(search.toLowerCase()) ||
      (c.utrNumber && c.utrNumber.includes(search))
  );

  return (
    <div className="space-y-8">
      <Header
        title="Ada (Masuri / Ads) & Payment Review"
        subtitle="Approve producer UPI UTR payments, track campaigns & allocate influencers"
      />

      {/* Control Bar & Tabs */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, producer or 12-digit UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-1 bg-[#131622] p-1 rounded-xl border border-[#D4AF37]/20">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "all" ? "bg-[#D4AF37] text-black font-bold" : "text-gray-300 hover:text-white"
              }`}
            >
              All ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-[#D4AF37] text-black font-bold"
                  : "text-[#D4AF37] hover:bg-[#D4AF37]/10"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending UTR ({pendingCampaigns.length})</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Campaign Cards */}
      {loading ? (
        <div className="py-8 text-center text-xs text-gray-400">Loading campaigns...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <Megaphone className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Campaigns Found</h3>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((c) => {
            const isPending = c.paymentStatus === "pending_verification";

            return (
              <div
                key={c.id}
                className={`glass-panel p-6 rounded-2xl space-y-5 flex flex-col justify-between transition-all ${
                  isPending ? "border-2 border-[#D4AF37] shadow-gold-md" : "border border-[#D4AF37]/20"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#1E2230] text-[#D4AF37] uppercase">
                        {c.targetCategory}
                      </span>
                      {isPending && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-500/40 animate-pulse">
                          UTR PENDING REVIEW
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-extrabold text-white mt-1">{c.title}</h3>
                    <div className="text-xs text-gray-400">
                      Client / Producer: <span className="text-white font-bold">{c.producerName || c.clientName}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      c.paymentStatus === "approved"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : c.paymentStatus === "rejected"
                        ? "bg-red-950/80 text-red-400 border-red-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30"
                    }`}
                  >
                    {(c.paymentStatus || c.status).toUpperCase()}
                  </span>
                </div>

                {/* Budget & UTR Details */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-[#0E1017] border border-[#D4AF37]/15">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Total Budget</div>
                    <div className="text-base font-extrabold text-gold-gradient">{formatCurrency(c.budget)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">UTR Reference No.</div>
                    <div className="text-xs font-mono font-extrabold text-white">
                      {c.utrNumber || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Payment Proof Screenshot Preview if present */}
                {c.paymentScreenshot && (
                  <div className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#131622] border border-[#D4AF37]/20">
                    <span className="text-gray-400 flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#D4AF37]" /> Payment Proof Screenshot
                    </span>
                    <a
                      href={c.paymentScreenshot}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#D4AF37] font-bold hover:underline flex items-center gap-1"
                    >
                      View Proof <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Assigned Influencers List */}
                <div className="space-y-1">
                  <div className="text-xs font-bold text-gray-300 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#D4AF37]" /> Assigned Creators ({c.assignedInfluencers?.length || 0}):
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {c.assignedInfluencers && c.assignedInfluencers.length > 0 ? (
                      c.assignedInfluencers.map((infId: string) => {
                        const infObj = influencers.find((i) => i.id === infId);
                        return (
                          <span
                            key={infId}
                            className="px-2 py-0.5 rounded bg-[#131622] text-[10px] font-semibold text-white border border-[#D4AF37]/20"
                          >
                            {infObj ? infObj.name : infId}
                          </span>
                        );
                      })
                    ) : (
                      <span className="text-xs text-gray-500 italic">No creators assigned</span>
                    )}
                  </div>
                </div>

                {/* Admin Approval / Rejection Actions */}
                {isPending && (
                  <div className="pt-3 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedCampaign(c);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-950/50 hover:bg-red-900/80 border border-red-500/40 text-red-300 text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment
                    </button>

                    <button
                      onClick={() => handleApprovePayment(c.id)}
                      className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-extrabold text-xs shadow-md hover:brightness-110 transition-all flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve UTR Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Payment Reason Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-red-500/40 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-400" /> Reject UTR Payment?
            </h3>
            <p className="text-xs text-gray-400">
              Provide a rejection reason for <span className="text-white font-bold">{selectedCampaign?.title}</span>:
            </p>

            <textarea
              rows={3}
              placeholder="e.g. UTR number not found in bank statement..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-[#0E1017] border border-red-500/30 rounded-xl p-3 text-xs text-white focus:outline-none"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectPayment}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
