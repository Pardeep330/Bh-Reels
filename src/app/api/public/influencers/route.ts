import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Influencer } from "@/models/Influencer";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");

    const query: any = { status: "active" };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { instaHandle: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    if (category && category !== "All") {
      query.category = category;
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
        location: inf.location || "Mumbai, India",
        avatar: inf.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        bio: inf.bio || "",
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch influencers" }, { status: 500 });
  }
}
