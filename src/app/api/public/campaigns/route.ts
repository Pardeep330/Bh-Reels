import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "6");

    // Only show active or completed campaigns publicly
    const campaigns = await Campaign.find({
      status: { $in: ["active", "completed"] },
      paymentStatus: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: campaigns.length,
      campaigns: campaigns.map((cmp) => ({
        id: cmp._id.toString(),
        title: cmp.title,
        clientName: cmp.clientName,
        status: cmp.status,
        reelsCount: cmp.reelsCount,
        deliveredReels: cmp.deliveredReels || 0,
        targetCategory: cmp.targetCategory || "General",
        description: cmp.description || "",
        posterUrl: cmp.posterUrl || "",
        youtubeUrl: cmp.youtubeUrl || "",
        spotifyUrl: cmp.spotifyUrl || "",
        assignedInfluencers: (cmp.assignedInfluencers || []).length,
        startDate: cmp.startDate,
        endDate: cmp.endDate,
        createdAt: cmp.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch campaigns" }, { status: 500 });
  }
}
