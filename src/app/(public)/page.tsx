"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Video,
  Calculator,
  TrendingUp,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Instagram,
  CheckCircle2,
  Users,
  Award,
  Zap,
  HelpCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Star,
  Film,
  Music,
  Lock,
  BarChart3,
  Megaphone,
  Clock,
  Youtube,
  Play,
} from "lucide-react";

export default function HomePage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [ads, setAds] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const adsScrollRef = useRef<HTMLDivElement>(null);
  const campaignsScrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Auto-advance banner slider
  useEffect(() => {
    if (ads.length <= 1) return;
    const timer = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % ads.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [ads.length]);

  // Producer Calculator Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>(["inf-1", "inf-2"]);

  useEffect(() => {
    // Fetch influencers
    fetch("/api/admin/influencers")
      .then((r) => r.json())
      .then((d) => setInfluencers(d.influencers || []))
      .catch(console.error);

    // Fetch public campaigns
    fetch("/api/public/campaigns?limit=6")
      .then((r) => r.json())
      .then((d) => setCampaigns(d.campaigns || []))
      .catch(console.error);

    // Fetch Masuri Ads
    fetch("/api/public/ads")
      .then((r) => r.json())
      .then((d) => setAds(d.ads || []))
      .catch(console.error);

    // Fetch live stats
    fetch("/api/public/stats")
      .then((r) => r.json())
      .then((d) => setStats(d.stats || null))
      .catch(console.error);
  }, []);

  const scrollAds = (dir: "left" | "right") => {
    if (adsScrollRef.current) {
      adsScrollRef.current.scrollBy({ left: dir === "right" ? 340 : -340, behavior: "smooth" });
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

  const toggleSelectCreator = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((item) => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Grand Total Estimated Price calculation ONLY (No individual rates shown)
  const grandTotalEstimate = selectedIds.reduce((sum, id) => {
    const creator = influencers.find((i) => i.id === id);
    return sum + (creator ? creator.ratePerReel : 0);
  }, 0);

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

  const brandLogos = [
    "Dharma Productions",
    "T-Series Music",
    "Yash Raj Films",
    "Balaji Motion Pictures",
    "Sony Music India",
    "Zee Music Co",
    "Netflix India",
    "Amazon Prime Video",
  ];

  const faqs = [
    {
      q: "How does the Producer Reel Booking process work?",
      a: "Producers select desired content creators from our network. Our live engine calculates the grand total estimated campaign cost. Once you review the total, scan the UPI QR Code, pay, and submit your 12-digit UTR transaction number for instant Admin approval.",
    },
    {
      q: "Are individual creator rates shown publicly?",
      a: "No. Creator rates are private. BH Reels provides an aggregated grand total estimate for your selected package to ensure privacy and premium studio negotiation.",
    },
    {
      q: "How is payment verified?",
      a: "Payments are made via UPI (GPay, PhonePe, Paytm). After payment, producers enter their 12-digit UTR reference number. Our Admin team cross-verifies the UTR with bank records and approves the campaign within minutes.",
    },
    {
      q: "Can producers request custom audio tracks or movie themes?",
      a: "Yes! In the Producer Selection Engine, you can add custom campaign notes, movie audio tracks, hashtag guidelines, and reel publishing schedules.",
    },
    {
      q: "What happens if a payment UTR is rejected?",
      a: "If a UTR number is mismatched, the Admin team notifies the producer with the exact reason and assists in re-submitting the correct reference or processing refunds.",
    },
  ];

  const filteredInfluencers = influencers.filter(
    (i) => selectedCategory === "All" || i.category === selectedCategory
  );

  return (
    <div className="space-y-24 pb-20 overflow-hidden text-slate-900 selection:bg-[#D4AF37] selection:text-white">
      {/* SECTION 1: Top Metallic Announcement Banner */}
      <div className="bg-gradient-to-r from-amber-50 via-slate-100 to-amber-50 border-b border-[#D4AF37]/30 py-2.5 px-4 text-center text-xs text-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-[10px] font-extrabold text-[#B8860B]">
            <Sparkles className="w-3 h-3" /> OFFICIAL NETWORK
          </span>
          <span className="font-semibold text-slate-900">
            India's #1 Influencer Network for Film Producers & Brands
          </span>
          <Link
            href="/select-influencers"
            className="hidden sm:inline-flex text-[#B8860B] font-bold underline hover:text-slate-900 transition-colors"
          >
            Calculate Package Total →
          </Link>
        </div>
      </div>

      {/* ── MASURI HERO BANNER SLIDER (top of page) ─────────────────── */}
      {ads.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mb-12">
          <div className="relative w-full rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-xl h-[220px] sm:h-[250px] md:h-[270px]">
            {/* Slides */}
            {ads.map((ad, idx) => (
              <div
                key={ad.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${idx === activeSlide ? "opacity-100 scale-100 z-10" : "opacity-0 scale-[0.98] z-0 pointer-events-none"
                  }`}
              >
                {/* Ambient Blurred Background from Poster */}
                {ad.posterUrl && (
                  <div
                    className="absolute inset-0 bg-cover bg-center blur-2xl opacity-15 scale-110 pointer-events-none"
                    style={{ backgroundImage: `url('${ad.posterUrl}')` }}
                  />
                )}

                {/* Subtle Geometric Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-white via-white/90 to-transparent z-0" />

                {/* Grid Layout: Left Content & Right Poster Frame */}
                <div className="relative z-10 h-full flex items-center justify-between p-5 sm:p-7 md:p-9 gap-4 sm:gap-8">
                  {/* Left Side: Info & Action Buttons */}
                  <div className="max-w-xl flex flex-col justify-center space-y-2 sm:space-y-3">
                    <div className="inline-flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] sm:text-xs font-extrabold text-[#B8860B] tracking-wider uppercase">
                      <Sparkles className="w-3 h-3 text-[#B8860B]" /> Featured Spotlight
                    </div>

                    <h2 className="text-lg sm:text-2xl md:text-3xl font-black text-slate-900 leading-tight line-clamp-1">
                      {ad.title}
                    </h2>

                    {ad.description && (
                      <p className="text-xs sm:text-sm text-slate-600 line-clamp-1 sm:line-clamp-2 leading-relaxed">
                        {ad.description}
                      </p>
                    )}

                    {/* CTA Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-1">
                      <a
                        href={ad.youtubeUrl || "#"}
                        target={ad.youtubeUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        onClick={!ad.youtubeUrl ? (e) => e.preventDefault() : undefined}
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Youtube className="w-4 h-4" />
                        <span>YouTube</span>
                      </a>
                      <a
                        href={ad.spotifyUrl || "#"}
                        target={ad.spotifyUrl ? "_blank" : undefined}
                        rel="noreferrer"
                        onClick={!ad.spotifyUrl ? (e) => e.preventDefault() : undefined}
                        className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-xs shadow-md transition-all active:scale-95"
                      >
                        <Music className="w-4 h-4" />
                        <span>Spotify</span>
                      </a>
                    </div>
                  </div>

                  {/* Right Side: Crisp Fitted Artwork/Poster */}
                  <div className="hidden sm:flex shrink-0 h-full py-1 items-center">
                    <div className="relative h-full aspect-[16/9] rounded-2xl overflow-hidden border border-slate-200 shadow-md bg-slate-100">
                      {ad.posterUrl ? (
                        <img
                          src={ad.posterUrl}
                          alt={ad.title}
                          className="w-full h-full object-cover object-center"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-slate-100">
                          <Film className="w-10 h-10 text-[#B8860B]/40" />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Left Nav Arrow */}
            {ads.length > 1 && (
              <>
                <button
                  onClick={() => setActiveSlide((prev) => (prev - 1 + ads.length) % ads.length)}
                  className="absolute left-2.5 sm:left-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-white hover:border-[#D4AF37] transition-all shadow-md"
                  aria-label="Previous Slide"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Right Nav Arrow */}
                <button
                  onClick={() => setActiveSlide((prev) => (prev + 1) % ads.length)}
                  className="absolute right-2.5 sm:right-4 top-1/2 -translate-y-1/2 z-20 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/90 backdrop-blur-md border border-slate-200 flex items-center justify-center text-slate-800 hover:bg-white hover:border-[#D4AF37] transition-all shadow-md"
                  aria-label="Next Slide"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* Dot indicators */}
                <div className="absolute bottom-3 right-4 sm:right-6 z-20 flex items-center gap-1.5 bg-slate-900/10 px-2.5 py-1 rounded-full backdrop-blur-sm border border-slate-300">
                  {ads.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSlide(i)}
                      className={`rounded-full transition-all duration-300 ${i === activeSlide
                        ? "w-5 h-1.5 bg-[#B8860B]"
                        : "w-1.5 h-1.5 bg-slate-400 hover:bg-slate-600"
                        }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}

      {/* SECTION 2: Hero Section */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-radial opacity-40 pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#D4AF37]/40 text-xs font-bold text-[#B8860B] shadow-sm">
            <ShieldCheck className="w-4 h-4 text-[#B8860B]" /> 2-Step Verified Producer & Creator Portal
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight leading-tight max-w-5xl mx-auto">
            Book Top Creators & Launch <span className="text-gold-gradient">Viral Reel Campaigns</span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
            Select high-performing Instagram creators for movie releases, audio trends, or brand launches. Get live total package estimates, pay securely via UPI QR, and submit your 12-digit UTR for Admin approval.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/select-influencers"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-sm shadow-gold-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" /> Select Creators & Get Total Price
            </Link>

            <Link
              href="/influencers"
              className="px-8 py-4 rounded-2xl bg-white border border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-sm shadow-sm transition-all flex items-center gap-2"
            >
              <Video className="w-5 h-5 text-[#B8860B]" /> Explore Creator Roster
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Live Real-Time Network Stats (Dynamic) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-xl backdrop-blur-md text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              {stats ? (
                stats.totalReach >= 1000000
                  ? (stats.totalReach / 1000000).toFixed(1) + "M+"
                  : stats.totalReach >= 1000
                    ? Math.floor(stats.totalReach / 1000) + "K+"
                    : stats.totalReach + "+"
              ) : "—"}
            </div>
            <div className="text-xs text-slate-500 font-semibold">Combined Audience Reach</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold-gradient">
              {stats ? (stats.totalReelsDelivered > 0 ? stats.totalReelsDelivered + "+" : stats.totalReelsOrdered + "+") : "—"}
            </div>
            <div className="text-xs text-slate-500 font-semibold">Reels Ordered</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-slate-900">
              {stats ? stats.activeInfluencers + "+" : "—"}
            </div>
            <div className="text-xs text-slate-500 font-semibold">Verified Active Creators</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-600">
              {stats ? stats.totalCampaigns + "+" : "—"}
            </div>
            <div className="text-xs text-slate-500 font-semibold">Campaigns Completed</div>
          </div>
        </div>
      </section>


      {/* SECTION 5: Brand & Production Houses Marquee Trust Bar */}
      {/* SECTION 5: Brand & Production Houses Marquee Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          Trusted By Leading Film Studios & Labels
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {brandLogos.map((logo) => (
            <div
              key={logo}
              className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-sm"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Category & Niche Selector Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">Explore Influencer Categories</h2>
          <p className="text-xs text-slate-500">Filter top creators across high-converting niches</p>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${selectedCategory === cat
                ? "bg-[#D4AF37] text-white shadow-sm font-black"
                : "bg-white border border-slate-200 text-slate-700 hover:border-[#D4AF37]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* SECTION 6: Featured Creators Roster Grid (NO individual rates shown!) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Video className="w-6 h-6 text-[#B8860B]" /> Featured Content Creators
            </h2>
            <p className="text-xs text-slate-500">Instagram verified profiles & follower metrics</p>
          </div>
          <Link
            href="/influencers"
            className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1"
          >
            View Roster ({filteredInfluencers.length}) <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredInfluencers.slice(0, 6).map((inf) => {
            const isSelected = selectedIds.includes(inf.id);

            return (
              <div
                key={inf.id}
                className={`bg-white p-6 rounded-3xl space-y-5 flex flex-col justify-between transition-all shadow-sm hover:shadow-xl ${isSelected ? "border-2 border-[#D4AF37] bg-amber-50/20" : "border border-slate-200"
                  }`}
              >
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={inf.avatar}
                      alt={inf.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base">{inf.name}</h3>
                      <div className="text-xs font-mono text-[#B8860B] flex items-center gap-1 font-bold">
                        <Instagram className="w-3.5 h-3.5" /> {inf.instaHandle}
                      </div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold">
                        {inf.category}
                      </span>
                    </div>
                  </div>
                </div>

                {inf.bio && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{inf.bio}</p>}

                {/* Follower Stats Card (Rates HIDDEN!) */}
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

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <a
                    href={inf.instaProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#B8860B] hover:underline flex items-center gap-1"
                  >
                    Insta Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleSelectCreator(inf.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${isSelected
                      ? "bg-emerald-600 text-white shadow-md"
                      : "bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white shadow-sm hover:brightness-105"
                      }`}
                  >
                    {isSelected ? "Selected ✓" : "Add to Package"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 7: Interactive Reel Package Estimator Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37]/40 shadow-xl space-y-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/40 text-xs font-bold text-[#B8860B] mb-2">
                <Calculator className="w-4 h-4" /> LIVE PACKAGE ESTIMATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                Selected Influencers Total Package Estimate
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Individual rates are kept confidential. Below is the grand total for your selected package.
              </p>
            </div>

            <div className="text-right p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="text-xs text-slate-500 font-semibold">
                Selected: <span className="text-slate-900 font-bold">{selectedIds.length} Creators</span>
              </div>
              <div className="text-3xl font-black text-gold-gradient">{formatCurrency(grandTotalEstimate)}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-slate-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Includes campaign manager, hashtag strategy & reel distribution.
            </div>

            <Link
              href="/select-influencers"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-xs shadow-gold-md hover:brightness-105 transition-all flex items-center gap-2"
            >
              <span>Customize Package & Pay via UPI</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 8: How It Works for Producers (4-Step Process) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">4-Step Booking & Verification Workflow</h2>
          <p className="text-xs text-slate-500">Simple, transparent, and 100% verified for film producers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] font-black text-sm">
              1
            </span>
            <h3 className="text-base font-bold text-slate-900">Select Creators</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Pick creators across tech, fashion, fitness, comedy, or beauty for your movie song or brand launch.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] font-black text-sm">
              2
            </span>
            <h3 className="text-base font-bold text-slate-900">Get Total Price</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Our live calculation engine sums the combined package total without revealing individual rate cards.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] font-black text-sm">
              3
            </span>
            <h3 className="text-base font-bold text-slate-900">UPI & UTR Submission</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Scan the BH Reels QR Code, complete UPI payment, and enter your 12-digit UTR reference code.
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl space-y-4 border border-slate-200 shadow-sm relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#B8860B] font-black text-sm">
              4
            </span>
            <h3 className="text-base font-bold text-slate-900">Admin Verified Launch</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Admin team verifies the UTR reference with bank logs, approves the booking, and creators publish reels.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: Live Campaigns Showcase (Dynamic from DB) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/30 text-[10px] font-bold text-[#B8860B]">
              <Megaphone className="w-3 h-3" /> LIVE CAMPAIGNS
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center gap-2">
              <Film className="w-6 h-6 text-[#B8860B]" /> Active &amp; Recent Campaigns
            </h2>
            <p className="text-xs text-slate-500">Real campaigns running on our network — live from the database</p>
          </div>

          <div className="flex items-center gap-3">
            {/* Scroll Controls */}
            <div className="flex items-center gap-2 ml-2">
              <button
                onClick={() => campaignsScrollRef.current?.scrollBy({ left: -360, behavior: "smooth" })}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#B8860B] hover:border-[#D4AF37] transition-all shadow-sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => campaignsScrollRef.current?.scrollBy({ left: 360, behavior: "smooth" })}
                className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:text-[#B8860B] hover:border-[#D4AF37] transition-all shadow-sm"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Horizontal Scroller */}
        <div
          ref={campaignsScrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-none pb-4 pt-1"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {(campaigns.length === 0
            ? [
              { id: "f1", targetCategory: "Film Release", title: "Diwali Blockbuster Launch", description: "6 Top Fashion & Entertainment creators posted coordinated ethnic reels generating over 4.2M views in 72 hours.", status: "completed", posterUrl: "", youtubeUrl: "", spotifyUrl: "" },
              { id: "f2", targetCategory: "Audio Trend", title: "Viral Audio Track Challenge", description: "4 comedy skit creators launched dance trend reels on a new movie title song, driving 15K+ user reels.", status: "active", posterUrl: "", youtubeUrl: "", spotifyUrl: "" },
              { id: "f3", targetCategory: "Brand Launch", title: "NextGen Tech Smartphone", description: "Tech reviewer unboxing reels showcasing 4K camera quality, resulting in 800+ pre-orders.", status: "active", posterUrl: "", youtubeUrl: "", spotifyUrl: "" },
            ]
            : campaigns
          ).map((cmp: any) => (
            <div
              key={cmp.id}
              className="shrink-0 w-[300px] sm:w-[340px] bg-white rounded-3xl overflow-hidden border border-slate-200 hover:border-[#D4AF37]/50 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              style={{ scrollSnapAlign: "start" }}
            >
              {/* Poster / Banner */}
              <div className="relative h-44 overflow-hidden bg-slate-100 flex items-center justify-center">
                {cmp.posterUrl ? (
                  <img
                    src={cmp.posterUrl}
                    alt={cmp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 opacity-30">
                    <Film className="w-12 h-12 text-[#B8860B]" />
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-widest">Campaign</span>
                  </div>
                )}

                {/* Play button overlay if YouTube exists */}
                {cmp.youtubeUrl && (
                  <a
                    href={cmp.youtubeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute inset-0 flex items-center justify-center group/play"
                  >
                    <div className="w-12 h-12 rounded-full bg-red-600/90 flex items-center justify-center shadow-lg group-hover/play:scale-110 transition-transform">
                      <Play className="w-5 h-5 text-white fill-white ml-0.5" />
                    </div>
                  </a>
                )}

                {/* Status pill — top right */}
                <div className={`absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm border ${cmp.status === "active"
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-slate-100 border-slate-200 text-slate-600"
                  }`}>
                  {cmp.status === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                  {cmp.status === "active" ? "Live Now" : "Completed"}
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 flex flex-col gap-3 flex-1">
                {/* Title & Description */}
                <div className="flex-1">
                  <h3 className="font-extrabold text-slate-900 text-sm leading-snug line-clamp-2">
                    {cmp.title}
                  </h3>
                  {cmp.description && (
                    <p className="text-[11px] text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
                      {cmp.description}
                    </p>
                  )}
                </div>

                {/* YouTube + Spotify links — always shown */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                  <a
                    href={cmp.youtubeUrl || "#"}
                    target={cmp.youtubeUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={!cmp.youtubeUrl ? (e) => e.preventDefault() : undefined}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] transition-all hover:shadow-md"
                  >
                    <Youtube className="w-3.5 h-3.5" />
                    YouTube
                  </a>
                  <a
                    href={cmp.spotifyUrl || "#"}
                    target={cmp.spotifyUrl ? "_blank" : undefined}
                    rel="noreferrer"
                    onClick={!cmp.spotifyUrl ? (e) => e.preventDefault() : undefined}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-[#1DB954] hover:bg-[#1ed760] text-black font-bold text-[11px] transition-all hover:shadow-md"
                  >
                    <Music className="w-3.5 h-3.5" />
                    Spotify
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 10: Producer & Creator Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-[#B8860B] fill-current" /> Producer Testimonials
          </h2>
          <p className="text-xs text-slate-500">What film studios and marketing directors say about BH Reels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 text-[#B8860B]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "BH Reels made booking 8 influencers for our film song release effortless. The UPI UTR payment was verified within 10 minutes, and the campaign went live on schedule."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Vikramaditya Roy</span>
              <span className="text-[#B8860B] font-semibold">Executive Producer, Starlight Films</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
            <div className="flex items-center gap-1 text-[#B8860B]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-slate-600 italic leading-relaxed">
              "Keeping individual rates confidential while providing a clear total estimate is brilliant. The Admin review team is extremely responsive."
            </p>
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900">Meera Kapoor</span>
              <span className="text-[#B8860B] font-semibold">Marketing Lead, FashionTrendz</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: Security & UTR Verification Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-3xl space-y-4 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">100% UTR Verification & Security Guarantee</h3>
              <p className="text-xs text-slate-500">
                All payment transactions require a 12-digit UTR reference code cross-verified with bank logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: Frequently Asked Questions (Accordion FAQs) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#B8860B]" /> Frequently Asked Questions
          </h2>
          <p className="text-xs text-slate-500">Everything producers need to know about booking and UTR payments</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left text-xs font-bold text-slate-900 flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#B8860B] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-600 leading-relaxed border-t border-slate-100">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 13: High-Impact Conversion CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-500/10 via-amber-400/5 to-slate-50 p-10 border border-[#D4AF37]/40 shadow-xl bg-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
              Launch Your Next Viral Campaign in 3 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 max-w-xl">
              Select creators, calculate your total package price, scan the UPI QR code, and submit your UTR for Admin verification.
            </p>
          </div>

          <Link
            href="/select-influencers"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#B8860B] via-[#D4AF37] to-[#997A15] text-white font-black text-sm shadow-gold-md hover:brightness-105 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Calculator className="w-5 h-5" /> Start Price Estimator Engine
          </Link>
        </div>
      </section>
    </div>
  );
}
