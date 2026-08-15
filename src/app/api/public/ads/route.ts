import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20");

    // Fetch Ada (Masuri) ads — campaigns with this category
    const ads = await Campaign.find({
      targetCategory: { $regex: "Masuri|Ada", $options: "i" },
      paymentStatus: "approved",
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return NextResponse.json({
      success: true,
      count: ads.length,
      ads: ads.map((ad) => ({
        id: ad._id.toString(),
        title: ad.title,
        description: ad.description || ad.notes || "",
        posterUrl: ad.posterUrl || "",
        youtubeUrl: ad.youtubeUrl || "",
        spotifyUrl: ad.spotifyUrl || "",
        status: ad.status,
        clientName: ad.clientName || "",
        createdAt: ad.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch ads" }, { status: 500 });
  }
}
