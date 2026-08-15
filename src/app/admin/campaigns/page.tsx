"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
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
  ArrowRight,
} from "lucide-react";

export default function CampaignsPage() {
  const { getAuthHeaders } = useAuth();
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
      const headers = getAuthHeaders();
      const [resCmp, resInf] = await Promise.all([
        fetch("/api/admin/campaigns", { headers }),
        fetch("/api/admin/influencers", { headers }),
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
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ campaignId, action: "approve" }),
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
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          campaignId: selectedCampaign.id || selectedCampaign._id,
          action: "reject",
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
        headers: getAuthHeaders(),
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const d = await res.json();
        if (d.campaign) {
          setCampaigns((prev) => [d.campaign, ...prev]);
        }
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
    }).format(val || 0);
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

      {/* Campaign Cards Grid */}
      {loading ? (
        <div className="py-8 text-center text-xs text-gray-400">Loading campaigns from MongoDB...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <Megaphone className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Campaigns Found</h3>
          <p className="text-xs text-gray-400">Try adjusting your search filters or add a new campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((c) => {
            const isPending = c.paymentStatus === "pending_verification";

            return (
              <div
                key={c.id || c._id}
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

                    <Link href={`/admin/campaigns/${c.id || c._id}`}>
                      <h3 className="text-lg font-extrabold text-white mt-1 hover:text-[#D4AF37] transition-colors flex items-center gap-1.5">
                        {c.title} <ArrowRight className="w-4 h-4 text-[#D4AF37] opacity-60" />
                      </h3>
                    </Link>

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
                    <div className="text-xs font-mono font-extrabold text-white">{c.utrNumber || "N/A"}</div>
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

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                  <Link
                    href={`/admin/campaigns/${c.id || c._id}`}
                    className="text-xs text-[#D4AF37] font-bold hover:underline"
                  >
                    Full Campaign Details →
                  </Link>

                  {isPending ? (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCampaign(c);
                          setShowRejectModal(true);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-red-950 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject UTR
                      </button>
                      <button
                        onClick={() => handleApprovePayment(c.id || c._id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-500 text-black font-extrabold text-xs hover:bg-emerald-400 transition-all flex items-center gap-1 shadow-md"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payment
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-gray-400">
                      Status: <span className="text-white font-bold">{c.status}</span>
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Campaign Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-lg p-6 rounded-2xl border border-[#D4AF37]/40 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#D4AF37]/20">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#D4AF37]" /> Create Marketing Campaign
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Launch"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Client / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk & Threads"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Total Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="100000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold"
                >
                  Save Campaign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {showRejectModal && selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-red-500/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-500/20 text-red-400">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Reject Payment (UTR Verification)
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Please specify the reason for rejecting UTR <span className="font-mono text-[#D4AF37] font-bold">{selectedCampaign.utrNumber}</span>:
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Invalid 12-digit UTR transaction number or amount mismatch."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-[#131622] border border-red-500/30 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectPayment}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-500"
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
