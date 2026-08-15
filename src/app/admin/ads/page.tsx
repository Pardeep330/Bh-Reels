"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Header } from "@/components/admin/Header";
import { GlobalLoader } from "@/components/common/GlobalLoader";
import { useAuth } from "@/context/AuthContext";
import {
  Megaphone,
  Plus,
  Search,
  ExternalLink,
  X,
  Youtube,
  Music,
  CheckCircle2,
  Trash2,
  Edit2,
  Image as ImageIcon,
  FileText,
  Upload,
  Loader2,
} from "lucide-react";

export default function AdsPage() {
  const { getAuthHeaders } = useAuth();
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [globalSaving, setGlobalSaving] = useState(false);
  const [loaderMsg, setLoaderMsg] = useState("Saving & Updating Ad Details...");
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState<any>(null);
  const [toastMsg, setToastMsg] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    posterUrl: "",
    youtubeUrl: "",
    spotifyUrl: "",
  });

  useEffect(() => {
    fetchData();
  }, [search]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);

      const res = await fetch(`/api/admin/campaigns?${params.toString()}`, {
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        const d = await res.json();
        setAds(d.campaigns || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setFormData({
      title: "",
      description: "",
      posterUrl: "",
      youtubeUrl: "",
      spotifyUrl: "",
    });
    setShowAddModal(true);
  };

  const handleOpenEdit = (ad: any) => {
    setSelectedAd(ad);
    setFormData({
      title: ad.title || "",
      description: ad.description || ad.notes || "",
      posterUrl: ad.posterUrl || "",
      youtubeUrl: ad.youtubeUrl || "",
      spotifyUrl: ad.spotifyUrl || "",
    });
    setShowEditModal(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setLoaderMsg("Uploading image to server storage...");
    setGlobalSaving(true);
    try {
      const body = new FormData();
      body.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body,
      });

      if (res.ok) {
        const data = await res.json();
        setFormData((prev) => ({ ...prev, posterUrl: data.url }));
        setToastMsg("Poster image uploaded and saved to server!");
        setTimeout(() => setToastMsg(""), 4000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      setGlobalSaving(false);
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter an Ad title.");
      return;
    }

    setLoaderMsg("Creating & Saving New Ad...");
    setGlobalSaving(true);

    try {
      const res = await fetch("/api/admin/campaigns", {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          clientName: "Ada Masuri Ad",
          budget: 50000,
          reelsCount: 1,
          targetCategory: "Ada (Masuri)",
          posterUrl: formData.posterUrl,
          description: formData.description,
          notes: formData.description,
          youtubeUrl: formData.youtubeUrl,
          spotifyUrl: formData.spotifyUrl,
        }),
      });

      const d = await res.json();
      if (res.ok && d.success) {
        if (d.campaign) {
          setAds((prev) => [d.campaign, ...prev]);
        }
        setShowAddModal(false);
        setToastMsg("Ad created successfully!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchData();
      } else {
        alert(d.error || "Failed to create Ad. Please try again.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Network error: " + (e.message || "Failed to submit Ad"));
    } finally {
      setGlobalSaving(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAd) return;
    if (!formData.title.trim()) {
      alert("Please enter an Ad title.");
      return;
    }

    setLoaderMsg("Updating & Patching Ad Details in MongoDB...");
    setGlobalSaving(true);

    try {
      const adId = selectedAd.id || selectedAd._id;
      const res = await fetch(`/api/admin/campaigns/${adId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          title: formData.title,
          posterUrl: formData.posterUrl,
          description: formData.description,
          notes: formData.description,
          youtubeUrl: formData.youtubeUrl,
          spotifyUrl: formData.spotifyUrl,
        }),
      });

      const d = await res.json();
      if (res.ok && d.success) {
        if (d.campaign) {
          setAds((prev) =>
            prev.map((a) => ((a.id || a._id) === adId ? d.campaign : a))
          );
        }
        setShowEditModal(false);
        setToastMsg("Ad details updated successfully!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchData();
      } else {
        alert(d.error || "Failed to update Ad.");
      }
    } catch (e: any) {
      console.error(e);
      alert("Network error updating Ad.");
    } finally {
      setGlobalSaving(false);
    }
  };

  const handleDeleteAd = async () => {
    if (!selectedAd) return;
    setLoaderMsg("Deleting Ad from MongoDB...");
    setGlobalSaving(true);

    try {
      const adId = selectedAd.id || selectedAd._id;
      const res = await fetch(`/api/admin/campaigns/${adId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      if (res.ok) {
        setAds((prev) => prev.filter((a) => (a.id || a._id) !== adId));
        setShowDeleteModal(false);
        setToastMsg("Ad deleted!");
        setTimeout(() => setToastMsg(""), 4000);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGlobalSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Global Loader Overlay */}
      <GlobalLoader isLoading={globalSaving} message={loaderMsg} />

      <Header
        title="Ada (Masuri / Ads) Module"
        subtitle="Server File Upload — Upload poster images, title, description, YouTube & Spotify links"
      />

      {toastMsg && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Control Bar */}
      <div className="glass-panel p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ads by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
          />
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold text-xs shadow-gold-md hover:brightness-110 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add New Ad / Masuri
        </button>
      </div>

      {/* Ads Grid */}
      {loading ? (
        <div className="py-12 text-center text-xs text-gray-400">Loading ads from MongoDB...</div>
      ) : ads.length === 0 ? (
        <div className="glass-panel p-12 rounded-2xl text-center space-y-3">
          <Megaphone className="w-12 h-12 text-[#D4AF37] mx-auto opacity-50" />
          <h3 className="text-base font-bold text-white">No Ads Created Yet</h3>
          <p className="text-xs text-gray-400">Upload a poster image to your server with title, description, YouTube and Spotify links.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ads.map((ad) => {
            const adId = ad.id || ad._id;

            return (
              <div
                key={adId}
                className="glass-panel glass-panel-hover rounded-2xl p-6 relative flex flex-col justify-between space-y-5 border border-[#D4AF37]/20"
              >
                {/* Poster Artwork Header */}
                <div className="relative h-48 rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#0E1017]">
                  {ad.posterUrl ? (
                    <>
                      <img
                        src={ad.posterUrl}
                        alt={ad.title}
                        className="w-full h-full object-cover"
                      />
                      {ad.posterUrl.startsWith("/uploads/") && (
                        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[9px] text-emerald-400 font-mono font-bold border border-emerald-500/30">
                          Server Stored
                        </span>
                      )}
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center bg-[#131622] text-gray-400 space-y-2 p-4 text-center">
                      <ImageIcon className="w-8 h-8 text-[#D4AF37] opacity-60" />
                      <span className="text-[11px] font-semibold text-gray-400">No Poster Image Attached</span>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(ad)}
                        className="px-2.5 py-1 rounded bg-[#D4AF37]/20 hover:bg-[#D4AF37]/30 text-[#D4AF37] font-bold text-[10px] border border-[#D4AF37]/40 transition-all"
                      >
                        + Upload Poster Image
                      </button>
                    </div>
                  )}
                </div>

                {/* Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-white text-base tracking-tight">{ad.title}</h3>
                  <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                    {ad.description || ad.notes || "No description provided."}
                  </p>
                </div>

                {/* Attached Links (YouTube & Spotify) */}
                <div className="flex items-center gap-2 pt-2 border-t border-[#D4AF37]/15">
                  {ad.youtubeUrl ? (
                    <a
                      href={ad.youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-red-900 transition-all"
                    >
                      <Youtube className="w-4 h-4" /> YouTube <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-600 italic">No YouTube link</span>
                  )}

                  {ad.spotifyUrl ? (
                    <a
                      href={ad.spotifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 py-2 px-3 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-emerald-900 transition-all"
                    >
                      <Music className="w-4 h-4" /> Spotify <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-[11px] text-gray-600 italic">No Spotify link</span>
                  )}
                </div>

                {/* Card Actions: Edit & Delete */}
                <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#D4AF37]/10">
                  <button
                    onClick={() => handleOpenEdit(ad)}
                    className="p-1.5 rounded-lg bg-[#181B2B] hover:bg-[#1E2230] text-gray-300 hover:text-white border border-gray-700 transition-colors flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5"
                    title="Edit Everything in Ad"
                  >
                    <Edit2 className="w-3.5 h-3.5 text-[#D4AF37]" /> Edit Ad
                  </button>
                  <button
                    onClick={() => {
                      setSelectedAd(ad);
                      setShowDeleteModal(true);
                    }}
                    className="p-1.5 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 transition-colors"
                    title="Delete Ad"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Ad Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Megaphone className="w-5 h-5 text-[#D4AF37]" /> Add New Ad / Masuri
              </h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              {/* Ad Title */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ad Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starlight Movie Teaser Release"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Server Image Upload Section */}
              <div className="p-4 rounded-xl bg-[#0E1017] border border-[#D4AF37]/30 space-y-3">
                <label className="block text-white font-bold text-xs flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#D4AF37]" /> Upload Poster Image to Server
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:brightness-110 cursor-pointer"
                />

                {uploading && (
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading image to server storage...
                  </div>
                )}

                {/* Or paste URL fallback */}
                <div>
                  <div className="text-[10px] text-gray-400 mb-1">Or paste image URL:</div>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/..."
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full bg-[#131622] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                {formData.posterUrl && (
                  <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-[#D4AF37]">
                    <img src={formData.posterUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-emerald-400 font-bold">
                      {formData.posterUrl.startsWith("/uploads/") ? "Server File" : "Image URL"}
                    </span>
                  </div>
                )}
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-red-400 font-semibold mb-1 flex items-center gap-1">
                  <Youtube className="w-4 h-4" /> YouTube Link
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full bg-[#131622] border border-red-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Spotify Link */}
              <div>
                <label className="block text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                  <Music className="w-4 h-4" /> Spotify Link
                </label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  className="w-full bg-[#131622] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ad Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter teaser details or song release description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110 disabled:opacity-50"
                >
                  Save Ad
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Ad Modal (Edit Everything) */}
      {showEditModal && selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="glass-panel w-full max-w-lg rounded-2xl p-6 border border-[#D4AF37]/40 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#D4AF37]" /> Edit Ad Details (Everything)
              </h3>
              <button onClick={() => setShowEditModal(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
              {/* Ad Title */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ad Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Starlight Movie Teaser Release"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {/* Server Image Upload Section */}
              <div className="p-4 rounded-xl bg-[#0E1017] border border-[#D4AF37]/30 space-y-3">
                <label className="block text-white font-bold text-xs flex items-center gap-1.5">
                  <Upload className="w-4 h-4 text-[#D4AF37]" /> Upload New Poster Image to Server
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3 py-2 text-xs text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#D4AF37] file:text-black hover:file:brightness-110 cursor-pointer"
                />

                {uploading && (
                  <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-bold animate-pulse">
                    <Loader2 className="w-4 h-4 animate-spin" /> Uploading image to server storage...
                  </div>
                )}

                {/* Or paste URL fallback */}
                <div>
                  <div className="text-[10px] text-gray-400 mb-1">Or edit image URL directly:</div>
                  <input
                    type="text"
                    placeholder="https://... or /uploads/..."
                    value={formData.posterUrl}
                    onChange={(e) => setFormData({ ...formData, posterUrl: e.target.value })}
                    className="w-full bg-[#131622] border border-gray-800 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>

                {formData.posterUrl && (
                  <div className="relative w-36 h-24 rounded-lg overflow-hidden border border-[#D4AF37]">
                    <img src={formData.posterUrl} alt="Upload Preview" className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] text-emerald-400 font-bold">
                      {formData.posterUrl.startsWith("/uploads/") ? "Server File" : "Image URL"}
                    </span>
                  </div>
                )}
              </div>

              {/* YouTube Link */}
              <div>
                <label className="block text-red-400 font-semibold mb-1 flex items-center gap-1">
                  <Youtube className="w-4 h-4" /> YouTube Link
                </label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={formData.youtubeUrl}
                  onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                  className="w-full bg-[#131622] border border-red-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-red-500"
                />
              </div>

              {/* Spotify Link */}
              <div>
                <label className="block text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                  <Music className="w-4 h-4" /> Spotify Link
                </label>
                <input
                  type="text"
                  placeholder="https://open.spotify.com/track/..."
                  value={formData.spotifyUrl}
                  onChange={(e) => setFormData({ ...formData, spotifyUrl: e.target.value })}
                  className="w-full bg-[#131622] border border-emerald-500/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 font-semibold mb-1">Ad Description / Notes</label>
                <textarea
                  rows={3}
                  placeholder="Enter teaser details or song release description..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#131622] border border-[#D4AF37]/30 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-extrabold shadow-gold-md hover:brightness-110 disabled:opacity-50 flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Save All Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Ad Modal */}
      {showDeleteModal && selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-red-500/40 space-y-4">
            <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
              <Trash2 className="w-5 h-5" /> Confirm Ad Deletion
            </h3>
            <p className="text-xs text-gray-300">
              Are you sure you want to delete <span className="font-bold text-white">{selectedAd.title}</span>? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl bg-[#131622] text-gray-300 text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteAd}
                className="px-5 py-2 rounded-xl bg-red-600 text-white font-extrabold text-xs hover:bg-red-500"
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
