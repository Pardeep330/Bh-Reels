import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { Influencer } from "@/models/Influencer";
import { Campaign } from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await dbConnect();

    const [
      totalInfluencers,
      totalUsers,
      totalCampaigns,
      activeCampaigns,
      pendingPayments,
      influencers,
      campaigns,
    ] = await Promise.all([
      Influencer.countDocuments(),
      User.countDocuments(),
      Campaign.countDocuments(),
      Campaign.countDocuments({ status: "active" }),
      Campaign.countDocuments({ paymentStatus: "pending_verification" }),
      Influencer.find({}),
      Campaign.find({}),
    ]);

    const totalReach = influencers.reduce((acc, curr) => acc + (curr.followersCount || 0), 0);
    const avgReelRate = influencers.length
      ? Math.round(influencers.reduce((acc, curr) => acc + (curr.ratePerReel || 0), 0) / influencers.length)
      : 0;
    const totalBudget = campaigns.reduce((acc, curr) => acc + (curr.budget || 0), 0);

    return NextResponse.json({
      success: true,
      stats: {
        totalInfluencers,
        totalUsers,
        totalCampaigns,
        activeCampaigns,
        pendingPayments,
        totalReach,
        avgReelRate,
        totalBudget,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
