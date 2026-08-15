"use client";

import React, { useEffect, useState } from "react";
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
  Star,
  Film,
  Music,
  Lock,
} from "lucide-react";

export default function HomePage() {
  const [influencers, setInfluencers] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Producer Calculator Selection State
  const [selectedIds, setSelectedIds] = useState<string[]>(["inf-1", "inf-2"]);

  useEffect(() => {
    fetch("/api/admin/influencers")
      .then((r) => r.json())
      .then((d) => setInfluencers(d.influencers || []))
      .catch(console.error);
  }, []);

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
    <div className="space-y-24 pb-20 overflow-hidden text-gray-100 selection:bg-[#D4AF37] selection:text-black">
      {/* SECTION 1: Top Metallic Announcement Banner */}
      <div className="bg-gradient-to-r from-[#181B2B] via-[#131622] to-[#0E1017] border-b border-[#D4AF37]/30 py-2.5 px-4 text-center text-xs text-gray-300">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[10px] font-extrabold text-[#D4AF37]">
            <Sparkles className="w-3 h-3" /> OFFICIAL NETWORK
          </span>
          <span className="font-semibold text-white">
            India's #1 Influencer Network for Film Producers & Brands
          </span>
          <Link
            href="/select-influencers"
            className="hidden sm:inline-flex text-[#D4AF37] font-bold underline hover:text-white transition-colors"
          >
            Calculate Package Total →
          </Link>
        </div>
      </div>

      {/* SECTION 2: Hero Section */}
      <section className="relative pt-10 pb-16 px-4 sm:px-6 lg:px-8 text-center max-w-6xl mx-auto">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gold-radial opacity-35 pointer-events-none rounded-full blur-3xl" />

        <div className="relative z-10 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#131622] border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] shadow-gold-sm">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" /> 2-Step Verified Producer & Creator Portal
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-tight max-w-5xl mx-auto">
            Book Top Creators & Launch <span className="text-gold-gradient">Viral Reel Campaigns</span>
          </h1>

          <p className="text-sm sm:text-base text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Select high-performing Instagram creators for movie releases, audio trends, or brand launches. Get live total package estimates, pay securely via UPI QR, and submit your 12-digit UTR for Admin approval.
          </p>

          {/* Hero Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              href="/select-influencers"
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:shadow-gold-lg hover:brightness-110 transition-all flex items-center gap-2"
            >
              <Calculator className="w-5 h-5" /> Select Creators & Get Total Price
            </Link>

            <Link
              href="/influencers"
              className="px-8 py-4 rounded-2xl bg-[#131622] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-white font-bold text-sm transition-all flex items-center gap-2"
            >
              <Video className="w-5 h-5 text-[#D4AF37]" /> Explore Creator Roster
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 3: Live Real-Time Network Counter Ticker */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-8 rounded-3xl bg-[#0E1017]/90 border border-[#D4AF37]/30 shadow-2xl backdrop-blur-md text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">3.6M+</div>
            <div className="text-xs text-gray-400 font-semibold">Combined Audience Reach</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-gold-gradient">250+</div>
            <div className="text-xs text-gray-400 font-semibold">Viral Reels Delivered</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-white">50+</div>
            <div className="text-xs text-gray-400 font-semibold">Top Verified Creators</div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-emerald-400">100%</div>
            <div className="text-xs text-gray-400 font-semibold">Verified UTR Payments</div>
          </div>
        </div>
      </section>

      {/* SECTION 4: Brand & Production Houses Marquee Trust Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 text-center">
        <div className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Trusted By Leading Film Studios & Labels
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70">
          {brandLogos.map((logo) => (
            <div
              key={logo}
              className="px-4 py-2 rounded-xl bg-[#131622] border border-[#D4AF37]/15 text-xs font-bold text-gray-300 shadow-sm"
            >
              {logo}
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: Category & Niche Selector Filter */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white">Explore Influencer Categories</h2>
          <p className="text-xs text-gray-400">Filter top creators across high-converting niches</p>
        </div>

        <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? "bg-[#D4AF37] text-black shadow-gold-md"
                  : "bg-[#131622] border border-[#D4AF37]/20 text-gray-300 hover:border-[#D4AF37]"
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
            <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-[#D4AF37]" /> Featured Content Creators
            </h2>
            <p className="text-xs text-gray-400">Instagram verified profiles & follower metrics</p>
          </div>
          <Link
            href="/influencers"
            className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
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
                className={`glass-panel glass-panel-hover p-6 rounded-3xl space-y-5 flex flex-col justify-between transition-all ${
                  isSelected ? "border-2 border-[#D4AF37] bg-[#181B2B]/90" : "border border-[#D4AF37]/20"
                }`}
              >
                {/* Header Info */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={inf.avatar}
                      alt={inf.name}
                      className="w-14 h-14 rounded-full object-cover border-2 border-[#D4AF37] shadow-gold-sm"
                    />
                    <div>
                      <h3 className="font-extrabold text-white text-base">{inf.name}</h3>
                      <div className="text-xs font-mono text-[#D4AF37] flex items-center gap-1">
                        <Instagram className="w-3.5 h-3.5" /> {inf.instaHandle}
                      </div>
                      <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-[#1E2230] text-gray-300 font-semibold">
                        {inf.category}
                      </span>
                    </div>
                  </div>
                </div>

                {inf.bio && <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{inf.bio}</p>}

                {/* Follower Stats Card (Rates HIDDEN!) */}
                <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/15 text-center">
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Followers</div>
                    <div className="text-base font-black text-white">{formatNumber(inf.followersCount)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-400 uppercase font-semibold">Engagement</div>
                    <div className="text-base font-black text-emerald-400">{inf.engagementRate}%</div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-2">
                  <a
                    href={inf.instaProfileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#D4AF37] hover:underline flex items-center gap-1"
                  >
                    Insta Profile <ExternalLink className="w-3.5 h-3.5" />
                  </a>

                  <button
                    onClick={() => toggleSelectCreator(inf.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                      isSelected
                        ? "bg-emerald-500 text-black shadow-md"
                        : "bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black shadow-gold-sm hover:brightness-110"
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
        <div className="glass-panel p-8 sm:p-10 rounded-3xl border-2 border-[#D4AF37]/40 shadow-2xl space-y-6 bg-gradient-to-r from-[#131622] via-[#181B2B] to-[#0E1017]">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-[#D4AF37]/20">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-bold text-[#D4AF37] mb-2">
                <Calculator className="w-4 h-4" /> LIVE PACKAGE ESTIMATOR
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                Selected Influencers Total Package Estimate
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Individual rates are kept confidential. Below is the grand total for your selected package.
              </p>
            </div>

            <div className="text-right p-4 rounded-2xl bg-[#0E1017] border border-[#D4AF37]/30">
              <div className="text-xs text-gray-400 font-semibold">
                Selected: <span className="text-white font-bold">{selectedIds.length} Creators</span>
              </div>
              <div className="text-3xl font-black text-gold-gradient">{formatCurrency(grandTotalEstimate)}</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="text-xs text-gray-300 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Includes campaign manager, hashtag strategy & reel distribution.
            </div>

            <Link
              href="/select-influencers"
              className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-xs shadow-gold-md hover:brightness-110 transition-all flex items-center gap-2"
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
          <h2 className="text-2xl sm:text-3xl font-black text-white">4-Step Booking & Verification Workflow</h2>
          <p className="text-xs text-gray-400">Simple, transparent, and 100% verified for film producers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              1
            </span>
            <h3 className="text-base font-bold text-white">Select Creators</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Pick creators across tech, fashion, fitness, comedy, or beauty for your movie song or brand launch.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              2
            </span>
            <h3 className="text-base font-bold text-white">Get Total Price</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Our live calculation engine sums the combined package total without revealing individual rate cards.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              3
            </span>
            <h3 className="text-base font-bold text-white">UPI & UTR Submission</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Scan the BH Reels QR Code, complete UPI payment, and enter your 12-digit UTR reference code.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4 relative">
            <span className="w-10 h-10 rounded-2xl bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] font-black text-sm">
              4
            </span>
            <h3 className="text-base font-bold text-white">Admin Verified Launch</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Admin team verifies the UTR reference with bank logs, approves the booking, and creators publish reels.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 9: Movie & Music Campaign Case Studies Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            <Film className="w-6 h-6 text-[#D4AF37]" /> Successful Campaign Case Studies
          </h2>
          <p className="text-xs text-gray-400">Recent viral reels engineered for film releases & album launches</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <span className="px-2.5 py-1 rounded bg-[#1E2230] text-[10px] font-bold text-[#D4AF37] uppercase">
              Film Release
            </span>
            <h3 className="text-lg font-bold text-white">Diwali Blockbuster Launch</h3>
            <p className="text-xs text-gray-400">
              6 Top Fashion & Entertainment creators posted coordinated ethnic reels generating over 4.2 Million views in 72 hours.
            </p>
            <div className="pt-2 flex justify-between text-xs text-[#D4AF37] font-bold border-t border-gray-800">
              <span>Status: Completed</span>
              <span>4.2M Reach</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <span className="px-2.5 py-1 rounded bg-[#1E2230] text-[10px] font-bold text-[#D4AF37] uppercase">
              Audio Trend
            </span>
            <h3 className="text-lg font-bold text-white">Viral Audio Track Challenge</h3>
            <p className="text-xs text-gray-400">
              Assigned 4 comedy skit creators to launch dance trend reels on new movie title song, driving 15,000+ user reels.
            </p>
            <div className="pt-2 flex justify-between text-xs text-[#D4AF37] font-bold border-t border-gray-800">
              <span>Status: Active</span>
              <span>2.8M Reach</span>
            </div>
          </div>

          <div className="glass-panel p-6 rounded-3xl space-y-4">
            <span className="px-2.5 py-1 rounded bg-[#1E2230] text-[10px] font-bold text-[#D4AF37] uppercase">
              Brand Launch
            </span>
            <h3 className="text-lg font-bold text-white">NextGen Tech Smartphone</h3>
            <p className="text-xs text-gray-400">
              Tech reviewer unboxing reels showcasing 4K camera quality, resulting in 800+ pre-orders.
            </p>
            <div className="pt-2 flex justify-between text-xs text-[#D4AF37] font-bold border-t border-gray-800">
              <span>Status: Active</span>
              <span>1.5M Reach</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 10: Producer & Creator Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-[#D4AF37] fill-current" /> Producer Testimonials
          </h2>
          <p className="text-xs text-gray-400">What film studios and marketing directors say about BH Reels</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-1 text-[#D4AF37]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "BH Reels made booking 8 influencers for our film song release effortless. The UPI UTR payment was verified within 10 minutes, and the campaign went live on schedule."
            </p>
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Vikramaditya Roy</span>
              <span className="text-[#D4AF37]">Executive Producer, Starlight Films</span>
            </div>
          </div>

          <div className="glass-panel p-8 rounded-3xl space-y-4">
            <div className="flex items-center gap-1 text-[#D4AF37]">
              {[...Array(5)].map((_, idx) => (
                <Star key={idx} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <p className="text-xs text-gray-300 italic leading-relaxed">
              "Keeping individual rates confidential while providing a clear total estimate is brilliant. The Admin review team is extremely responsive."
            </p>
            <div className="pt-2 border-t border-gray-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Meera Kapoor</span>
              <span className="text-[#D4AF37]">Marketing Lead, FashionTrendz</span>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 11: Security & UTR Verification Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-8 rounded-3xl space-y-4 bg-gradient-to-br from-[#131622] to-[#1E2230] border border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">100% UTR Verification & Security Guarantee</h3>
              <p className="text-xs text-gray-400">
                All payment transactions require a 12-digit UTR reference code cross-verified with bank logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 12: Frequently Asked Questions (Accordion FAQs) */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-white flex items-center justify-center gap-2">
            <HelpCircle className="w-6 h-6 text-[#D4AF37]" /> Frequently Asked Questions
          </h2>
          <p className="text-xs text-gray-400">Everything producers need to know about booking and UTR payments</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;

            return (
              <div key={idx} className="glass-panel rounded-2xl overflow-hidden border border-[#D4AF37]/20">
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left text-xs font-bold text-white flex items-center justify-between gap-4 hover:bg-[#181B2B]/60 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#D4AF37] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-gray-300 leading-relaxed border-t border-gray-800/50">
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
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#181B2B] via-[#131622] to-[#0E1017] p-10 border border-[#D4AF37]/40 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Launch Your Next Viral Campaign in 3 Minutes
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 max-w-xl">
              Select creators, calculate your total package price, scan the UPI QR code, and submit your UTR for Admin verification.
            </p>
          </div>

          <Link
            href="/select-influencers"
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-[#BF953F] via-[#D4AF37] to-[#AA771C] text-black font-black text-sm shadow-gold-md hover:brightness-110 transition-all flex items-center gap-2 whitespace-nowrap"
          >
            <Calculator className="w-5 h-5" /> Start Price Estimator Engine
          </Link>
        </div>
      </section>
    </div>
  );
}
