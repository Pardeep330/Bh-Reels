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
  const [selectedPayment, setSelectedPayment] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [toastMsg, setToastMsg] = useState("");

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
        setRejectionReason("");
        setToastMsg("Payment rejected.");
        setTimeout(() => setToastMsg(""), 4000);
        fetchPayments();
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
        subtitle="Review producer UPI payments, 12-digit UTR transaction codes & payment proof screenshots"
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

            return (
              <div
                key={p.id || p._id}
                className={`glass-panel p-6 rounded-2xl space-y-5 flex flex-col justify-between transition-all ${
                  isPending ? "border-2 border-amber-500/50 bg-gradient-to-b from-amber-950/20 to-[#131622]" : "border border-[#D4AF37]/20"
                }`}
              >
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs font-bold text-[#D4AF37] flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5" /> Client: {p.clientName}
                    </div>
                    <h3 className="text-lg font-black text-white mt-1">{p.title}</h3>
                    <div className="text-xs text-gray-400 mt-0.5">
                      Producer: <span className="text-white font-bold">{p.producerName || "BH Producer"}</span>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-extrabold border ${
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

                {/* Amount & 12-Digit UTR Number */}
                <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[#0E1017] border border-[#D4AF37]/20">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">Amount Paid</div>
                    <div className="text-xl font-black text-gold-gradient">{formatCurrency(p.budget)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-bold">12-Digit UTR Code</div>
                    <div className="text-sm font-mono font-black text-[#D4AF37] mt-1">
                      {p.utrNumber || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot Preview */}
                <div className="p-3 rounded-xl bg-[#131622] border border-[#D4AF37]/20 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {p.paymentScreenshot ? (
                      <img
                        src={p.paymentScreenshot}
                        alt="Payment Proof"
                        className="w-12 h-12 rounded-lg object-cover border border-[#D4AF37]"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-[#1E2230] border border-[#D4AF37]/30 flex items-center justify-center text-gray-400">
                        <FileCheck className="w-5 h-5 text-[#D4AF37]" />
                      </div>
                    )}
                    <div>
                      <div className="text-xs font-bold text-white">Payment Screenshot Proof</div>
                      <div className="text-[10px] text-gray-400">UPI / GPay / PhonePe receipt</div>
                    </div>
                  </div>

                  {p.paymentScreenshot && (
                    <button
                      onClick={() => {
                        setSelectedPayment(p);
                        setShowScreenshotModal(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> View Proof
                    </button>
                  )}
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
