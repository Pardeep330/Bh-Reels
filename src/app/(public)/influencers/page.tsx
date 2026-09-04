"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Video,
  Search,
  Instagram,
  ExternalLink,
  Calculator,
  Filter,
  Users,
  Sparkles,
} from "lucide-react";

export default function PublicInfluencersPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

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

  const filtered = influencers.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.instaHandle.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === "All" || i.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-[#D4AF37]/40 text-xs font-bold text-[#B8860B] shadow-sm">
          <Video className="w-4 h-4 text-[#B8860B]" /> BH Reels Verified Creator Roster
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Browse Verified <span className="text-gold-gradient">Instagram Creators</span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto font-medium">
          Explore follower metrics, niche categories, and select creators for your package total calculation.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search creator name, handle, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:border-[#D4AF37]"
            />
          </div>

          <Link
            href="/select-influencers"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 flex items-center gap-2"
          >
            <Calculator className="w-4 h-4" /> Calculate Package Price Estimate
          </Link>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none">
          <span className="text-xs text-slate-600 flex items-center gap-1 font-semibold pr-2">
            <Filter className="w-3.5 h-3.5 text-[#B8860B]" /> Niche:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-white shadow-sm font-bold"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:border-[#D4AF37] hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid - Individual rates HIDDEN */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-500 font-semibold">Loading creator directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((inf) => (
            <div
              key={inf.id}
              className="bg-white p-6 rounded-3xl space-y-5 flex flex-col justify-between border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#D4AF37]/40 transition-all"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={inf.avatar}
                    alt={inf.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">{inf.name}</h3>
                    <div className="text-xs font-mono text-[#B8860B] font-bold flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5" /> {inf.instaHandle}
                    </div>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded bg-slate-100 border border-slate-200 text-[10px] font-bold text-[#B8860B]">
                  {inf.category}
                </span>
              </div>

              {inf.bio && <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{inf.bio}</p>}

              {/* Follower Stats Bar (Rates HIDDEN) */}
              <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-center">
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Followers</div>
                  <div className="text-base font-black text-slate-900">{formatNumber(inf.followersCount)}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-500 uppercase font-semibold">Engagement</div>
                  <div className="text-base font-black text-emerald-600">{inf.engagementRate}%</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <a
                  href={inf.instaProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1"
                >
                  View Profile <ExternalLink className="w-3.5 h-3.5" />
                </a>

                <Link
                  href="/select-influencers"
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-sm hover:brightness-105"
                >
                  Select for Package
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
