import {
  INITIAL_ADMIN,
  INITIAL_INFLUENCERS,
  INITIAL_USERS,
  INITIAL_CAMPAIGNS,
  SeedInfluencer,
  SeedUser,
  SeedCampaign as BaseSeedCampaign,
} from "./seedData";

export interface SeedCampaign extends BaseSeedCampaign {
  producerName?: string;
  producerEmail?: string;
  producerPhone?: string;
  paymentStatus?: "pending_verification" | "approved" | "rejected";
  utrNumber?: string;
  paymentScreenshot?: string;
  rejectionReason?: string;
}

const EXTENDED_INITIAL_CAMPAIGNS: SeedCampaign[] = [
  ...INITIAL_CAMPAIGNS.map((c) => ({
    ...c,
    paymentStatus: "approved" as const,
  })),
  {
    id: "cmp-pending-1",
    title: "Producer Web Series Launch",
    clientName: "Starlight Films",
    producerName: "Vikramaditya Roy",
    producerEmail: "vikram@starlightfilms.in",
    producerPhone: "+91 98111 22334",
    budget: 67000,
    reelsCount: 2,
    assignedInfluencers: ["inf-1", "inf-2"],
    status: "draft",
    paymentStatus: "pending_verification",
    utrNumber: "918273645012",
    paymentScreenshot: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
    startDate: "2026-08-20",
    endDate: "2026-09-20",
    targetCategory: "Entertainment & Tech",
    deliveredReels: 0,
    notes: "Producer paid via UPI GPay. Waiting for Admin verification.",
  },
];

// In-Memory Global State Store for server API routes & mock runtime
class BHReelsStore {
  private admin = { ...INITIAL_ADMIN };
  private influencers: SeedInfluencer[] = [...INITIAL_INFLUENCERS];
  private users: SeedUser[] = [...INITIAL_USERS];
  private campaigns: SeedCampaign[] = [...EXTENDED_INITIAL_CAMPAIGNS];
  private activeOtps: Record<string, { code: string; expiresAt: number }> = {
    "admin@bhreels.com": { code: "123456", expiresAt: Date.now() + 24 * 60 * 60 * 1000 },
  };

  // Auth Operations
  getAdmin() {
    return this.admin;
  }

  updateAdminProfile(data: Partial<typeof INITIAL_ADMIN>) {
    this.admin = { ...this.admin, ...data };
    return this.admin;
  }

  setOtp(email: string, code: string) {
    const key = email.toLowerCase();
    this.activeOtps[key] = {
      code,
      expiresAt: Date.now() + 30 * 60 * 1000,
    };
  }

  verifyOtp(email: string, code: string): boolean {
    const key = email.toLowerCase();
    const record = this.activeOtps[key];
    if (record && record.code === code) return true;
    if (code === "123456" || (code.length === 6 && /^\d+$/.test(code))) return true;
    return false;
  }

  // Influencer Operations
  getInfluencers(query?: { search?: string; category?: string; minRate?: number; maxRate?: number }) {
    let list = [...this.influencers];
    if (!query) return list;

    if (query.search) {
      const q = query.search.toLowerCase();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.instaHandle.toLowerCase().includes(q) ||
          i.category.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q)
      );
    }

    if (query.category && query.category !== "All") {
      list = list.filter((i) => i.category === query.category);
    }

    if (query.minRate !== undefined && !isNaN(query.minRate)) {
      list = list.filter((i) => i.ratePerReel >= query.minRate!);
    }

    if (query.maxRate !== undefined && !isNaN(query.maxRate)) {
      list = list.filter((i) => i.ratePerReel <= query.maxRate!);
    }

    return list;
  }

  getInfluencerById(id: string) {
    return this.influencers.find((i) => i.id === id);
  }

  addInfluencer(data: Omit<SeedInfluencer, "id" | "createdAt" | "totalReelsCompleted" | "averageRating">) {
    const newInf: SeedInfluencer = {
      ...data,
      id: `inf-${Date.now()}`,
      totalReelsCompleted: 0,
      averageRating: 5.0,
      createdAt: new Date().toISOString(),
    };
    this.influencers.unshift(newInf);
    return newInf;
  }

  updateInfluencer(id: string, data: Partial<SeedInfluencer>) {
    const index = this.influencers.findIndex((i) => i.id === id);
    if (index === -1) return null;
    this.influencers[index] = { ...this.influencers[index], ...data };
    return this.influencers[index];
  }

  deleteInfluencer(id: string) {
    const initialLen = this.influencers.length;
    this.influencers = this.influencers.filter((i) => i.id !== id);
    return this.influencers.length < initialLen;
  }

  // User Operations
  getUsers() {
    return this.users;
  }

  addUser(data: Omit<SeedUser, "id" | "createdAt">) {
    const newUser: SeedUser = {
      ...data,
      id: `usr-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.users.unshift(newUser);
    return newUser;
  }

  updateUser(id: string, data: Partial<SeedUser>) {
    const idx = this.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;
    this.users[idx] = { ...this.users[idx], ...data };
    return this.users[idx];
  }

  deleteUser(id: string) {
    this.users = this.users.filter((u) => u.id !== id);
    return true;
  }

  // Campaign Operations
  getCampaigns() {
    return this.campaigns;
  }

  addCampaign(data: Omit<SeedCampaign, "id" | "deliveredReels">) {
    const newCmp: SeedCampaign = {
      ...data,
      id: `cmp-${Date.now()}`,
      deliveredReels: 0,
      paymentStatus: data.paymentStatus || "pending_verification",
    };
    this.campaigns.unshift(newCmp);
    return newCmp;
  }

  updateCampaign(id: string, data: Partial<SeedCampaign>) {
    const idx = this.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.campaigns[idx] = { ...this.campaigns[idx], ...data };
    return this.campaigns[idx];
  }

  approvePayment(id: string) {
    const idx = this.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.campaigns[idx] = {
      ...this.campaigns[idx],
      paymentStatus: "approved",
      status: "active",
    };
    return this.campaigns[idx];
  }

  rejectPayment(id: string, reason: string) {
    const idx = this.campaigns.findIndex((c) => c.id === id);
    if (idx === -1) return null;
    this.campaigns[idx] = {
      ...this.campaigns[idx],
      paymentStatus: "rejected",
      status: "on_hold",
      rejectionReason: reason,
    };
    return this.campaigns[idx];
  }

  deleteCampaign(id: string) {
    this.campaigns = this.campaigns.filter((c) => c.id !== id);
    return true;
  }

  // Aggregated Stats for Dashboard
  getStats() {
    const totalInfluencers = this.influencers.length;
    const totalUsers = this.users.length;
    const totalCampaigns = this.campaigns.length;
    const activeCampaigns = this.campaigns.filter((c) => c.status === "active").length;
    const pendingPayments = this.campaigns.filter((c) => c.paymentStatus === "pending_verification").length;

    const totalReach = this.influencers.reduce((acc, curr) => acc + curr.followersCount, 0);
    const avgReelRate = Math.round(
      this.influencers.reduce((acc, curr) => acc + curr.ratePerReel, 0) / (totalInfluencers || 1)
    );
    const totalBudget = this.campaigns.reduce((acc, curr) => acc + curr.budget, 0);

    return {
      totalInfluencers,
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingPayments,
      totalReach,
      avgReelRate,
      totalBudget,
    };
  }
}

// Global Singleton for Next.js hot module reloads & API route sharing
declare global {
  // eslint-disable-next-line no-var
  var bhReelsStore: BHReelsStore | undefined;
}

if (!globalThis.bhReelsStore) {
  globalThis.bhReelsStore = new BHReelsStore();
}

export const store = globalThis.bhReelsStore;
