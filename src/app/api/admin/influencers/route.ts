import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Influencer } from "@/models/Influencer";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");

    const query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { instaHandle: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
    }

    if (minRate || maxRate) {
      query.ratePerReel = {};
      if (minRate) query.ratePerReel.$gte = Number(minRate);
      if (maxRate) query.ratePerReel.$lte = Number(maxRate);
    }

    const influencers = await Influencer.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: influencers.length,
      influencers: influencers.map((inf) => ({
        id: inf._id.toString(),
        _id: inf._id.toString(),
        name: inf.name,
        instaHandle: inf.instaHandle,
        instaProfileUrl: inf.instaProfileUrl,
        ratePerReel: inf.ratePerReel,
        followersCount: inf.followersCount,
        engagementRate: inf.engagementRate,
        category: inf.category,
        email: inf.email || "",
        phone: inf.phone || "",
        location: inf.location || "Mumbai, India",
        status: inf.status,
        avatar: inf.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: inf.bio || "",
        totalReelsCompleted: inf.totalReelsCompleted || 0,
        averageRating: inf.averageRating || 4.8,
        createdAt: inf.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch influencers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.name || !body.instaHandle || !body.ratePerReel) {
      return NextResponse.json(
        { error: "Name, Instagram handle, and rate per reel are required" },
        { status: 400 }
      );
    }

    const cleanHandle = body.instaHandle.startsWith("@") ? body.instaHandle : `@${body.instaHandle}`;

    const newInfluencer = await Influencer.create({
      name: body.name,
      instaHandle: cleanHandle,
      instaProfileUrl: body.instaProfileUrl || `https://instagram.com/${cleanHandle.replace("@", "")}`,
      ratePerReel: Number(body.ratePerReel),
      followersCount: Number(body.followersCount || 10000),
      engagementRate: Number(body.engagementRate || 4.2),
      category: body.category || "Lifestyle",
      email: body.email || "",
      phone: body.phone || "",
      location: body.location || "Mumbai, India",
      status: body.status || "active",
      avatar: body.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      bio: body.bio || "",
      totalReelsCompleted: 0,
      averageRating: 5.0,
    });

    return NextResponse.json({
      success: true,
      influencer: {
        id: newInfluencer._id.toString(),
        _id: newInfluencer._id.toString(),
        name: newInfluencer.name,
        instaHandle: newInfluencer.instaHandle,
        instaProfileUrl: newInfluencer.instaProfileUrl,
        ratePerReel: newInfluencer.ratePerReel,
        followersCount: newInfluencer.followersCount,
        engagementRate: newInfluencer.engagementRate,
        category: newInfluencer.category,
        email: newInfluencer.email,
        phone: newInfluencer.phone,
        location: newInfluencer.location,
        status: newInfluencer.status,
        avatar: newInfluencer.avatar,
        bio: newInfluencer.bio,
        totalReelsCompleted: newInfluencer.totalReelsCompleted,
        averageRating: newInfluencer.averageRating,
        createdAt: newInfluencer.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create influencer" }, { status: 500 });
  }
}
