export interface SeedInfluencer {
  id: string;
  name: string;
  instaHandle: string;
  instaProfileUrl: string;
  ratePerReel: number;
  followersCount: number;
  engagementRate: number;
  category: string;
  email: string;
  phone: string;
  location: string;
  status: "active" | "inactive" | "pending";
  avatar: string;
  bio: string;
  totalReelsCompleted: number;
  averageRating: number;
  createdAt: string;
}

export interface SeedUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user" | "manager";
  phone: string;
  status: "active" | "inactive" | "suspended";
  avatar: string;
  createdAt: string;
}

export interface SeedCampaign {
  id: string;
  title: string;
  clientName: string;
  budget: number;
  reelsCount: number;
  assignedInfluencers: string[];
  status: "draft" | "active" | "completed" | "on_hold";
  startDate: string;
  endDate: string;
  targetCategory: string;
  deliveredReels: number;
  notes: string;
}

// Initial Admin User Credentials
export const INITIAL_ADMIN = {
  id: "admin-1",
  name: "BH Admin",
  email: "admin@bhreels.com",
  phone: "+91 98765 43210",
  role: "admin" as const,
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
  status: "active" as const,
  createdAt: "2026-01-01T00:00:00.000Z",
};

export const INITIAL_INFLUENCERS: SeedInfluencer[] = [
  {
    id: "inf-1",
    name: "Rohan Sharma",
    instaHandle: "@rohan_vlogs",
    instaProfileUrl: "https://instagram.com/rohan_vlogs",
    ratePerReel: 25000,
    followersCount: 450000,
    engagementRate: 4.8,
    category: "Tech & Gadgets",
    email: "rohan@creator.com",
    phone: "+91 98112 33445",
    location: "Mumbai, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300",
    bio: "Tech reviewer, smartphone unboxing & lifestyle reel creator.",
    totalReelsCompleted: 34,
    averageRating: 4.9,
    createdAt: "2026-02-10T00:00:00.000Z",
  },
  {
    id: "inf-2",
    name: "Ananya Roy",
    instaHandle: "@ananyastyle",
    instaProfileUrl: "https://instagram.com/ananyastyle",
    ratePerReel: 42000,
    followersCount: 1200000,
    engagementRate: 5.2,
    category: "Fashion & Style",
    email: "ananya@fashionhub.in",
    phone: "+91 98771 99283",
    location: "New Delhi, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    bio: "High fashion lookbooks, luxury brand partnerships & ethnic wear reels.",
    totalReelsCompleted: 58,
    averageRating: 4.95,
    createdAt: "2026-02-12T00:00:00.000Z",
  },
  {
    id: "inf-3",
    name: "Vikram Malhotra",
    instaHandle: "@fit_with_vikram",
    instaProfileUrl: "https://instagram.com/fit_with_vikram",
    ratePerReel: 18000,
    followersCount: 280000,
    engagementRate: 6.1,
    category: "Fitness & Wellness",
    email: "vikram@fitindia.com",
    phone: "+91 99102 44112",
    location: "Bengaluru, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300",
    bio: "Certified personal trainer, protein supplement & workout routine creator.",
    totalReelsCompleted: 19,
    averageRating: 4.8,
    createdAt: "2026-03-01T00:00:00.000Z",
  },
  {
    id: "inf-4",
    name: "Sneha Verma",
    instaHandle: "@sneha_foodie",
    instaProfileUrl: "https://instagram.com/sneha_foodie",
    ratePerReel: 15000,
    followersCount: 195000,
    engagementRate: 7.4,
    category: "Food & Culinary",
    email: "sneha@tastytrails.com",
    phone: "+91 97182 66299",
    location: "Jaipur, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=300",
    bio: "Street food discoveries, cafe reviews & easy home recipes.",
    totalReelsCompleted: 42,
    averageRating: 4.85,
    createdAt: "2026-03-15T00:00:00.000Z",
  },
  {
    id: "inf-5",
    name: "Kabir Mehta",
    instaHandle: "@kabir_comedy",
    instaProfileUrl: "https://instagram.com/kabir_comedy",
    ratePerReel: 35000,
    followersCount: 890000,
    engagementRate: 8.9,
    category: "Entertainment & Skits",
    email: "kabir@lolstudios.in",
    phone: "+91 98199 00112",
    location: "Mumbai, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
    bio: "Relatable humor, viral sketches & brand integration comedy reels.",
    totalReelsCompleted: 75,
    averageRating: 5.0,
    createdAt: "2026-04-02T00:00:00.000Z",
  },
  {
    id: "inf-6",
    name: "Priya Patel",
    instaHandle: "@priyapatel_beauty",
    instaProfileUrl: "https://instagram.com/priyapatel_beauty",
    ratePerReel: 30000,
    followersCount: 620000,
    engagementRate: 4.5,
    category: "Beauty & Skincare",
    email: "priya@glowbeauty.com",
    phone: "+91 98334 11099",
    location: "Ahmedabad, India",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=300",
    bio: "Skincare routines, makeup tutorials & product recommendations.",
    totalReelsCompleted: 29,
    averageRating: 4.75,
    createdAt: "2026-04-10T00:00:00.000Z",
  },
];

export const INITIAL_USERS: SeedUser[] = [
  {
    id: "usr-1",
    name: "Aarav Gupta",
    email: "aarav@brandx.com",
    role: "user",
    phone: "+91 98110 00111",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&q=80&w=300",
    createdAt: "2026-05-01T00:00:00.000Z",
  },
  {
    id: "usr-2",
    name: "Meera Kapoor",
    email: "meera@fashiontrendz.io",
    role: "user",
    phone: "+91 98220 22334",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300",
    createdAt: "2026-05-15T00:00:00.000Z",
  },
  {
    id: "usr-3",
    name: "Vikrant Singh",
    email: "vikrant@techbuzz.com",
    role: "manager",
    phone: "+91 98330 33445",
    status: "active",
    avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&q=80&w=300",
    createdAt: "2026-06-01T00:00:00.000Z",
  },
];

export const INITIAL_CAMPAIGNS: SeedCampaign[] = [
  {
    id: "cmp-1",
    title: "Diwali Festive Launch",
    clientName: "Silk & Threads Clothing",
    budget: 250000,
    reelsCount: 6,
    assignedInfluencers: ["inf-2", "inf-6"],
    status: "active",
    startDate: "2026-10-01",
    endDate: "2026-11-05",
    targetCategory: "Fashion & Beauty",
    deliveredReels: 4,
    notes: "Focus on traditional ethnic wear reels with golden lighting.",
  },
  {
    id: "cmp-2",
    title: "NextGen Smartphone Unboxing",
    clientName: "Aura Mobile Tech",
    budget: 150000,
    reelsCount: 4,
    assignedInfluencers: ["inf-1", "inf-5"],
    status: "active",
    startDate: "2026-08-10",
    endDate: "2026-09-01",
    targetCategory: "Tech & Entertainment",
    deliveredReels: 2,
    notes: "High energy camera sample test and reel audio track.",
  },
  {
    id: "cmp-3",
    title: "Whey Protein 30-Day Challenge",
    clientName: "FitMax Nutrition",
    budget: 90000,
    reelsCount: 5,
    assignedInfluencers: ["inf-3"],
    status: "active",
    startDate: "2026-08-01",
    endDate: "2026-08-31",
    targetCategory: "Fitness",
    deliveredReels: 3,
    notes: "Highlight muscle transformation and post-workout shake.",
  },
];
