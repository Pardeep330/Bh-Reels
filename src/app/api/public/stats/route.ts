import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { Influencer } from "@/models/Influencer";

export async function GET() {
  try {
    await dbConnect();

    const [
      totalInfluencers,
      activeInfluencers,
      totalCampaigns,
      activeCampaigns,
      completedCampaigns,
      influencerData,
      campaignData,
    ] = await Promise.all([
      Influencer.countDocuments(),
      Influencer.countDocuments({ status: "active" }),
      Campaign.countDocuments({ paymentStatus: "approved" }),
      Campaign.countDocuments({ status: "active", paymentStatus: "approved" }),
      Campaign.countDocuments({ status: "completed", paymentStatus: "approved" }),
      Influencer.find({ status: "active" }, { followersCount: 1, totalReelsCompleted: 1 }),
      Campaign.find({ paymentStatus: "approved" }, { deliveredReels: 1, reelsCount: 1 }),
    ]);

    const totalReach = influencerData.reduce((sum, inf) => sum + (inf.followersCount || 0), 0);
    const totalReelsDelivered = campaignData.reduce((sum, c) => sum + (c.deliveredReels || 0), 0);
    const totalReelsOrdered = campaignData.reduce((sum, c) => sum + (c.reelsCount || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalInfluencers,
        activeInfluencers,
        totalCampaigns,
        activeCampaigns,
        completedCampaigns,
        totalReach,
        totalReelsDelivered,
        totalReelsOrdered,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
