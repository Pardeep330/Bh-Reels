"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  Calculator,
  CheckCircle2,
  Clock,
  XCircle,
  Video,
  FileCheck,
  Building,
  User,
  Mail,
  Phone,
  ArrowRight,
  ExternalLink,
  ShieldCheck,
  Eye,
  RefreshCw,
  Search,
  AlertCircle,
  Instagram,
} from "lucide-react";

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null);

  useEffect(() => {
    const savedPublicUser = localStorage.getItem("bh_public_user");
    const savedAuthUser = localStorage.getItem("bh_auth_user");

    let currentUser = null;
    if (savedPublicUser) {
      try {
        currentUser = JSON.parse(savedPublicUser);
      } catch (e) {}
    } else if (savedAuthUser) {
      try {
        currentUser = JSON.parse(savedAuthUser);
      } catch (e) {}
    }

    if (currentUser) {
      setUser(currentUser);
      fetchUserCampaigns(currentUser.email || currentUser.phone || "");
    } else {
      fetchUserCampaigns("");
    }
  }, []);

  const fetchUserCampaigns = async (identifier: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (identifier && identifier.includes("@")) {
        params.append("email", identifier);
      } else if (identifier) {
        params.append("phone", identifier);
      }

      const res = await fetch(`/api/public/my-campaigns?${params.toString()}`);
      if (res.ok) {
        const d = await res.json();
        setCampaigns(d.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  const approvedCampaigns = campaigns.filter((c) => c.paymentStatus === "approved");
  const pendingCampaigns = campaigns.filter((c) => c.paymentStatus === "pending_verification");
  const rejectedCampaigns = campaigns.filter((c) => c.paymentStatus === "rejected");

  const filtered = campaigns.filter((c) => {
    const matchesSearch =
      c.title?.toLowerCase().includes(search.toLowerCase()) ||
      c.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      (c.utrNumber && c.utrNumber.includes(search));
    const matchesStatus =
      selectedStatus === "All" ||
      (selectedStatus === "approved" && c.paymentStatus === "approved") ||
      (selectedStatus === "pending" && c.paymentStatus === "pending_verification") ||
      (selectedStatus === "rejected" && c.paymentStatus === "rejected");
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* ── Profile Header ─────────────────── */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-amber-50 border-2 border-[#D4AF37] flex items-center justify-center text-[#B8860B] font-black text-2xl shadow-sm shrink-0">
              {user?.avatar ? (
                <img src={user.avatar} alt="" className="w-full h-full object-cover rounded-2xl" />
              ) : (
                <Building className="w-8 h-8" />
              )}
            </div>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-extrabold text-[#B8860B] uppercase">
                <ShieldCheck className="w-3 h-3" /> Producer &amp; Client Portal
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
                {user?.name || "Producer Dashboard"}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 font-medium">
                {user?.email && <span className="flex items-center gap-1">✉️ {user.email}</span>}
                {user?.phone && <span className="flex items-center gap-1">📞 {user.phone}</span>}
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchUserCampaigns(user?.email || "")}
              className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 hover:text-slate-900 hover:border-[#D4AF37] transition-all"
              title="Refresh Campaigns"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </button>
            <Link
              href="/select-influencers"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center gap-1.5"
            >
              <Calculator className="w-4 h-4" />
              <span>Book New Campaign</span>
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 pt-6 border-t border-slate-100 text-center">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xl sm:text-2xl font-black text-slate-900">{campaigns.length}</div>
            <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Total Requests</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <div className="text-xl sm:text-2xl font-black text-emerald-700">{approvedCampaigns.length}</div>
            <div className="text-[10px] text-emerald-800 font-bold uppercase mt-0.5">Approved &amp; Active</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
            <div className="text-xl sm:text-2xl font-black text-amber-800">{pendingCampaigns.length}</div>
            <div className="text-[10px] text-amber-900 font-bold uppercase mt-0.5">Pending Review</div>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="text-xl sm:text-2xl font-black text-gold-gradient">
              {formatCurrency(campaigns.reduce((sum, c) => sum + (c.budget || 0), 0))}
            </div>
            <div className="text-[10px] text-slate-500 font-bold uppercase mt-0.5">Total Value</div>
          </div>
        </div>
      </div>

      {/* ── Campaigns Section ──────────────────────── */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#B8860B]" /> My Reel Campaigns &amp; Requests
            </h2>
            <p className="text-xs text-slate-600 font-medium mt-0.5">
              Live status updates for your booked campaigns &amp; verified UTR payments
            </p>
          </div>

          {/* Search and Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search campaign, UTR..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-white border border-slate-200 rounded-xl pl-8 pr-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-slate-200 text-xs font-semibold shadow-sm">
              {["All", "approved", "pending", "rejected"].map((st) => (
                <button
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-lg transition-all capitalize ${
                    selectedStatus === st
                      ? "bg-[#D4AF37] text-white font-extrabold shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="py-16 text-center text-xs text-slate-500 font-semibold flex flex-col items-center gap-3">
            <RefreshCw className="w-6 h-6 text-[#B8860B] animate-spin" />
            <span>Loading your campaigns from database...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl text-center space-y-4 border border-slate-200 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-[#B8860B] mx-auto">
              <FileCheck className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-slate-900">No Campaigns Found</h3>
              <p className="text-xs text-slate-600 font-medium max-w-md mx-auto">
                {search
                  ? "No campaigns matched your search filter."
                  : "You haven't submitted any influencer campaigns yet. Calculate total package estimate and submit via UPI."}
              </p>
            </div>
            <Link
              href="/select-influencers"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all"
            >
              <Calculator className="w-4 h-4" /> Start Package Estimation
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((cmp) => {
              const isApproved = cmp.paymentStatus === "approved";
              const isPending = cmp.paymentStatus === "pending_verification";
              const isRejected = cmp.paymentStatus === "rejected";

              return (
                <div
                  key={cmp.id || cmp._id}
                  className={`bg-white p-6 rounded-3xl space-y-4 flex flex-col justify-between border transition-all duration-200 shadow-sm hover:shadow-md ${
                    isApproved
                      ? "border-emerald-300"
                      : isPending
                      ? "border-amber-300"
                      : "border-red-300"
                  }`}
                >
                  {/* Status & Title Header */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] text-slate-500 font-bold font-mono">
                        ID: {(cmp.id || cmp._id).substring(0, 8)}...
                      </span>

                      <span
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                          isApproved
                            ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                            : isRejected
                            ? "bg-red-50 text-red-800 border-red-300"
                            : "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
                        }`}
                      >
                        {isApproved && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                        {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                        {isRejected && <XCircle className="w-3 h-3 text-red-600" />}
                        {isApproved
                          ? "Approved & Active"
                          : isPending
                          ? "Pending Verification"
                          : "Verification Rejected"}
                      </span>
                    </div>

                    <h3 className="text-base font-black text-slate-900 leading-snug line-clamp-2">
                      {cmp.title}
                    </h3>
                  </div>

                  {/* Pricing & Reel Metrics */}
                  <div className="grid grid-cols-2 gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Total Budget</div>
                      <div className="text-base font-black text-gold-gradient">{formatCurrency(cmp.budget)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500 font-bold uppercase">Reels &amp; Creators</div>
                      <div className="text-sm font-black text-slate-900">
                        {cmp.reelsCount || 1} R • {(cmp.assignedInfluencers || []).length} Creators
                      </div>
                    </div>
                  </div>

                  {/* UTR & Payment Proof Info */}
                  <div className="space-y-2 text-xs">
                    {cmp.utrNumber && (
                      <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-600 font-semibold">12-Digit UTR:</span>
                        <span className="font-mono text-[#B8860B] font-bold">{cmp.utrNumber}</span>
                      </div>
                    )}

                    {cmp.paymentScreenshot && (
                      <div className="flex items-center justify-between text-[11px] p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                        <span className="text-slate-600 font-semibold">Payment Proof:</span>
                        <button
                          type="button"
                          onClick={() => setSelectedScreenshot(cmp.paymentScreenshot)}
                          className="text-[#B8860B] font-bold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" /> View Uploaded Image
                        </button>
                      </div>
                    )}

                    {isRejected && cmp.rejectionReason && (
                      <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-[11px] text-red-800 font-medium">
                        <span className="font-bold">Reason:</span> {cmp.rejectionReason}
                      </div>
                    )}
                  </div>

                  {/* Card Footer */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                    <span>
                      {cmp.createdAt ? new Date(cmp.createdAt).toLocaleDateString("en-IN") : "Recent"}
                    </span>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedCampaign(cmp)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[#B8860B] font-bold text-xs flex items-center gap-1 transition-all"
                      >
                        <Sparkles className="w-3 h-3" /> View Details
                      </button>

                      {isApproved ? (
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Live
                        </span>
                      ) : isRejected ? (
                        <Link
                          href="/payment"
                          className="text-red-600 font-bold hover:underline flex items-center gap-1"
                        >
                          Re-Submit UTR <ArrowRight className="w-3 h-3" />
                        </Link>
                      ) : (
                        <span className="text-amber-800 font-semibold">Under Review</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Details Modal ────────────────── */}
      {selectedCampaign && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                  selectedCampaign.paymentStatus === "approved"
                    ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                    : selectedCampaign.paymentStatus === "rejected"
                    ? "bg-red-50 text-red-800 border-red-300"
                    : "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
                }`}>
                  {selectedCampaign.paymentStatus === "approved"
                    ? "✓ Approved & Active"
                    : selectedCampaign.paymentStatus === "rejected"
                    ? "✕ Verification Rejected"
                    : "⏳ Under Admin Review"}
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">{selectedCampaign.title}</h2>
              </div>
              <button
                onClick={() => setSelectedCampaign(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            {/* Total Budget & UTR */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">Package Total Price</div>
                <div className="text-2xl font-black text-gold-gradient">{formatCurrency(selectedCampaign.budget)}</div>
                <div className="text-[10px] text-slate-500 font-medium">{selectedCampaign.reelsCount || 1} Total Instagram Reels</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] text-slate-500 font-bold uppercase">12-Digit UTR Transaction Code</div>
                <div className="text-base font-mono font-black text-[#B8860B]">{selectedCampaign.utrNumber || "N/A"}</div>
                <div className="text-[10px] text-slate-500 font-medium">
                  {selectedCampaign.paymentStatus === "approved" ? "Payment verified by Admin" : "Awaiting bank verification"}
                </div>
              </div>
            </div>

            {/* Selected Creators Breakdown */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-[#B8860B]" /> Creators in this Campaign ({selectedCampaign.selectedCreators?.length || selectedCampaign.assignedInfluencers?.length || 0})
              </h3>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(selectedCampaign.selectedCreators && selectedCampaign.selectedCreators.length > 0) ? (
                  selectedCampaign.selectedCreators.map((c: any, idx: number) => (
                    <div
                      key={c.id || idx}
                      className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37] shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-slate-900">{c.name}</div>
                          <div className="text-[10px] text-[#B8860B] font-mono flex items-center gap-1.5 font-bold">
                            <Instagram className="w-2.5 h-2.5" /> {c.instaHandle}
                            {c.category && <span className="text-slate-500 font-normal">• {c.category}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#B8860B] font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 shadow-sm">
                          {c.reelCount || 1} Reel{c.reelCount > 1 ? "s" : ""}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 italic">
                    Creators: {(selectedCampaign.assignedInfluencers || []).join(", ") || "General Package"}
                  </div>
                )}
              </div>
            </div>

            {/* Rejection notice if rejected */}
            {selectedCampaign.paymentStatus === "rejected" && selectedCampaign.rejectionReason && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 space-y-1">
                <div className="font-bold text-red-900 flex items-center gap-1.5">
                  <XCircle className="w-4 h-4 text-red-600" /> Admin Rejection Reason:
                </div>
                <p className="leading-relaxed font-medium">{selectedCampaign.rejectionReason}</p>
                <div className="pt-2">
                  <Link
                    href="/payment"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-sm"
                  >
                    Re-Submit Correct UTR <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            )}

            {/* Campaign Notes */}
            {selectedCampaign.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase">
                  Campaign Guidelines &amp; Notes
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{selectedCampaign.notes}</p>
              </div>
            )}

            {/* Payment Proof Screenshot */}
            {selectedCampaign.paymentScreenshot && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#B8860B]" /> Uploaded Payment Proof
                  </span>
                  <a
                    href={selectedCampaign.paymentScreenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#B8860B] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    Open Full Image <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-52 flex items-center justify-center bg-slate-100">
                  <img
                    src={selectedCampaign.paymentScreenshot}
                    alt="Payment Proof"
                    className="max-h-52 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedCampaign(null)}
                className="px-6 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Screenshot Viewer Modal ────────────────── */}
      {selectedScreenshot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-xl w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-[#B8860B]" /> Payment Proof Screenshot
              </h3>
              <button
                onClick={() => setSelectedScreenshot(null)}
                className="w-7 h-7 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[60vh] flex items-center justify-center bg-slate-100">
              <img
                src={selectedScreenshot}
                alt="Payment Proof"
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end">
              <a
                href={selectedScreenshot}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                Open Full Size <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
