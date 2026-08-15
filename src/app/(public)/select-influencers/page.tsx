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
  Search,
  Filter,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  X,
} from "lucide-react";

export default function SelectInfluencersPage() {
  const router = useRouter();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  const categories = [
    "All",
    "Tech & Gadgets",
    "Fashion & Style",
    "Fitness & Wellness",
    "Food & Culinary",
    "Entertainment & Skits",
    "Beauty & Skincare",
    "Gaming",
    "Lifestyle",
  ];

  const [selectedMap, setSelectedMap] = useState<Record<string, number>>({});
  const [producerDetails, setProducerDetails] = useState({
    producerName: "",
    producerEmail: "",
    producerPhone: "",
    projectTitle: "",
    notes: "",
  });

  // Auto-fill from logged-in session
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("bh_auth_user");
      if (savedUser) {
        const user = JSON.parse(savedUser);
        setProducerDetails((prev) => ({
          ...prev,
          producerName: user.name || "",
          producerEmail: user.email || "",
          producerPhone: user.phone || "",
        }));
      }
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetch("/api/admin/influencers")
      .then((r) => r.json())
      .then((d) => setInfluencers(d.influencers || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(val);

  const filtered = influencers.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.instaHandle.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || i.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const toggleSelect = (id: string) => {
    const newMap = { ...selectedMap };
    if (newMap[id]) {
      delete newMap[id];
    } else {
      newMap[id] = 1;
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

  const selectedIds = Object.keys(selectedMap);

  const totalEstimatedPrice = selectedIds.reduce((sum, id) => {
    const creator = influencers.find((i) => i.id === id);
    const count = selectedMap[id] || 1;
    return sum + (creator ? creator.ratePerReel * count : 0);
  }, 0);

  const totalReelsCount = selectedIds.reduce((sum, id) => sum + (selectedMap[id] || 1), 0);

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0) {
      alert("Please select at least one influencer for package total calculation!");
      return;
    }

    const selectedCreators = selectedIds.map((id) => {
      const creator = influencers.find((i) => i.id === id);
      const count = selectedMap[id] || 1;
      return {
        id,
        name: creator?.name || id,
        instaHandle: creator?.instaHandle || "",
        avatar: creator?.avatar || "",
        category: creator?.category || "",
        ratePerReel: creator?.ratePerReel || 0,
        reelCount: count,
        subtotal: (creator?.ratePerReel || 0) * count,
      };
    });

    const bookingDraft = {
      producerName: producerDetails.producerName,
      producerEmail: producerDetails.producerEmail,
      producerPhone: producerDetails.producerPhone,
      projectTitle: producerDetails.projectTitle || `${producerDetails.producerName}'s Campaign`,
      notes: producerDetails.notes,
      selectedIds,
      selectedMap,
      selectedCreators,
      totalEstimatedPrice,
      totalReelsCount,
    };
    sessionStorage.setItem("bh_booking_draft", JSON.stringify(bookingDraft));
    router.push("/payment");
  };

  return (
    <>
      {/* Page Wrapper — add bottom padding on mobile for floating bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 pb-28 lg:pb-12 space-y-6 sm:space-y-8">

        {/* ── Header ─────────────────────────────────── */}
        <div className="text-center space-y-3 px-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#131622] border border-[#D4AF37]/30 text-[10px] sm:text-xs font-bold text-[#D4AF37]">
            <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#D4AF37]" />
            Producer Reel Package Estimator
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Select Influencers &amp; Get{" "}
            <span className="text-gold-gradient">Total Package Price</span>
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            Select creators for your campaign. Individual rates are private — our engine calculates
            the grand total before UPI checkout.
          </p>
        </div>

        {/* ── Search & Filter Bar ─────────────────────── */}
        <div className="glass-panel p-4 sm:p-5 rounded-2xl space-y-3">
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, handle, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[#0E1017] border border-[#D4AF37]/25 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
            {selectedIds.length > 0 && (
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/40 text-[#D4AF37] font-bold text-xs">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{selectedIds.length} Selected</span>
                <span className="sm:hidden">{selectedIds.length}</span>
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
            <div className="shrink-0 flex items-center gap-1 text-[10px] text-gray-500 font-semibold pr-1">
              <Filter className="w-3 h-3 text-[#D4AF37]" />
              <span className="hidden sm:inline">Niche:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#D4AF37] text-black"
                    : "bg-[#0E1017] border border-[#D4AF37]/20 text-gray-400 hover:border-[#D4AF37]/50 hover:text-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* ── Main Layout ─────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">

          {/* ── Creator Grid (full width on mobile) ──── */}
          <div className="lg:col-span-2">
            {/* Results count */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-[#D4AF37]" />
                Select Creators
                <span className="text-gray-500 font-normal">({selectedIds.length} selected)</span>
              </h2>
              {!loading && (
                <span className="text-[11px] text-gray-500">{filtered.length} creators</span>
              )}
            </div>

            {loading ? (
              /* Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="glass-panel p-5 rounded-2xl space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-[#1E2230]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-[#1E2230] rounded w-2/3" />
                        <div className="h-2 bg-[#1E2230] rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-2 bg-[#1E2230] rounded w-full" />
                    <div className="h-10 bg-[#1E2230] rounded-xl w-full" />
                    <div className="h-8 bg-[#1E2230] rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-[#131622] border border-[#D4AF37]/20 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-gray-600" />
                </div>
                <p className="text-gray-400 text-sm">No creators found</p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                  className="text-[#D4AF37] text-xs underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filtered.map((inf) => {
                  const isSelected = !!selectedMap[inf.id];
                  const reels = selectedMap[inf.id] || 1;

                  return (
                    <div
                      key={inf.id}
                      className={`glass-panel rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-[#D4AF37] shadow-gold-sm"
                          : "border border-[#D4AF37]/15 hover:border-[#D4AF37]/40"
                      }`}
                    >
                      {/* Card Body */}
                      <div className="p-4 sm:p-5 space-y-3 flex-1">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative shrink-0">
                              <img
                                src={inf.avatar}
                                alt={inf.name}
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#D4AF37]/60"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
                                }}
                              />
                              {isSelected && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center">
                                  <CheckCircle2 className="w-3 h-3 text-black fill-black" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-white text-sm truncate leading-tight">
                                {inf.name}
                              </h3>
                              <div className="text-[11px] font-mono text-[#D4AF37] flex items-center gap-1 mt-0.5">
                                <Instagram className="w-3 h-3 shrink-0" />
                                <span className="truncate">{inf.instaHandle}</span>
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-[#1E2230] text-[9px] font-bold text-[#D4AF37] whitespace-nowrap max-w-[80px] text-right leading-tight">
                            {inf.category}
                          </span>
                        </div>

                        {/* Bio */}
                        {inf.bio && (
                          <p className="text-[11px] text-gray-500 line-clamp-2 leading-relaxed">
                            {inf.bio}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-[#0E1017] border border-[#D4AF37]/10 text-center">
                          <div>
                            <div className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">
                              Followers
                            </div>
                            <div className="text-sm font-black text-white mt-0.5">
                              {formatNumber(inf.followersCount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-gray-500 uppercase font-semibold tracking-wider">
                              Engagement
                            </div>
                            <div className="text-sm font-black text-emerald-400 mt-0.5">
                              {inf.engagementRate}%
                            </div>
                          </div>
                        </div>

                        {/* Reel counter */}
                        {isSelected && (
                          <div className="flex items-center justify-center gap-3 bg-[#0E1017] border border-[#D4AF37]/25 rounded-xl py-2">
                            <button
                              type="button"
                              onClick={() => updateReelsCount(inf.id, -1)}
                              className="w-7 h-7 rounded-lg bg-[#1E2230] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#252A3D] transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-white min-w-[64px] text-center">
                              {reels} Reel{reels > 1 ? "s" : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateReelsCount(inf.id, 1)}
                              className="w-7 h-7 rounded-lg bg-[#1E2230] flex items-center justify-center text-gray-300 hover:text-white hover:bg-[#252A3D] transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="px-4 sm:px-5 py-3 border-t border-[#D4AF37]/10 flex items-center justify-between gap-2">
                        <a
                          href={inf.instaProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] font-bold text-[#D4AF37] hover:underline flex items-center gap-1 shrink-0"
                        >
                          View Profile
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleSelect(inf.id)}
                          className={`px-3 py-2 rounded-xl font-extrabold text-[11px] transition-all ${
                            isSelected
                              ? "bg-[#D4AF37]/15 border border-[#D4AF37]/60 text-[#D4AF37]"
                              : "bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black shadow-gold-sm hover:brightness-105"
                          }`}
                        >
                          {isSelected ? "✓ Selected" : "Select for Package"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Right Summary Panel (desktop only) ──── */}
          <div className="hidden lg:block sticky top-24">
            <div className="glass-panel rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden">
              {/* Panel Header */}
              <div className="p-5 border-b border-[#D4AF37]/20 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Package Summary
                </h3>
                <span className="text-[9px] text-[#D4AF37] font-bold font-mono border border-[#D4AF37]/30 px-2 py-0.5 rounded bg-[#D4AF37]/10 tracking-widest">
                  CONFIDENTIAL
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Selected Breakdown */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedIds.length === 0 ? (
                    <div className="text-center py-5 text-xs text-gray-500 italic">
                      Select creators to calculate total
                    </div>
                  ) : (
                    selectedIds.map((id) => {
                      const creator = influencers.find((i) => i.id === id);
                      const count = selectedMap[id] || 1;
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#0E1017] border border-[#D4AF37]/10"
                        >
                          <div className="flex items-center gap-2">
                            <img
                              src={creator?.avatar}
                              alt={creator?.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/40 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white leading-tight">{creator?.name}</div>
                              <div className="text-[10px] text-gray-500 font-mono">{creator?.instaHandle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-[#131622] border border-[#D4AF37]/20 rounded-lg px-1.5 py-1">
                              <button
                                onClick={() => updateReelsCount(id, -1)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[#D4AF37] font-bold text-[10px] min-w-[28px] text-center">
                                {count}R
                              </span>
                              <button
                                onClick={() => updateReelsCount(id, 1)}
                                className="text-gray-400 hover:text-white transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => toggleSelect(id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                {/* Grand Total */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181B2B] to-[#0E1017] border border-[#D4AF37]/30">
                  <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                    <span>Package Estimate</span>
                    <span className="text-gray-300 font-bold">{totalReelsCount} Reel{totalReelsCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-gold-gradient">
                    {formatCurrency(totalEstimatedPrice)}
                  </div>
                  <div className="text-[10px] text-gray-500 mt-1">Individual rates are confidential</div>
                </div>

                {/* Form */}
                <form onSubmit={handleProceedToPayment} className="space-y-3">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-1">
                    Producer / Client Info
                  </div>

                  {[
                    { label: "Name *", key: "producerName", type: "text", placeholder: "e.g. Vikramaditya Roy", Icon: User },
                    { label: "Email *", key: "producerEmail", type: "email", placeholder: "producer@studio.com", Icon: Mail },
                    { label: "Phone *", key: "producerPhone", type: "text", placeholder: "+91 98765 43210", Icon: Phone },
                  ].map(({ label, key, type, placeholder, Icon }) => (
                    <div key={key}>
                      <label className="block text-gray-400 text-[11px] font-semibold mb-1">{label}</label>
                      <div className="relative">
                        <Icon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={producerDetails[key as keyof typeof producerDetails]}
                          onChange={(e) => setProducerDetails({ ...producerDetails, [key]: e.target.value })}
                          className="w-full bg-[#0E1017] border border-[#D4AF37]/25 rounded-xl pl-8 pr-3 py-2.5 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={selectedIds.length === 0}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                  >
                    <span>Proceed to UPI Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {selectedIds.length === 0 && (
                    <p className="text-center text-[10px] text-gray-600">Select at least one creator to continue</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Mobile Floating Bottom Bar ────────────────── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50">
        {/* Collapsed bar */}
        {!mobilePanelOpen && (
          <div
            className="mx-3 mb-3 flex items-center justify-between gap-3 bg-[#131622]/95 backdrop-blur-xl border border-[#D4AF37]/40 rounded-2xl px-4 py-3 shadow-2xl cursor-pointer"
            onClick={() => setMobilePanelOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              </div>
              <div>
                <div className="text-[10px] text-gray-400 leading-none">
                  {selectedIds.length === 0
                    ? "No creators selected"
                    : `${selectedIds.length} creator${selectedIds.length > 1 ? "s" : ""} • ${totalReelsCount} reel${totalReelsCount !== 1 ? "s" : ""}`}
                </div>
                <div className="text-base font-black text-gold-gradient leading-tight">
                  {formatCurrency(totalEstimatedPrice)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 hidden sm:block">Tap for details</span>
              <ChevronUp className="w-4 h-4 text-[#D4AF37]" />
            </div>
          </div>
        )}

        {/* Expanded panel */}
        {mobilePanelOpen && (
          <div className="mx-0 bg-[#0B0D14]/97 backdrop-blur-xl border-t border-[#D4AF37]/30 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-[#D4AF37]/15">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" /> Package Summary
              </h3>
              <button
                onClick={() => setMobilePanelOpen(false)}
                className="w-7 h-7 rounded-full bg-[#1E2230] flex items-center justify-center text-gray-400 hover:text-white"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 pb-8">
              {/* Selected Breakdown */}
              <div className="space-y-2">
                {selectedIds.length === 0 ? (
                  <div className="text-center py-5 text-xs text-gray-500 italic">
                    Select creators above to calculate total
                  </div>
                ) : (
                  selectedIds.map((id) => {
                    const creator = influencers.find((i) => i.id === id);
                    const count = selectedMap[id] || 1;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-[#0E1017] border border-[#D4AF37]/10"
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={creator?.avatar}
                            alt={creator?.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#D4AF37]/40 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-white">{creator?.name}</div>
                            <div className="text-[10px] text-gray-500 font-mono">{creator?.instaHandle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1 bg-[#131622] border border-[#D4AF37]/20 rounded-lg px-1.5 py-1">
                            <button onClick={() => updateReelsCount(id, -1)} className="text-gray-400">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-[#D4AF37] font-bold text-[10px] min-w-[24px] text-center">{count}R</span>
                            <button onClick={() => updateReelsCount(id, 1)} className="text-gray-400">
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <button onClick={() => toggleSelect(id)} className="text-red-400">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-[#181B2B] to-[#0E1017] border border-[#D4AF37]/30">
                <div className="flex items-center justify-between text-[11px] text-gray-400 mb-1">
                  <span>Package Estimate</span>
                  <span className="text-gray-300 font-bold">{totalReelsCount} Reel{totalReelsCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="text-2xl font-black text-gold-gradient">{formatCurrency(totalEstimatedPrice)}</div>
              </div>

              {/* Form */}
              <form onSubmit={handleProceedToPayment} className="space-y-3">
                <div className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                  Producer / Client Info
                </div>

                {[
                  { label: "Name *", key: "producerName", type: "text", placeholder: "e.g. Vikramaditya Roy", Icon: User },
                  { label: "Email *", key: "producerEmail", type: "email", placeholder: "producer@studio.com", Icon: Mail },
                  { label: "Phone *", key: "producerPhone", type: "text", placeholder: "+91 98765 43210", Icon: Phone },
                ].map(({ label, key, type, placeholder, Icon }) => (
                  <div key={key}>
                    <label className="block text-gray-400 text-[11px] font-semibold mb-1">{label}</label>
                    <div className="relative">
                      <Icon className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={producerDetails[key as keyof typeof producerDetails]}
                        onChange={(e) => setProducerDetails({ ...producerDetails, [key]: e.target.value })}
                        className="w-full bg-[#0E1017] border border-[#D4AF37]/25 rounded-xl pl-8 pr-3 py-3 text-xs text-white placeholder-gray-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={selectedIds.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>Proceed to UPI Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
