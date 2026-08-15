"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
import {
  CreditCard,
  CheckCircle2,
  XCircle,
  Clock,
  Search,
  ExternalLink,
  FileCheck,
  Building,
  ShieldAlert,
  X,
  AlertTriangle,
  Sparkles,
  Eye,
  User,
  Mail,
  Phone,
  Video,
  Copy,
  Check,
  Instagram,
  FileText,
} from "lucide-react";

export default function PaymentReviewPage() {
  const { getAuthHeaders } = useAuth();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");

  // Modals state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toastMsg, setToastMsg] = useState("");
  const [copiedUtr, setCopiedUtr] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/payments", {
        headers: getAuthHeaders(),
      });
      if (res.ok) {
        const d = await res.json();
        setPayments(d.pendingCampaigns || d.allPayments || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (campaignId: string) => {
    try {
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({ campaignId, action: "approve" }),
      });

      if (res.ok) {
        setShowDetailsModal(false);
        setToastMsg("Payment approved successfully! Campaign is now active.");
        setTimeout(() => setToastMsg(""), 4000);
        fetchPayments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectConfirm = async () => {
    if (!selectedPayment) return;
    try {
      const campaignId = selectedPayment.id || selectedPayment._id;
      const res = await fetch("/api/admin/payments", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          campaignId,
          action: "reject",
          reason: rejectionReason || "Incomplete UTR or payment screenshot mismatch.",
        }),
      });

      if (res.ok) {
        setShowRejectModal(false);
        setShowDetailsModal(false);
        setRejectionReason("");
        setToastMsg("Payment rejected.");
        setTimeout(() => setToastMsg(""), 4000);
        fetchPayments();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const copyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val || 0);
  };

  const pendingPayments = payments.filter((p) => p.paymentStatus === "pending_verification");
  const displayPayments = (activeTab === "pending" ? pendingPayments : payments).filter(
    (p) =>
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      p.producerName?.toLowerCase().includes(search.toLowerCase()) ||
      (p.utrNumber && p.utrNumber.includes(search))
  );

  return (
    <div className="space-y-8">
      <Header
        title="Payment Review Module"
        subtitle="Review producer UPI payments, 12-digit UTR transaction codes, creator breakdown & payment proof screenshots"
      />

      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control Bar: Search & Tabs */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by campaign, producer or UTR number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 bg-[#131622] p-1.5 rounded-xl border border-[#D4AF37]/20">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-[#D4AF37] text-black shadow-gold-sm"
                : "text-gray-300 hover:text-white"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review ({pendingPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-[#D4AF37] text-black shadow-gold-sm"
                : "text-gray-300 hover:text-white"
            }`}
          >
            All History ({payments.length})
          </button>
        </div>
      </div>

      {/* Payment Requests Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading payment requests from MongoDB...</div>
      ) : displayPayments.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <CreditCard className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Payment Requests</h3>
          <p className="text-xs text-gray-400">There are no payments requiring review in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPayments.map((p) => {
            const isPending = p.paymentStatus === "pending_verification";
            const creators = p.selectedCreators || [];

            return (
              <div
                key={p.id || p._id}
                className={`glass-panel p-6 rounded-2xl space-y-5 flex flex-col justify-between transition-all ${
                  isPending
                    ? "border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-[#131622]"
                    : "border border-[#D4AF37]/20"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> Client: {p.clientName}
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">{p.title}</h3>
                    <div className="text-xs text-gray-400 mt-0.5 space-y-0.5">
                      <div>
                        Producer: <span className="text-white font-bold">{p.producerName || p.clientName || "BH Producer"}</span>
                      </div>
                      {(p.producerEmail || p.producerPhone) && (
                        <div className="text-[11px] text-gray-400 flex flex-wrap items-center gap-2">
                          {p.producerEmail && <span>✉️ {p.producerEmail}</span>}
                          {p.producerPhone && <span>📞 {p.producerPhone}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border shrink-0 ${
                      p.paymentStatus === "approved"
                        ? "bg-emerald-950/80 text-emerald-400 border-emerald-500/30"
                        : p.paymentStatus === "rejected"
                        ? "bg-red-950/80 text-red-400 border-red-500/30"
                        : "bg-amber-950/80 text-amber-400 border-amber-500/30 animate-pulse"
                    }`}
                  >
                    {(p.paymentStatus || "pending").replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* Amount, UTR & Creators count */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#0E1017] border border-[#D4AF37]/20 text-center">
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold">Amount Paid</div>
                    <div className="text-base font-black text-gold-gradient mt-0.5">{formatCurrency(p.budget)}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold">12-Digit UTR</div>
                    <div className="text-xs font-mono font-black text-[#D4AF37] mt-1 truncate">
                      {p.utrNumber || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-gray-400 uppercase font-bold">Creators / Reels</div>
                    <div className="text-xs font-bold text-white mt-1">
                      {creators.length || p.assignedInfluencers?.length || 1} Cr • {p.reelsCount || 1} R
                    </div>
                  </div>
                </div>

                {/* Selected Creators Preview Thumbnails */}
                {creators.length > 0 && (
                  <div className="p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/15 space-y-2">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Selected Creators ({creators.length})</span>
                      <span className="text-[#D4AF37] font-normal">{p.reelsCount || 1} Total Reels</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {creators.map((c: any, idx: number) => (
                        <div
                          key={c.id || idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#0E1017] border border-[#D4AF37]/20 text-[11px]"
                        >
                          <img
                            src={c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                            alt={c.name}
                            className="w-4 h-4 rounded-full object-cover border border-[#D4AF37]/40"
                          />
                          <span className="font-bold text-white truncate max-w-[100px]">{c.name}</span>
                          <span className="text-[#D4AF37] font-bold font-mono">({c.reelCount || 1}R)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Screenshot Preview Bar */}
                <div className="p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.paymentScreenshot ? (
                      <img
                        src={p.paymentScreenshot}
                        alt="Payment Proof"
                        className="w-10 h-10 rounded-lg object-cover border border-[#D4AF37] bg-black"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-[#1E2230] border border-[#D4AF37]/30 flex items-center justify-center text-gray-400">
                        <FileCheck className="w-4 h-4 text-[#D4AF37]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">Payment Screenshot Proof</div>
                      <div className="text-[10px] text-gray-400">
                        {p.paymentScreenshot ? "Receipt uploaded" : "No screenshot attached"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {p.paymentScreenshot && (
                      <button
                        onClick={() => {
                          setSelectedPayment(p);
                          setShowScreenshotModal(true);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-[#D4AF37]/15 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-[11px] font-bold text-[#D4AF37] flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Screenshot
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-[11px] shadow-gold-sm hover:brightness-110 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> View All Details
                    </button>
                  </div>
                </div>

                {/* Rejection Reason if any */}
                {p.rejectionReason && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-xs text-red-300">
                    <span className="font-bold">Rejection Reason:</span> {p.rejectionReason}
                  </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-950 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment
                    </button>
                    <button
                      onClick={() => handleApprove(p.id || p._id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Approve Payment
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* ── Full Campaign & Payment Details Verification Modal ──────────────── */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full glass-panel p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/40 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#D4AF37]/20 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-bold text-[#D4AF37] uppercase">
                  <ShieldAlert className="w-3 h-3" /> Full Payment &amp; Creator Package Verification
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5">{selectedPayment.title}</h2>
                <div className="text-xs text-gray-400 mt-0.5">
                  Client: <span className="text-white font-bold">{selectedPayment.clientName}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-[#1E2230] text-gray-400 hover:text-white flex items-center justify-center"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Producer & Payment Key Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Producer Info */}
              <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 space-y-2 text-xs">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Producer / Contact Info
                </div>
                <div className="space-y-1.5 text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#D4AF37]" />
                    <span>Name: <strong className="text-white">{selectedPayment.producerName || selectedPayment.clientName}</strong></span>
                  </div>
                  {selectedPayment.producerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Email: <strong className="text-white font-mono">{selectedPayment.producerEmail}</strong></span>
                    </div>
                  )}
                  {selectedPayment.producerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span>Phone: <strong className="text-white font-mono">{selectedPayment.producerPhone}</strong></span>
                    </div>
                  )}
                  <div className="text-[11px] text-gray-500 pt-1">
                    Submitted: {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleString("en-IN") : "Recent"}
                  </div>
                </div>
              </div>

              {/* Payment Verification Facts */}
              <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 space-y-2 text-xs">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                  Payment &amp; UTR Details
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Total Amount:</span>
                    <span className="text-xl font-black text-gold-gradient">{formatCurrency(selectedPayment.budget)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#131622] border border-[#D4AF37]/20">
                    <div>
                      <div className="text-[9px] text-gray-400 uppercase font-semibold">12-Digit UTR Code</div>
                      <div className="text-sm font-mono font-black text-[#D4AF37]">{selectedPayment.utrNumber || "N/A"}</div>
                    </div>
                    {selectedPayment.utrNumber && (
                      <button
                        onClick={() => copyUtr(selectedPayment.utrNumber)}
                        className="p-1.5 rounded-lg bg-[#0E1017] text-gray-300 hover:text-white border border-[#D4AF37]/30"
                        title="Copy UTR"
                      >
                        {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-gray-400" />}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Current Status:</span>
                    <span className="font-bold uppercase text-[#D4AF37]">{selectedPayment.paymentStatus?.replace("_", " ")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Selected Creators Detailed Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#D4AF37]" /> Selected Creators Breakdown ({selectedPayment.selectedCreators?.length || selectedPayment.assignedInfluencers?.length || 0})
                </h3>
                <span className="text-xs text-gray-400">Total {selectedPayment.reelsCount || 1} Reels Ordered</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(selectedPayment.selectedCreators && selectedPayment.selectedCreators.length > 0) ? (
                  selectedPayment.selectedCreators.map((c: any, idx: number) => (
                    <div
                      key={c.id || idx}
                      className="p-3 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                          alt={c.name}
                          className="w-10 h-10 rounded-xl object-cover border border-[#D4AF37]/40 shrink-0"
                        />
                        <div>
                          <div className="font-extrabold text-white">{c.name}</div>
                          <div className="text-[10px] text-gray-400 font-mono flex items-center gap-1.5">
                            <Instagram className="w-2.5 h-2.5 text-[#D4AF37]" /> {c.instaHandle}
                            {c.category && <span className="text-gray-500">• {c.category}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-bold text-[#D4AF37] font-mono">
                          {c.reelCount || 1} Reel{c.reelCount > 1 ? "s" : ""}
                        </div>
                        {c.ratePerReel > 0 && (
                          <div className="text-[10px] text-gray-500">
                            @{formatCurrency(c.ratePerReel)}/reel
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-[#0E1017] text-center text-xs text-gray-500 italic">
                    Creator IDs: {(selectedPayment.assignedInfluencers || []).join(", ") || "General Package"}
                  </div>
                )}
              </div>
            </div>

            {/* Campaign Notes & Special Instructions */}
            {selectedPayment.notes && (
              <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/15 space-y-1">
                <div className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#D4AF37]" /> Producer Campaign Notes &amp; Hashtag Guidelines
                </div>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-wrap">{selectedPayment.notes}</p>
              </div>
            )}

            {/* Payment Proof Screenshot Section */}
            {selectedPayment.paymentScreenshot && (
              <div className="p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/20 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#D4AF37]" /> Uploaded Payment Screenshot Proof
                  </span>
                  <a
                    href={selectedPayment.paymentScreenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#D4AF37] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    Open Full Resolution <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden border border-[#D4AF37]/30 max-h-60 flex items-center justify-center bg-black">
                  <img
                    src={selectedPayment.paymentScreenshot}
                    alt="Payment Proof"
                    className="max-h-60 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Action Bar inside Modal */}
            <div className="flex items-center justify-between pt-4 border-t border-[#D4AF37]/20">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-[#131622] hover:bg-[#1E2230] text-gray-300 font-semibold text-xs transition-colors"
              >
                Close
              </button>

              {selectedPayment.paymentStatus === "pending_verification" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setShowRejectModal(true);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-red-950 text-red-400 border border-red-500/40 text-xs font-bold hover:bg-red-900 transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Payment
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPayment.id || selectedPayment._id)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-500 text-black font-black text-xs hover:bg-emerald-400 transition-all flex items-center gap-1.5 shadow-lg"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Approve &amp; Activate Campaign
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Screenshot Full Preview Modal */}
      {showScreenshotModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full glass-panel p-6 rounded-3xl border border-[#D4AF37]/40 space-y-4">
            <div className="flex items-center justify-between border-b border-[#D4AF37]/20 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Payment Screenshot Proof</h3>
                <div className="text-xs text-gray-400">
                  UTR: <span className="font-mono text-[#D4AF37] font-bold">{selectedPayment.utrNumber}</span>
                </div>
              </div>
              <button onClick={() => setShowScreenshotModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#D4AF37]/30 max-h-[60vh] flex items-center justify-center bg-black">
              <img
                src={selectedPayment.paymentScreenshot}
                alt="Full Payment Proof"
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex justify-end">
              <a
                href={selectedPayment.paymentScreenshot}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black font-bold text-xs flex items-center gap-1.5"
              >
                Open Original Image <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel w-full max-w-md p-6 rounded-2xl border border-red-500/40 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-500/20 text-red-400">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Reject Payment Verification
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Reason for rejecting UTR <span className="font-mono text-[#D4AF37] font-bold">{selectedPayment.utrNumber}</span>:
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Invalid UTR transaction number or screenshot illegible."
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
                onClick={handleRejectConfirm}
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
