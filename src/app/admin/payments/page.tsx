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
  const [activeTab, setActiveTab] = useState<"pending" | "accepted" | "rejected" | "all">("pending");

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
        setPayments(d.allPayments || d.pendingCampaigns || []);
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
        setToastMsg("Payment approved successfully! Request moved to Accepted tab.");
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
        setToastMsg("Payment rejected and moved to Rejected tab.");
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
  const acceptedPayments = payments.filter((p) => p.paymentStatus === "approved");
  const rejectedPayments = payments.filter((p) => p.paymentStatus === "rejected");

  const tabList =
    activeTab === "pending"
      ? pendingPayments
      : activeTab === "accepted"
      ? acceptedPayments
      : activeTab === "rejected"
      ? rejectedPayments
      : payments;

  const displayPayments = tabList.filter(
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
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control Bar: Search & Tabs */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by campaign, producer or UTR..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
          />
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("pending")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "pending"
                ? "bg-[#D4AF37] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Pending ({pendingPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("accepted")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "accepted"
                ? "bg-emerald-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Accepted ({acceptedPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("rejected")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === "rejected"
                ? "bg-red-600 text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Rejected ({rejectedPayments.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-white text-slate-900 border border-slate-300 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All History ({payments.length})
          </button>
        </div>
      </div>

      {/* Payment Requests Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-semibold">Loading payment requests from MongoDB...</div>
      ) : displayPayments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <CreditCard className="w-12 h-12 text-[#B8860B] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900">No Payment Requests</h3>
          <p className="text-xs text-slate-500">There are no payments requiring review in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayPayments.map((p) => {
            const isPending = p.paymentStatus === "pending_verification";
            const creators = p.selectedCreators || [];

            return (
              <div
                key={p.id || p._id}
                className={`bg-white p-6 rounded-3xl space-y-5 flex flex-col justify-between transition-all border shadow-sm hover:shadow-md ${
                  isPending
                    ? "border-amber-400 ring-2 ring-amber-100"
                    : "border-slate-200"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="text-xs font-bold text-[#B8860B] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> Client: {p.clientName}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mt-1">{p.title}</h3>
                    <div className="text-xs text-slate-600 mt-0.5 space-y-0.5">
                      <div>
                        Producer: <span className="text-slate-900 font-bold">{p.producerName || p.clientName || "BH Producer"}</span>
                      </div>
                      {(p.producerEmail || p.producerPhone) && (
                        <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-2 font-medium">
                          {p.producerEmail && <span>✉️ {p.producerEmail}</span>}
                          {p.producerPhone && <span>📞 {p.producerPhone}</span>}
                        </div>
                      )}
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border shrink-0 ${
                      p.paymentStatus === "approved"
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : p.paymentStatus === "rejected"
                        ? "bg-red-50 text-red-800 border-red-300"
                        : "bg-amber-50 text-amber-900 border-amber-300 animate-pulse"
                    }`}
                  >
                    {(p.paymentStatus || "pending").replace("_", " ").toUpperCase()}
                  </span>
                </div>

                {/* Amount, UTR & Creators count */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Amount Paid</div>
                    <div className="text-base font-black text-gold-gradient mt-0.5">{formatCurrency(p.budget)}</div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">12-Digit UTR</div>
                    <div className="text-xs font-mono font-black text-[#B8860B] mt-1 truncate">
                      {p.utrNumber || "N/A"}
                    </div>
                  </div>
                  <div>
                    <div className="text-[9px] text-slate-500 uppercase font-bold">Creators / Reels</div>
                    <div className="text-xs font-bold text-slate-900 mt-1">
                      {creators.length || p.assignedInfluencers?.length || 1} Cr • {p.reelsCount || 1} R
                    </div>
                  </div>
                </div>

                {/* Selected Creators Preview */}
                {creators.length > 0 && (
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center justify-between">
                      <span>Selected Creators ({creators.length})</span>
                      <span className="text-[#B8860B] font-bold">{p.reelsCount || 1} Total Reels</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {creators.map((c: any, idx: number) => (
                        <div
                          key={c.id || idx}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] shadow-sm"
                        >
                          <img
                            src={c.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150"}
                            alt={c.name}
                            className="w-4 h-4 rounded-full object-cover border border-[#D4AF37]"
                          />
                          <span className="font-bold text-slate-900 truncate max-w-[100px]">{c.name}</span>
                          <span className="text-[#B8860B] font-bold font-mono">({c.reelCount || 1}R)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Payment Screenshot Preview Bar */}
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.paymentScreenshot ? (
                      <img
                        src={p.paymentScreenshot}
                        alt="Payment Proof"
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 bg-white"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                        <FileCheck className="w-4 h-4 text-[#B8860B]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-slate-900">Payment Screenshot Proof</div>
                      <div className="text-[10px] text-slate-500">
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
                        className="px-2.5 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-[11px] font-bold text-[#B8860B] flex items-center gap-1"
                      >
                        <Eye className="w-3 h-3" /> Screenshot
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowDetailsModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-[11px] shadow-sm hover:brightness-105 flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> Details
                    </button>
                  </div>
                </div>

                {/* Rejection Reason */}
                {p.rejectionReason && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 font-medium">
                    <span className="font-bold">Rejection Reason:</span> {p.rejectionReason}
                  </div>
                )}

                {/* Action Buttons */}
                {isPending && (
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowRejectModal(true);
                      }}
                      className="px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" /> Reject Payment
                    </button>
                    <button
                      onClick={() => handleApprove(p.id || p._id)}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
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

      {/* Details Verification Modal */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-3xl w-full bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[10px] font-bold text-amber-900 uppercase">
                  <ShieldAlert className="w-3 h-3 text-amber-600" /> Full Payment &amp; Creator Verification
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1.5">{selectedPayment.title}</h2>
                <div className="text-xs text-slate-600 font-medium mt-0.5">
                  Client: <span className="text-slate-900 font-bold">{selectedPayment.clientName}</span>
                </div>
              </div>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:text-slate-900 flex items-center justify-center font-bold"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Producer & Payment Key Facts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Producer / Contact Info
                </div>
                <div className="space-y-1.5 text-slate-700 font-medium">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-[#B8860B]" />
                    <span>Name: <strong className="text-slate-900">{selectedPayment.producerName || selectedPayment.clientName}</strong></span>
                  </div>
                  {selectedPayment.producerEmail && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Email: <strong className="text-slate-900 font-mono">{selectedPayment.producerEmail}</strong></span>
                    </div>
                  )}
                  {selectedPayment.producerPhone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[#B8860B]" />
                      <span>Phone: <strong className="text-slate-900 font-mono">{selectedPayment.producerPhone}</strong></span>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                  Payment &amp; UTR Details
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600 font-medium">Total Amount:</span>
                    <span className="text-xl font-black text-gold-gradient">{formatCurrency(selectedPayment.budget)}</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200">
                    <div>
                      <div className="text-[9px] text-slate-500 uppercase font-semibold">12-Digit UTR Code</div>
                      <div className="text-sm font-mono font-black text-[#B8860B]">{selectedPayment.utrNumber || "N/A"}</div>
                    </div>
                    {selectedPayment.utrNumber && (
                      <button
                        onClick={() => copyUtr(selectedPayment.utrNumber)}
                        className="p-1.5 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200"
                        title="Copy UTR"
                      >
                        {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Creators Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Video className="w-4 h-4 text-[#B8860B]" /> Selected Creators Breakdown ({selectedPayment.selectedCreators?.length || selectedPayment.assignedInfluencers?.length || 0})
                </h3>
                <span className="text-xs text-slate-500 font-medium">Total {selectedPayment.reelsCount || 1} Reels Ordered</span>
              </div>

              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                {(selectedPayment.selectedCreators && selectedPayment.selectedCreators.length > 0) ? (
                  selectedPayment.selectedCreators.map((c: any, idx: number) => (
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
                        <div className="font-bold text-[#B8860B] font-mono">
                          {c.reelCount || 1} Reel{c.reelCount > 1 ? "s" : ""}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 rounded-xl bg-slate-50 text-center text-xs text-slate-500 italic">
                    Creator IDs: {(selectedPayment.assignedInfluencers || []).join(", ") || "General Package"}
                  </div>
                )}
              </div>
            </div>

            {/* Notes */}
            {selectedPayment.notes && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1.5">
                  <FileText className="w-3 h-3 text-[#B8860B]" /> Producer Campaign Notes &amp; Guidelines
                </div>
                <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap font-medium">{selectedPayment.notes}</p>
              </div>
            )}

            {/* Screenshot Proof */}
            {selectedPayment.paymentScreenshot && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#B8860B]" /> Uploaded Payment Screenshot Proof
                  </span>
                  <a
                    href={selectedPayment.paymentScreenshot}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[#B8860B] font-bold text-xs hover:underline flex items-center gap-1"
                  >
                    Open Full Resolution <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>

                <div className="rounded-xl overflow-hidden border border-slate-200 max-h-60 flex items-center justify-center bg-slate-100">
                  <img
                    src={selectedPayment.paymentScreenshot}
                    alt="Payment Proof"
                    className="max-h-60 w-auto object-contain"
                  />
                </div>
              </div>
            )}

            {/* Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>

              {selectedPayment.paymentStatus === "pending_verification" && (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="px-5 py-2.5 rounded-xl bg-red-50 text-red-700 border border-red-200 text-xs font-bold hover:bg-red-100 transition-all flex items-center gap-1.5"
                  >
                    <XCircle className="w-4 h-4" /> Reject Payment
                  </button>
                  <button
                    onClick={() => handleApprove(selectedPayment.id || selectedPayment._id)}
                    className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-black text-xs hover:bg-emerald-700 transition-all flex items-center gap-1.5 shadow-sm"
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
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white p-6 rounded-3xl border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">Payment Screenshot Proof</h3>
                <div className="text-xs text-slate-500 font-medium">
                  UTR: <span className="font-mono text-[#B8860B] font-bold">{selectedPayment.utrNumber}</span>
                </div>
              </div>
              <button onClick={() => setShowScreenshotModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 max-h-[60vh] flex items-center justify-center bg-slate-100">
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
                className="px-4 py-2 rounded-xl bg-[#D4AF37] text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
              >
                Open Original Image <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md p-6 sm:p-8 rounded-3xl border border-red-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-red-100 text-red-600">
              <h3 className="text-base font-bold flex items-center gap-2">
                <ShieldAlert className="w-5 h-5" /> Reject Payment Verification
              </h3>
              <button onClick={() => setShowRejectModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600 font-medium">
              Reason for rejecting UTR <span className="font-mono text-[#B8860B] font-bold">{selectedPayment.utrNumber}</span>:
            </p>

            <textarea
              rows={3}
              required
              placeholder="e.g. Invalid UTR transaction number or screenshot illegible."
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
                onClick={handleRejectConfirm}
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
