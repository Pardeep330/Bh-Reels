import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const category = searchParams.get("category") || undefined;
    const minRate = searchParams.get("minRate") ? Number(searchParams.get("minRate")) : undefined;
    const maxRate = searchParams.get("maxRate") ? Number(searchParams.get("maxRate")) : undefined;

    const list = store.getInfluencers({ search, category, minRate, maxRate });
    return NextResponse.json({ success: true, count: list.length, influencers: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch influencers" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.name || !body.instaHandle || !body.ratePerReel) {
      return NextResponse.json(
        { error: "Name, Instagram handle, and rate per reel are required" },
        { status: 400 }
      );
    }

    const cleanHandle = body.instaHandle.startsWith("@")
      ? body.instaHandle
      : `@${body.instaHandle}`;

    const newInfluencer = store.addInfluencer({
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
    });

    return NextResponse.json({ success: true, influencer: newInfluencer });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create influencer" }, { status: 500 });
  }
}
