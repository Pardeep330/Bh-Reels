import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const pendingCampaigns = await Campaign.find({
      paymentStatus: "pending_verification",
    }).sort({ createdAt: -1 });

    const allPayments = await Campaign.find({
      $or: [
        { utrNumber: { $exists: true, $ne: "" } },
        { paymentStatus: { $in: ["approved", "pending_verification", "rejected"] } },
        { budget: { $gt: 0 } },
      ],
    }).sort({ createdAt: -1 });

    // Also fetch influencers to populate creator details if needed
    const { Influencer } = await import("@/models/Influencer");
    const allInfluencers = await Influencer.find({}).lean();
    const influencerMap = new Map(allInfluencers.map((i: any) => [i._id.toString(), i]));
    allInfluencers.forEach((i: any) => {
      if (i.id) influencerMap.set(i.id, i);
    });

    const formatCampaign = (c: any) => {
      let creators = c.selectedCreators || [];
      if ((!creators || creators.length === 0) && c.assignedInfluencers && c.assignedInfluencers.length > 0) {
        creators = c.assignedInfluencers.map((id: string) => {
          const inf = influencerMap.get(id);
          return {
            id,
            name: inf?.name || id,
            instaHandle: inf?.instaHandle || "",
            avatar: inf?.avatar || "",
            category: inf?.category || "",
            ratePerReel: inf?.ratePerReel || 0,
            reelCount: 1,
            subtotal: inf?.ratePerReel || 0,
          };
        });
      }

      return {
        id: c._id.toString(),
        _id: c._id.toString(),
        title: c.title,
        clientName: c.clientName,
        producerName: c.producerName || c.clientName || "Producer",
        producerEmail: c.producerEmail || "",
        producerPhone: c.producerPhone || "",
        budget: c.budget,
        reelsCount: c.reelsCount || 1,
        assignedInfluencers: c.assignedInfluencers || [],
        selectedCreators: creators,
        selectedMap: c.selectedMap || {},
        utrNumber: c.utrNumber || "",
        paymentScreenshot: c.paymentScreenshot || "",
        paymentStatus: c.paymentStatus,
        status: c.status,
        targetCategory: c.targetCategory || "General",
        notes: c.notes || c.description || "",
        rejectionReason: c.rejectionReason || "",
        createdAt: c.createdAt,
      };
    };

    return NextResponse.json({
      success: true,
      pendingCount: pendingCampaigns.length,
      pendingCampaigns: pendingCampaigns.map(formatCampaign),
      allPayments: allPayments.map(formatCampaign),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch payments" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { campaignId, action, reason } = await req.json();

    if (!campaignId || !action) {
      return NextResponse.json({ error: "Campaign ID and action are required" }, { status: 400 });
    }

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    if (action === "approve") {
      campaign.paymentStatus = "approved";
      campaign.status = "active";
      campaign.rejectionReason = undefined;
    } else if (action === "reject") {
      campaign.paymentStatus = "rejected";
      campaign.status = "on_hold";
      campaign.rejectionReason = reason || "Payment verification failed or incomplete UTR code.";
    } else {
      return NextResponse.json({ error: "Invalid action. Use 'approve' or 'reject'." }, { status: 400 });
    }

    await campaign.save();

    return NextResponse.json({
      success: true,
      message: `Payment ${action === "approve" ? "approved" : "rejected"} successfully`,
      campaign: {
        id: campaign._id.toString(),
        _id: campaign._id.toString(),
        title: campaign.title,
        paymentStatus: campaign.paymentStatus,
        status: campaign.status,
        rejectionReason: campaign.rejectionReason,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update payment status" }, { status: 500 });
  }
}
