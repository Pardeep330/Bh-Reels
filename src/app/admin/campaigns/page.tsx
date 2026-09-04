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
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by title, producer or 12-digit UTR..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
            />
          </div>

          {/* Tab Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === "all" ? "bg-[#D4AF37] text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All ({campaigns.length})
            </button>
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-[#D4AF37] text-white shadow-sm"
                  : "text-[#B8860B] hover:bg-slate-200"
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending UTR ({pendingCampaigns.length})</span>
            </button>
          </div>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create Campaign
        </button>
      </div>

      {/* Campaign Cards Grid */}
      {loading ? (
        <div className="py-8 text-center text-xs text-slate-500 font-semibold">Loading campaigns from MongoDB...</div>
      ) : filteredCampaigns.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <Megaphone className="w-12 h-12 text-[#B8860B] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900">No Campaigns Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search filters or add a new campaign.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCampaigns.map((c) => {
            const isPending = c.paymentStatus === "pending_verification";

            return (
              <div
                key={c.id || c._id}
                className={`bg-white p-6 rounded-2xl space-y-5 flex flex-col justify-between transition-all border shadow-sm hover:shadow-md ${
                  isPending ? "border-amber-400 ring-2 ring-amber-100" : "border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[#B8860B] uppercase">
                        {c.targetCategory}
                      </span>
                      {isPending && (
                        <span className="text-[10px] font-extrabold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-300 animate-pulse">
                          UTR PENDING REVIEW
                        </span>
                      )}
                    </div>

                    <Link href={`/admin/campaigns/${c.id || c._id}`}>
                      <h3 className="text-lg font-extrabold text-slate-900 mt-1 hover:text-[#B8860B] transition-colors flex items-center gap-1.5">
                        {c.title} <ArrowRight className="w-4 h-4 text-[#B8860B] opacity-60" />
                      </h3>
                    </Link>

                    <div className="text-xs text-slate-600 font-medium">
                      Client / Producer: <span className="text-slate-900 font-bold">{c.producerName || c.clientName}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
                      c.paymentStatus === "approved"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : c.paymentStatus === "rejected"
                        ? "bg-red-50 text-red-800 border-red-300"
                        : "bg-amber-50 text-amber-900 border-amber-300"
                    }`}
                  >
                    {(c.paymentStatus || c.status).toUpperCase()}
                  </span>
                </div>

                {/* Budget & UTR Details */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Total Budget</div>
                    <div className="text-base font-extrabold text-gold-gradient">{formatCurrency(c.budget)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">UTR Reference No.</div>
                    <div className="text-xs font-mono font-extrabold text-slate-900">{c.utrNumber || "N/A"}</div>
                  </div>
                </div>

                {/* Payment Proof Screenshot Preview if present */}
                {c.paymentScreenshot && (
                  <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-slate-600 font-medium flex items-center gap-1.5">
                      <FileCheck className="w-4 h-4 text-[#B8860B]" /> Payment Proof Screenshot
                    </span>
                    <a
                      href={c.paymentScreenshot}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#B8860B] font-bold hover:underline flex items-center gap-1"
                    >
                      View Proof <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Footer Action Bar */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/admin/campaigns/${c.id || c._id}`}
                    className="text-xs text-[#B8860B] font-bold hover:underline"
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
                        className="px-3 py-1.5 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject UTR
                      </button>
                      <button
                        onClick={() => handleApprovePayment(c.id || c._id)}
                        className="px-3.5 py-1.5 rounded-lg bg-emerald-600 text-white font-extrabold text-xs hover:bg-emerald-700 transition-all flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Approve Payment
                      </button>
                    </div>
                  ) : (
                    <span className="text-[11px] text-slate-500 font-medium">
                      Status: <span className="text-slate-900 font-bold">{c.status}</span>
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#B8860B]" /> Create Marketing Campaign
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Campaign Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Diwali Festive Launch"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Client / Brand Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Silk & Threads"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Total Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="100000"
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-100 text-red-600">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Reject Payment (UTR Verification)
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Please specify the reason for rejecting UTR <span className="font-mono text-[#B8860B] font-bold">{selectedCampaign.utrNumber}</span>:
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Invalid 12-digit UTR transaction number or amount mismatch."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full bg-slate-50 border border-red-300 rounded-xl p-3 text-xs text-slate-900 focus:outline-none focus:bg-white focus:border-red-500"
            />

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowRejectModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectPayment}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shadow-sm"
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
