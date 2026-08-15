import mongoose from "mongoose";
import dns from "dns";
import bcrypt from "bcryptjs";
import { User } from "@/models/User";
import { Influencer } from "@/models/Influencer";
import { Campaign } from "@/models/Campaign";
import { INITIAL_ADMIN, INITIAL_INFLUENCERS, INITIAL_USERS, INITIAL_CAMPAIGNS } from "./seedData";

// Configure Node.js to use Google & Cloudflare DNS for MongoDB SRV resolution
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // Ignore if custom DNS setting is restricted
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/bh_reels";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
  seeded: boolean;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

if (!global.mongooseCache) {
  global.mongooseCache = { conn: null, promise: null, seeded: false };
}

const cached = global.mongooseCache;

export async function dbConnect() {
  if (cached.conn) {
    if (!cached.seeded) {
      await seedDatabaseIfEmpty();
      cached.seeded = true;
    }
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: true,
      serverSelectionTimeoutMS: 5000, // 5s timeout
      tls: true,
      tlsAllowInvalidCertificates: true, // Prevents OpenSSL TLS alert 80 rejection on local network proxy / Windows SSL inspection
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(async (m) => {
        console.log("MongoDB connected successfully to BH Reels Atlas database.");
        return m;
      })
      .catch((err) => {
        console.warn("MongoDB Atlas connection warning:", err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    if (!cached.seeded) {
      await seedDatabaseIfEmpty();
      cached.seeded = true;
    }
  } catch (e: any) {
    cached.promise = null;
    console.warn("Using resilient store connection fallback:", e.message);
    return null;
  }

  return cached.conn;
}

async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Admin User & Users if empty
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log("Seeding default Admin and Initial Users into MongoDB...");
      const hashedPassword = await bcrypt.hash(process.env.ADMIN_DEFAULT_PASSWORD || "admin123", 10);

      const adminUser = new User({
        name: INITIAL_ADMIN.name,
        email: INITIAL_ADMIN.email.toLowerCase(),
        passwordHash: hashedPassword,
        role: "admin",
        phone: INITIAL_ADMIN.phone,
        avatar: INITIAL_ADMIN.avatar,
        is2FAEnabled: true,
        status: "active",
      });
      await adminUser.save();

      for (const u of INITIAL_USERS) {
        const passHash = await bcrypt.hash("user123", 10);
        await User.create({
          name: u.name,
          email: u.email.toLowerCase(),
          passwordHash: passHash,
          role: u.role,
          phone: u.phone,
          avatar: u.avatar,
          status: u.status,
          is2FAEnabled: false,
        });
      }
      console.log("Users seeded successfully.");
    }

    // 2. Seed Influencers if empty
    const influencerCount = await Influencer.countDocuments();
    if (influencerCount === 0) {
      console.log("Seeding Initial Influencers into MongoDB...");
      for (const inf of INITIAL_INFLUENCERS) {
        await Influencer.create({
          name: inf.name,
          instaHandle: inf.instaHandle,
          instaProfileUrl: inf.instaProfileUrl,
          ratePerReel: inf.ratePerReel,
          followersCount: inf.followersCount,
          engagementRate: inf.engagementRate,
          category: inf.category,
          email: inf.email,
          phone: inf.phone,
          location: inf.location,
          status: inf.status,
          avatar: inf.avatar,
          bio: inf.bio,
          totalReelsCompleted: inf.totalReelsCompleted,
          averageRating: inf.averageRating,
        });
      }
      console.log("Influencers seeded successfully.");
    }

    // 3. Seed Campaigns if empty
    const campaignCount = await Campaign.countDocuments();
    if (campaignCount === 0) {
      console.log("Seeding Initial Campaigns into MongoDB...");
      for (const cmp of INITIAL_CAMPAIGNS) {
        await Campaign.create({
          title: cmp.title,
          clientName: cmp.clientName,
          producerName: "BH Producer",
          producerEmail: "producer@bhreels.com",
          producerPhone: "+91 98111 22334",
          budget: cmp.budget,
          reelsCount: cmp.reelsCount,
          assignedInfluencers: cmp.assignedInfluencers,
          status: cmp.status,
          paymentStatus: "approved",
          startDate: new Date(cmp.startDate),
          endDate: new Date(cmp.endDate),
          targetCategory: cmp.targetCategory,
          notes: cmp.notes,
          deliveredReels: cmp.deliveredReels,
        });
      }

      // Add a pending verification campaign demo
      await Campaign.create({
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
        startDate: new Date("2026-08-20"),
        endDate: new Date("2026-09-20"),
        targetCategory: "Entertainment & Tech",
        deliveredReels: 0,
        notes: "Producer paid via UPI GPay. Waiting for Admin verification.",
      });

      console.log("Campaigns seeded successfully.");
    }
  } catch (err: any) {
    console.error("Database seeding notice:", err.message);
  }
}
