"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { useAuth } from "@/context/AuthContext";
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
  ArrowRight,
  Upload,
  Loader2,
} from "lucide-react";

export default function InfluencersPage() {
  const { getAuthHeaders } = useAuth();
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [maxRate, setMaxRate] = useState<number | "">("");
  const [toastMsg, setToastMsg] = useState("");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, avatar: data.url }));
        setToastMsg("Avatar image uploaded to server!");
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

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
    engagementRate: "4.8",
    category: "Lifestyle",
    email: "",
    phone: "",
    location: "Mumbai, India",
    status: "active",
    avatar: "",
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

      const res = await fetch(`/api/admin/influencers?${params.toString()}`, {
        headers: getAuthHeaders(),
      });
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
      engagementRate: "4.8",
      category: "Lifestyle",
      email: "",
      phone: "",
      location: "Mumbai, India",
      status: "active",
      avatar: "",
      bio: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (inf: any) => {
    setSelectedInf(inf);
    setFormData({
      name: inf.name || "",
      instaHandle: inf.instaHandle || "@",
      instaProfileUrl: inf.instaProfileUrl || "",
      ratePerReel: (inf.ratePerReel || 0).toString(),
      followersCount: (inf.followersCount || 0).toString(),
      engagementRate: (inf.engagementRate || 4.8).toString(),
      category: inf.category || "Lifestyle",
      email: inf.email || "",
      phone: inf.phone || "",
      location: inf.location || "Mumbai, India",
      status: inf.status || "active",
      avatar: inf.avatar || "",
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
        headers: getAuthHeaders(),
        body: JSON.stringify({
          ...formData,
          instaHandle: cleanHandle,
          instaProfileUrl: profileUrl,
          ratePerReel: Number(formData.ratePerReel),
          followersCount: Number(formData.followersCount),
          engagementRate: Number(formData.engagementRate || 4.8),
        }),
      });

      if (res.ok) {
        const d = await res.json();
        if (d.influencer) {
          setInfluencers((prev) => [d.influencer, ...prev]);
        }
        setShowAddModal(false);
        setToastMsg("Influencer created successfully!");
        setTimeout(() => setToastMsg(""), 4000);
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
      const infId = selectedInf.id || selectedInf._id;

      const res = await fetch(`/api/admin/influencers/${infId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: formData.name,
          instaHandle: cleanHandle,
          instaProfileUrl: profileUrl,
          ratePerReel: Number(formData.ratePerReel),
          followersCount: Number(formData.followersCount),
          engagementRate: Number(formData.engagementRate || 4.8),
          category: formData.category,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          status: formData.status,
          avatar: formData.avatar,
          bio: formData.bio,
        }),
      });

      if (res.ok) {
        const d = await res.json();
        if (d.influencer) {
          setInfluencers((prev) =>
            prev.map((i) => ((i.id || i._id) === infId ? d.influencer : i))
          );
        }
        setShowEditModal(false);
        setToastMsg("Influencer updated successfully!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchInfluencers();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!selectedInf) return;
    try {
      const infId = selectedInf.id || selectedInf._id;
      const res = await fetch(`/api/admin/influencers/${infId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setInfluencers((prev) => prev.filter((i) => (i.id || i._id) !== infId));
        setShowDeleteModal(false);
        setToastMsg("Influencer deleted successfully!");
        setTimeout(() => setToastMsg(""), 4000);
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
    }).format(val || 0);
  };

  const formatNumber = (num: number) => {
    if (!num) return "0";
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

      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name, handle, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-[#D4AF37] transition-all"
            />
          </div>

          {/* Filters & Add Button */}
          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Max Rate Input */}
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
              <span className="text-slate-600 font-medium">Max Reel Rate (₹):</span>
              <input
                type="number"
                placeholder="Any"
                value={maxRate}
                onChange={(e) => setMaxRate(e.target.value ? Number(e.target.value) : "")}
                className="w-24 bg-transparent text-slate-900 focus:outline-none font-bold text-xs"
              />
            </div>

            {/* Add Influencer Button */}
            <button
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Add New Influencer
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none">
          <span className="text-xs text-slate-600 flex items-center gap-1 font-bold pr-2">
            <Filter className="w-3.5 h-3.5 text-[#B8860B]" /> Categories:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-white shadow-sm"
                  : "bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Influencers Cards Grid */}
      {loading ? (
        <div className="text-center py-12 text-slate-500 font-semibold text-xs">Loading creator directory from MongoDB...</div>
      ) : influencers.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-3">
          <Video className="w-12 h-12 text-[#B8860B] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-900">No Influencers Found</h3>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or add a new creator.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {influencers.map((inf) => {
            const infId = inf.id || inf._id;

            return (
              <div
                key={infId}
                className="bg-white rounded-3xl p-6 relative flex flex-col justify-between space-y-5 border border-slate-200 shadow-sm hover:shadow-md transition-all"
              >
                {/* Card Header: Avatar, Name & Handle */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={inf.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300"}
                      alt={inf.name}
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm"
                    />
                    <div>
                      <Link href={`/admin/influencers/${infId}`}>
                        <h3 className="font-extrabold text-slate-900 text-base tracking-tight hover:text-[#B8860B] transition-colors flex items-center gap-1">
                          {inf.name} <ArrowRight className="w-3.5 h-3.5 text-[#B8860B] opacity-60" />
                        </h3>
                      </Link>
                      <div className="text-xs font-mono text-[#B8860B] font-bold flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" /> {inf.instaHandle}
                      </div>
                    </div>
                  </div>

                  <span className="px-2.5 py-1 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-bold text-[#B8860B]">
                    {inf.category}
                  </span>
                </div>

                {/* Bio */}
                {inf.bio && <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{inf.bio}</p>}

                {/* Stats Highlight Bar */}
                <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Rate Per Reel</div>
                    <div className="text-sm font-extrabold text-gold-gradient">
                      {formatCurrency(inf.ratePerReel)}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase font-bold">Followers</div>
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatNumber(inf.followersCount)}
                    </div>
                  </div>
                </div>

                {/* Contact & Location Info */}
                <div className="text-[11px] text-slate-600 font-medium space-y-1">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B8860B]" /> {inf.location || "Mumbai, India"}
                  </div>
                  {inf.email && (
                    <div className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" /> {inf.email}
                    </div>
                  )}
                </div>

                {/* Card Footer Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={`/admin/influencers/${infId}`}
                    className="px-3 py-1.5 rounded-lg bg-amber-50 hover:bg-amber-100 border border-amber-200 text-xs font-bold text-[#B8860B] flex items-center gap-1.5 transition-all"
                  >
                    View Analytics <ArrowRight className="w-3 h-3" />
                  </Link>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEdit(inf)}
                      className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 border border-slate-300 transition-colors"
                      title="Edit Influencer"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-[#B8860B]" />
                    </button>
                    <button
                      onClick={() => handleOpenDelete(inf)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                      title="Delete Influencer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Influencer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-[#B8860B]" /> Add New Influencer
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohan Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Instagram Handle *</label>
                  <input
                    type="text"
                    required
                    placeholder="@rohan_vlogs"
                    value={formData.instaHandle}
                    onChange={(e) => setFormData({ ...formData, instaHandle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate Per Reel (₹) *</label>
                  <input
                    type="number"
                    required
                    placeholder="25000"
                    value={formData.ratePerReel}
                    onChange={(e) => setFormData({ ...formData, ratePerReel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Followers Count *</label>
                  <input
                    type="number"
                    required
                    placeholder="450000"
                    value={formData.followersCount}
                    onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    placeholder="4.8"
                    value={formData.engagementRate}
                    onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    placeholder="rohan@creator.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    placeholder="Mumbai, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>

              {/* Server Image Upload */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <label className="block text-slate-900 font-bold text-xs flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#B8860B]" /> Upload Avatar Image to Server
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-700 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-white cursor-pointer"
                />
                {uploading && (
                  <div className="flex items-center gap-2 text-xs text-[#B8860B] font-bold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading image to server...
                  </div>
                )}
                <div>
                  <div className="text-[10px] text-slate-500 mb-1 font-medium">Or paste image URL:</div>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/..."
                    value={formData.avatar}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900"
                  />
                </div>
                {formData.avatar && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[#D4AF37]">
                    <img src={formData.avatar} alt="Avatar Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Creator Bio</label>
                <textarea
                  rows={2}
                  placeholder="Tech reviewer, unboxing reels..."
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold shadow-gold-md hover:brightness-105"
                >
                  Save Influencer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Influencer Modal */}
      {showEditModal && selectedInf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#B8860B]" /> Edit Influencer Details
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-900 font-bold">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Instagram Handle *</label>
                  <input
                    type="text"
                    required
                    value={formData.instaHandle}
                    onChange={(e) => setFormData({ ...formData, instaHandle: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Rate Per Reel (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.ratePerReel}
                    onChange={(e) => setFormData({ ...formData, ratePerReel: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Followers Count *</label>
                  <input
                    type="number"
                    required
                    value={formData.followersCount}
                    onChange={(e) => setFormData({ ...formData, followersCount: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Engagement Rate (%)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.engagementRate}
                    onChange={(e) => setFormData({ ...formData, engagementRate: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  >
                    {categories.filter((c) => c !== "All").map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-slate-900 focus:outline-none focus:bg-white focus:border-[#D4AF37]"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                    <option value="pending">Pending Review</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-extrabold shadow-gold-md hover:brightness-105"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedInf && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 sm:p-8 border border-red-200 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-red-600 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirm Influencer Deletion
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Are you sure you want to remove <span className="font-bold text-slate-900">{selectedInf.name}</span> ({selectedInf.instaHandle})?
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-700 shadow-sm"
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
