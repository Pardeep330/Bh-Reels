"use client";

import React, { useEffect, useState } from "react";
import { Header } from "@/components/admin/Header";
import {
  Video,
  Search,
  Plus,
  ExternalLink,
  Edit2,
  Trash2,
  Filter,
  Instagram,
  Sparkles,
  X,
  CheckCircle2,
  DollarSign,
  Users,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";

export default function InfluencersPage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxRate, setMaxRate] = useState<number | "">("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedInf, setSelectedInf] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    instaHandle: "",
    instaProfileUrl: "",
    ratePerReel: "",
    followersCount: "",
    category: "Lifestyle",
    email: "",
    phone: "",
    location: "Mumbai, India",
    bio: "",
  });

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
    fetchInfluencers();
  }, [search, selectedCategory, maxRate]);

  const fetchInfluencers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (selectedCategory && selectedCategory !== "All") params.append("category", selectedCategory);
      if (maxRate) params.append("maxRate", maxRate.toString());

      const res = await fetch(`/api/admin/influencers?${params.toString()}`);
      if (res.ok) {
        const d = await res.json();
        setInfluencers(d.influencers || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      name: "",
      instaHandle: "@",
      instaProfileUrl: "",
      ratePerReel: "20000",
      followersCount: "250000",
      category: "Lifestyle",
      email: "",
      phone: "",
      location: "Mumbai, India",
      bio: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (inf: any) => {
    setSelectedInf(inf);
    setFormData({
      name: inf.name,
      instaHandle: inf.instaHandle,
      instaProfileUrl: inf.instaProfileUrl,
      ratePerReel: inf.ratePerReel.toString(),
      followersCount: inf.followersCount.toString(),
      category: inf.category,
      email: inf.email || "",
      phone: inf.phone || "",
      location: inf.location || "Mumbai, India",
      bio: inf.bio || "",
    });
    setShowEditModal(true);
  };

  const handleOpenDelete = (inf: any) => {
    setSelectedInf(inf);
    setShowDeleteModal(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const cleanHandle = formData.instaHandle.startsWith("@") ? formData.instaHandle : `@${formData.instaHandle}`;
      const profileUrl = formData.instaProfileUrl || `https://instagram.com/${cleanHandle.replace("@", "")}`;

      const res = await fetch("/api/admin/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          instaHandle: cleanHandle,
          instaProfileUrl: profileUrl,
        }),
      });

      if (res.ok) {
        setShowAddModal(false);
        fetchInfluencers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInf) return;
    try {
      const cleanHandle = formData.instaHandle.startsWith("@") ? formData.instaHandle : `@${formData.instaHandle}`;
      const profileUrl = formData.instaProfileUrl || `https://instagram.com/${cleanHandle.replace("@", "")}`;

      const res = await fetch(`/api/admin/influencers/${selectedInf.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          instaHandle: cleanHandle,
          instaProfileUrl: profileUrl,
          ratePerReel: Number(formData.ratePerReel),
          followersCount: Number(formData.followersCount),
        }),
      });

      if (res.ok) {
        setShowEditModal(false);
        fetchInfluencers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInf) return;
    try {
      const res = await fetch(`/api/admin/influencers/${selectedInf.id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShowDeleteModal(false);
        fetchInfluencers();
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
    }).format(val);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(0) + "K";
    return num.toString();
  };

  return (
    <div className="space-y-8">
      <Header
        title="Influencer Directory Module"
        subtitle="Add, edit, track reel rates & open Instagram profiles of content creators"
      />

      {/* Control Bar: Search, Category Filters, Max Rate Filter & Add Button */}
      <div className="glass-panel p-6 rounded-2xl space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, handle, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          {/* Filters & Add Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Max Rate Input */}
            <div className="flex items-center gap-2 bg-[#131622] border border-[#D4AF37]/20 rounded-xl px-3 py-2 text-xs">
              <span className="text-gray-400">Max Reel Rate (₹):</span>
              <input
                type="number"
                placeholder="Any"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : "")}
                className="w-24 bg-transparent text-white focus:outline-none font-bold text-xs"
              />
            </div>

            {/* Add Influencer Button */}
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Influencer
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <span className="text-xs text-gray-400 flex items-center gap-1 font-semibold pr-2">
            <Filter className="w-3.5 h-3.5 text-[#D4AF37]" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-black shadow-gold-sm"
                  : "bg-[#131622] border border-[#D4AF37]/20 text-gray-300 hover:border-[#D4AF37]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Influencers Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-400 text-xs">Loading influencer directory...</div>
      ) : influencers.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <Video className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Influencers Found</h3>
          <p className="text-xs text-gray-400">Try adjusting your search criteria or add a new creator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((inf) => (
            <div
              key={inf.id}
              className="glass-panel glass-panel-hover rounded-2xl p-6 relative flex flex-col justify-between space-y-5"
            >
              {/* Card Header: Avatar, Name & Handle */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <img
                    src={inf.avatar}
                    alt={inf.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-gold-sm"
                  />
                  <div>
                    <h3 className="font-extrabold text-white text-base tracking-tight">{inf.name}</h3>
                    <div className="text-xs font-mono text-[#D4AF37] flex items-center gap-1">
                      <Instagram className="w-3.5 h-3.5" /> {inf.instaHandle}
                    </div>
                  </div>
                </div>

                <span className="px-2.5 py-1 rounded-full bg-[#1E2230] border border-[#D4AF37]/30 text-[10px] font-bold text-[#D4AF37]">
                  {inf.category}
                </span>
              </div>

              {/* Bio / Description */}
              {inf.bio && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{inf.bio}</p>}

              {/* Stats Highlight Bar */}
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-[#0E1017]/80 border border-[#D4AF37]/15">
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Rate Per Reel</div>
                  <div className="text-sm font-extrabold text-gold-gradient">
                    {formatCurrency(inf.ratePerReel)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] text-gray-400 uppercase font-semibold">Followers</div>
                  <div className="text-sm font-extrabold text-white">
                    {formatNumber(inf.followersCount)}
                  </div>
                </div>
              </div>

              {/* Contact & Location Info */}
              <div className="text-[11px] text-gray-400 space-y-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" /> {inf.location || "Mumbai, India"}
                </div>
                {inf.email && (
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-gray-500" /> {inf.email}
                  </div>
                )}
              </div>

              {/* Card Footer Actions */}
              <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
                <a
                  href={inf.instaProfileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] flex items-center gap-1.5 transition-all"
                >
                  <Instagram className="w-3.5 h-3.5" /> View Profile <ExternalLink className="w-3 h-3" />
                </a>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEdit(inf)}
                    className="p-1.5 rounded-lg bg-[#181B2B] hover:bg-[#1E2230] text-gray-300 hover:text-white border border-gray-700 transition-colors"
                    title="Edit Influencer"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleOpenDelete(inf)}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors"
                    title="Delete Influencer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Influencer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#D4AF37]" /> Add New Influencer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Instagram Handle *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. @rohan_vlogs"
                    value={formData.instaHandle}
                    onChange={(e) => setFormData({ ...formData, instaHandle: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Rate Per Reel (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 25000"
                    value={formData.ratePerReel}
                    onChange={(e) => setFormData({ ...formData, ratePerReel: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Followers Count *</label>
                  <input
                    type="number"
                    required
                    placeholder="e.g. 450000"
                    value={formData.followersCount}
                    onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c} className="bg-[#131622]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/handle"
                    value={formData.instaProfileUrl}
                    onChange={(e) => setFormData({ ...formData, instaProfileUrl: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="creator@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-300 font-semibold mb-1">Creator Bio / Highlights</label>
                <textarea
                  rows={2}
                  placeholder="Short description of content niche..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110"
                >
                  Save Influencer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Influencer Modal */}
      {showEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-xl rounded-2xl p-6 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit Influencer ({selectedInf?.name})
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Instagram Handle</label>
                  <input
                    type="text"
                    required
                    value={formData.instaHandle}
                    onChange={(e) => setFormData({ ...formData, instaHandle: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Rate Per Reel (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.ratePerReel}
                    onChange={(e) => setFormData({ ...formData, ratePerReel: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Followers Count</label>
                  <input
                    type="number"
                    required
                    value={formData.followersCount}
                    onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  >
                    {categories.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c} className="bg-[#131622]">
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1">Instagram Profile URL</label>
                  <input
                    type="url"
                    value={formData.instaProfileUrl}
                    onChange={(e) => setFormData({ ...formData, instaProfileUrl: e.target.value })}
                    className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D4AF37]/20">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 font-semibold hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110"
                >
                  Update Influencer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-red-500/40 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-white">Delete Influencer?</h3>
            <p className="text-xs text-gray-400">
              Are you sure you want to remove <span className="text-white font-bold">{selectedInf?.name}</span>? This action will remove them from active campaign pools.
            </p>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-800">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-300 text-xs font-semibold hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-xs font-bold hover:bg-red-700 shadow-md"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
