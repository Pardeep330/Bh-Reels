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
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-xs font-bold text-amber-900 shadow-sm">
            <Calculator className="w-4 h-4 text-amber-600" />
            Producer Reel Package Estimator
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight leading-tight">
            Select Influencers &amp; Get{" "}
            <span className="text-gold-gradient">Total Package Price</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed font-medium">
            Select creators for your campaign. Individual rates are private — our engine calculates
            the grand total before UPI checkout.
          </p>
        </div>

        {/* ── Search & Filter Bar ─────────────────────── */}
        <div className="bg-white border border-slate-200 shadow-sm p-4 sm:p-5 rounded-2xl space-y-3">
          {/* Search Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search name, handle, category..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
              />
            </div>
            {selectedIds.length > 0 && (
              <div className="shrink-0 flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-extrabold text-xs">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                <span className="hidden sm:inline">{selectedIds.length} Selected</span>
                <span className="sm:hidden">{selectedIds.length}</span>
              </div>
            )}
          </div>

          {/* Category Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <div className="shrink-0 flex items-center gap-1 text-xs text-slate-500 font-bold pr-1">
              <Filter className="w-3.5 h-3.5 text-amber-600" />
              <span className="hidden sm:inline">Niche:</span>
            </div>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-[#D4AF37] text-slate-950 shadow-sm"
                    : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 hover:text-slate-900"
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
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Video className="w-4 h-4 text-amber-600" />
                Select Creators
                <span className="text-slate-500 text-xs font-medium">({selectedIds.length} selected)</span>
              </h2>
              {!loading && (
                <span className="text-xs text-slate-500 font-medium">{filtered.length} creators</span>
              )}
            </div>

            {loading ? (
              /* Skeleton */
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200 p-5 rounded-2xl space-y-4 animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-slate-200" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-slate-200 rounded w-2/3" />
                        <div className="h-2 bg-slate-200 rounded w-1/2" />
                      </div>
                    </div>
                    <div className="h-2 bg-slate-200 rounded w-full" />
                    <div className="h-10 bg-slate-200 rounded-xl w-full" />
                    <div className="h-8 bg-slate-200 rounded-xl w-full" />
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-16 bg-white border border-slate-200 rounded-2xl text-center space-y-3">
                <div className="w-14 h-14 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center mx-auto">
                  <Search className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-slate-600 font-medium text-sm">No creators found</p>
                <button
                  onClick={() => { setSearch(""); setSelectedCategory("All"); }}
                  className="text-[#B8860B] font-bold text-xs underline underline-offset-2 hover:text-[#997A15]"
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
                      className={`bg-white rounded-2xl overflow-hidden flex flex-col transition-all duration-200 ${
                        isSelected
                          ? "border-2 border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/20"
                          : "border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow"
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
                                className="w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#D4AF37]"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src =
                                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300";
                                }}
                              />
                              {isSelected && (
                                <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#D4AF37] flex items-center justify-center shadow">
                                  <CheckCircle2 className="w-3 h-3 text-slate-950 fill-slate-950" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h3 className="font-extrabold text-slate-900 text-sm truncate leading-tight">
                                {inf.name}
                              </h3>
                              <div className="text-[11px] font-mono text-[#B8860B] font-bold flex items-center gap-1 mt-0.5">
                                <Instagram className="w-3 h-3 shrink-0" />
                                <span className="truncate">{inf.instaHandle}</span>
                              </div>
                            </div>
                          </div>
                          <span className="shrink-0 px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-[10px] font-bold text-slate-700 whitespace-nowrap max-w-[90px] text-right leading-tight">
                            {inf.category}
                          </span>
                        </div>

                        {/* Bio */}
                        {inf.bio && (
                          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-normal">
                            {inf.bio}
                          </p>
                        )}

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                              Followers
                            </div>
                            <div className="text-sm font-black text-slate-900 mt-0.5">
                              {formatNumber(inf.followersCount)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[9px] text-slate-500 uppercase font-bold tracking-wider">
                              Engagement
                            </div>
                            <div className="text-sm font-black text-emerald-600 mt-0.5">
                              {inf.engagementRate}%
                            </div>
                          </div>
                        </div>

                        {/* Reel counter */}
                        {isSelected && (
                          <div className="flex items-center justify-center gap-3 bg-amber-50 border border-amber-300 rounded-xl py-2">
                            <button
                              type="button"
                              onClick={() => updateReelsCount(inf.id, -1)}
                              className="w-7 h-7 rounded-lg bg-white border border-amber-300 shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-amber-100 transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-black text-amber-950 min-w-[64px] text-center">
                              {reels} Reel{reels > 1 ? "s" : ""}
                            </span>
                            <button
                              type="button"
                              onClick={() => updateReelsCount(inf.id, 1)}
                              className="w-7 h-7 rounded-lg bg-white border border-amber-300 shadow-sm flex items-center justify-center text-slate-700 hover:text-slate-950 hover:bg-amber-100 transition-colors"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Card Footer */}
                      <div className="px-4 sm:px-5 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
                        <a
                          href={inf.instaProfileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1 shrink-0"
                        >
                          View Profile
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <button
                          type="button"
                          onClick={() => toggleSelect(inf.id)}
                          className={`px-3.5 py-2 rounded-xl font-extrabold text-xs transition-all ${
                            isSelected
                              ? "bg-amber-100 border border-amber-400 text-amber-900"
                              : "bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white shadow-gold-sm hover:brightness-105"
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
            <div className="bg-white rounded-3xl border-2 border-[#D4AF37] shadow-xl overflow-hidden">
              {/* Panel Header */}
              <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" /> Package Summary
                </h3>
                <span className="text-[10px] text-amber-900 font-bold font-mono border border-amber-300 px-2 py-0.5 rounded bg-amber-100 tracking-wider">
                  CONFIDENTIAL
                </span>
              </div>

              <div className="p-5 space-y-4">
                {/* Selected Breakdown */}
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {selectedIds.length === 0 ? (
                    <div className="text-center py-5 text-xs text-slate-500 font-medium italic">
                      Select creators to calculate total
                    </div>
                  ) : (
                    selectedIds.map((id) => {
                      const creator = influencers.find((i) => i.id === id);
                      const count = selectedMap[id] || 1;
                      return (
                        <div
                          key={id}
                          className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <img
                              src={creator?.avatar}
                              alt={creator?.name}
                              className="w-7 h-7 rounded-full object-cover border border-[#D4AF37] shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-slate-900 truncate leading-tight">{creator?.name}</div>
                              <div className="text-[10px] text-slate-500 font-mono truncate">{creator?.instaHandle}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-1.5 py-1 shadow-sm">
                              <button
                                onClick={() => updateReelsCount(id, -1)}
                                className="text-slate-500 hover:text-slate-900 transition-colors"
                              >
                                <Minus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-amber-900 font-bold text-[10px] min-w-[28px] text-center">
                                {count}R
                              </span>
                              <button
                                onClick={() => updateReelsCount(id, 1)}
                                className="text-slate-500 hover:text-slate-900 transition-colors"
                              >
                                <Plus className="w-2.5 h-2.5" />
                              </button>
                            </div>
                            <button
                              onClick={() => toggleSelect(id)}
                              className="text-red-500 hover:text-red-700 transition-colors"
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
                <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-md">
                  <div className="flex items-center justify-between text-xs text-amber-100 font-semibold mb-1">
                    <span>Package Estimate</span>
                    <span className="text-white font-bold">{totalReelsCount} Reel{totalReelsCount !== 1 ? "s" : ""}</span>
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-white">
                    {formatCurrency(totalEstimatedPrice)}
                  </div>
                  <div className="text-[10px] text-amber-100 mt-1 font-medium">Individual rates are confidential</div>
                </div>

                {/* Form */}
                <form onSubmit={handleProceedToPayment} className="space-y-3">
                  <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider pt-1">
                    Producer / Client Info
                  </div>

                  {[
                    { label: "Name *", key: "producerName", type: "text", placeholder: "e.g. Vikramaditya Roy", Icon: User },
                    { label: "Email *", key: "producerEmail", type: "email", placeholder: "producer@studio.com", Icon: Mail },
                    { label: "Phone *", key: "producerPhone", type: "text", placeholder: "+91 98765 43210", Icon: Phone },
                  ].map(({ label, key, type, placeholder, Icon }) => (
                    <div key={key}>
                      <label className="block text-slate-700 text-xs font-bold mb-1">{label}</label>
                      <div className="relative">
                        <Icon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type={type}
                          required
                          placeholder={placeholder}
                          value={producerDetails[key as keyof typeof producerDetails]}
                          onChange={(e) => setProducerDetails({ ...producerDetails, [key]: e.target.value })}
                          className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-2.5 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="submit"
                    disabled={selectedIds.length === 0}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-sm shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed mt-1"
                  >
                    <span>Proceed to UPI Payment</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {selectedIds.length === 0 && (
                    <p className="text-center text-[10px] text-slate-500 font-medium">Select at least one creator to continue</p>
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
            className="mx-3 mb-3 flex items-center justify-between gap-3 bg-white/95 backdrop-blur-xl border-2 border-[#D4AF37] rounded-2xl px-4 py-3 shadow-xl cursor-pointer"
            onClick={() => setMobilePanelOpen(true)}
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div>
                <div className="text-[10px] text-slate-500 font-bold leading-none">
                  {selectedIds.length === 0
                    ? "No creators selected"
                    : `${selectedIds.length} creator${selectedIds.length > 1 ? "s" : ""} • ${totalReelsCount} reel${totalReelsCount !== 1 ? "s" : ""}`}
                </div>
                <div className="text-base font-black text-slate-900 leading-tight">
                  {formatCurrency(totalEstimatedPrice)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-slate-500 font-bold hidden sm:block">Tap for details</span>
              <ChevronUp className="w-4 h-4 text-amber-600" />
            </div>
          </div>
        )}

        {/* Expanded panel */}
        {mobilePanelOpen && (
          <div className="mx-0 bg-white/98 backdrop-blur-xl border-t-2 border-[#D4AF37] rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto">
            {/* Drag handle + close */}
            <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-200 bg-slate-50">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600" /> Package Summary
              </h3>
              <button
                onClick={() => setMobilePanelOpen(false)}
                className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 hover:text-slate-900"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 pb-8">
              {/* Selected Breakdown */}
              <div className="space-y-2">
                {selectedIds.length === 0 ? (
                  <div className="text-center py-5 text-xs text-slate-500 italic">
                    Select creators above to calculate total
                  </div>
                ) : (
                  selectedIds.map((id) => {
                    const creator = influencers.find((i) => i.id === id);
                    const count = selectedMap[id] || 1;
                    return (
                      <div
                        key={id}
                        className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={creator?.avatar}
                            alt={creator?.name}
                            className="w-7 h-7 rounded-full object-cover border border-[#D4AF37] shrink-0"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-slate-900 truncate">{creator?.name}</div>
                            <div className="text-[10px] text-slate-500 font-mono truncate">{creator?.instaHandle}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg px-1.5 py-1 shadow-sm">
                            <button onClick={() => updateReelsCount(id, -1)} className="text-slate-500 hover:text-slate-900">
                              <Minus className="w-2.5 h-2.5" />
                            </button>
                            <span className="text-amber-900 font-bold text-[10px] min-w-[24px] text-center">{count}R</span>
                            <button onClick={() => updateReelsCount(id, 1)} className="text-slate-500 hover:text-slate-900">
                              <Plus className="w-2.5 h-2.5" />
                            </button>
                          </div>
                          <button onClick={() => toggleSelect(id)} className="text-red-500 hover:text-red-700">
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Total */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 text-white shadow-md">
                <div className="flex items-center justify-between text-xs text-amber-100 font-semibold mb-1">
                  <span>Package Estimate</span>
                  <span className="text-white font-bold">{totalReelsCount} Reel{totalReelsCount !== 1 ? "s" : ""}</span>
                </div>
                <div className="text-2xl font-black text-white">{formatCurrency(totalEstimatedPrice)}</div>
              </div>

              {/* Form */}
              <form onSubmit={handleProceedToPayment} className="space-y-3">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Producer / Client Info
                </div>

                {[
                  { label: "Name *", key: "producerName", type: "text", placeholder: "e.g. Vikramaditya Roy", Icon: User },
                  { label: "Email *", key: "producerEmail", type: "email", placeholder: "producer@studio.com", Icon: Mail },
                  { label: "Phone *", key: "producerPhone", type: "text", placeholder: "+91 98765 43210", Icon: Phone },
                ].map(({ label, key, type, placeholder, Icon }) => (
                  <div key={key}>
                    <label className="block text-slate-700 text-xs font-bold mb-1">{label}</label>
                    <div className="relative">
                      <Icon className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type={type}
                        required
                        placeholder={placeholder}
                        value={producerDetails[key as keyof typeof producerDetails]}
                        onChange={(e) => setProducerDetails({ ...producerDetails, [key]: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3 py-3 text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] focus:ring-2 focus:ring-[#D4AF37]/20 transition-all"
                      />
                    </div>
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={selectedIds.length === 0}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-sm shadow-gold-md hover:brightness-105 transition-all flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
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
