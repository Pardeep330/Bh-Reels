"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  CheckCircle2,
  Video,
  Instagram,
  Plus,
  Minus,
  ArrowRight,
  Sparkles,
  User,
  Mail,
  Phone,
  Lock,
} from "lucide-react";

export default function SelectInfluencersPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Producer Selection State
  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});
  const [producerDetails, setProducerDetails] = useState({
    producerName: "",
    producerEmail: "",
    producerPhone: "",
    projectTitle: "",
    notes: "",
  });

  useEffect(() => {
    fetch("/api/admin/influencers")
      .then((r) => r.json())
      .then((d) => setInfluencers(d.influencers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const toggleSelect = (id: string) => {
    const newMap = { ...selectedMap };
    if (newMap[id]) {
      delete newMap[id];
    } else {
      newMap[id] = 1; // Default 1 reel
    }
    setSelectedMap(newMap);
  };

  const updateReelsCount = (id: string, delta: number) => {
    const newMap = { ...selectedMap };
    const current = newMap[id] || 1;
    const updated = Math.max(1, current + delta);
    newMap[id] = updated;
    setSelectedMap(newMap);
  };

  // Real-time Grand Total Estimated Price Calculation (Individual rates are confidential)
  const selectedIds = Object.keys(selectedMap);
  const totalEstimatedPrice = selectedIds.reduce((sum, id) => {
    const creator = influencers.find((i) => i.id === id);
    const count = selectedMap[id] || 1;
    return sum + (creator ? creator.ratePerReel * count : 0);
  }, 0);

  const totalReelsCount = selectedIds.reduce((sum, id) => sum + (selectedMap[id] || 1), 0);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Please select at least one influencer for package total calculation!");
      return;
    }

    const bookingDraft = {
      producerName: producerDetails.producerName,
      producerEmail: producerDetails.producerEmail,
      producerPhone: producerDetails.producerPhone,
      projectTitle: producerDetails.projectTitle || `${producerDetails.producerName}'s Campaign`,
      notes: producerDetails.notes,
      selectedIds,
      selectedMap,
      totalEstimatedPrice,
      totalReelsCount,
    };

    sessionStorage.setItem("bh_booking_draft", JSON.stringify(bookingDraft));
    router.push("/payment");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#131622] border border-[#D4AF37]/30 text-xs font-bold text-[#D4AF37]">
          <Calculator className="w-4 h-4 text-[#D4AF37]" /> Producer Reel Package Estimator Engine
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Select Influencers & Get <span className="text-gold-gradient">Total Package Price</span>
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 max-w-2xl mx-auto">
          Select creators for your campaign. Individual rate cards are private; our engine calculates the grand total package estimate before UPI checkout.
        </p>
      </div>

      {/* Main Grid: Selection Roster + Total Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Creator Cards (Rates HIDDEN) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Video className="w-5 h-5 text-[#D4AF37]" /> Select Creators ({selectedIds.length} Selected)
            </h2>
          </div>

          {loading ? (
            <div className="py-12 text-center text-xs text-gray-400">Loading creator roster...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {influencers.map((inf) => {
                const isSelected = !!selectedMap[inf.id];
                const reels = selectedMap[inf.id] || 1;

                return (
                  <div
                    key={inf.id}
                    className={`glass-panel p-5 rounded-2xl relative transition-all duration-200 cursor-pointer space-y-4 ${
                      isSelected
                        ? "border-2 border-[#D4AF37] bg-[#181B2B]/90 shadow-gold-sm"
                        : "border border-[#D4AF37]/20 hover:border-[#D4AF37]/50"
                    }`}
                    onClick={() => toggleSelect(inf.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={inf.avatar}
                          alt={inf.name}
                          className="w-12 h-12 rounded-full object-cover border border-[#D4AF37]"
                        />
                        <div>
                          <h3 className="font-bold text-white text-sm">{inf.name}</h3>
                          <div className="text-xs font-mono text-[#D4AF37]">{inf.instaHandle}</div>
                          <div className="text-[10px] text-gray-400">{inf.category}</div>
                        </div>
                      </div>

                      <div
                        className={`w-6 h-6 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? "bg-[#D4AF37] border-[#D4AF37] text-black"
                            : "border-gray-600 text-transparent"
                        }`}
                      >
                        <CheckCircle2 className="w-4 h-4 fill-current" />
                      </div>
                    </div>

                    {/* Follower Stats Bar (Rates HIDDEN) */}
                    <div className="flex items-center justify-between pt-2 border-t border-[#D4AF37]/15">
                      <div className="text-xs text-gray-400">
                        Followers: <span className="text-white font-bold">{formatNumber(inf.followersCount)}</span>
                      </div>

                      {/* Quantity Controls if selected */}
                      {isSelected && (
                        <div
                          className="flex items-center gap-2 bg-[#0E1017] border border-[#D4AF37]/30 rounded-xl px-2 py-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            type="button"
                            onClick={() => updateReelsCount(inf.id, -1)}
                            className="p-1 rounded bg-[#1E2230] text-gray-300 hover:text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="text-xs font-bold text-white px-1">{reels} Reel{reels > 1 ? "s" : ""}</span>
                          <button
                            type="button"
                            onClick={() => updateReelsCount(inf.id, 1)}
                            className="p-1 rounded bg-[#1E2230] text-gray-300 hover:text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Live Grand Total & Form */}
        <div className="space-y-6 sticky top-24">
          <div className="glass-panel p-6 rounded-3xl space-y-6 border-2 border-[#D4AF37]/40 shadow-2xl">
            <div className="pb-4 border-b border-[#D4AF37]/20 flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Package Summary
              </h3>
              <span className="text-[10px] text-[#D4AF37] font-bold font-mono border border-[#D4AF37]/30 px-2 py-0.5 rounded bg-[#D4AF37]/10">
                CONFIDENTIAL RATES
              </span>
            </div>

            {/* Selected Breakdown (No individual rates shown) */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {selectedIds.length === 0 ? (
                <div className="text-center py-6 text-xs text-gray-500 italic">
                  Select creators on the left to calculate grand total
                </div>
              ) : (
                selectedIds.map((id) => {
                  const creator = influencers.find((i) => i.id === id);
                  const count = selectedMap[id] || 1;

                  return (
                    <div key={id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-[#0E1017]">
                      <div>
                        <div className="font-bold text-white">{creator?.name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{creator?.instaHandle}</div>
                      </div>
                      <div className="font-bold text-[#D4AF37]">{count} Reel{count > 1 ? "s" : ""}</div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Grand Total Highlight */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-[#181B2B] to-[#131622] border border-[#D4AF37]/30 space-y-1">
              <div className="text-xs text-gray-400 flex items-center justify-between">
                <span>Grand Total Package Estimate:</span>
                <span className="text-gray-300 font-bold">{totalReelsCount} Reels Total</span>
              </div>
              <div className="text-3xl font-black text-gold-gradient">{formatCurrency(totalEstimatedPrice)}</div>
            </div>

            {/* Form */}
            <form onSubmit={handleProceedToPayment} className="space-y-4 text-xs">
              <div className="text-xs font-bold text-white uppercase tracking-wider">Producer / Client Info</div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Producer / Client Name *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Roy"
                    value={producerDetails.producerName}
                    onChange={(e) => setProducerDetails({ ...producerDetails, producerName: e.target.value })}
                    className="w-full bg-[#0E1017] border border-[#D4AF37]/30 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Email Address *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="producer@studio.com"
                    value={producerDetails.producerEmail}
                    onChange={(e) => setProducerDetails({ ...producerDetails, producerEmail: e.target.value })}
                    className="w-full bg-[#0E1017] border border-[#D4AF37]/30 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="+91 98765 43210"
                    value={producerDetails.producerPhone}
                    onChange={(e) => setProducerDetails({ ...producerDetails, producerPhone: e.target.value })}
                    className="w-full bg-[#0E1017] border border-[#D4AF37]/30 rounded-xl pl-9 pr-3 py-2 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={selectedIds.length === 0}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <span>Proceed to UPI Payment</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
