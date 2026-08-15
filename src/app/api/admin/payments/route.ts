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
      utrNumber: { $exists: true, $ne: "" },
    }).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      pendingCount: pendingCampaigns.length,
      pendingCampaigns: pendingCampaigns.map((c) => ({
        id: c._id.toString(),
        _id: c._id.toString(),
        title: c.title,
        clientName: c.clientName,
        producerName: c.producerName || "",
        producerEmail: c.producerEmail || "",
        producerPhone: c.producerPhone || "",
        budget: c.budget,
        utrNumber: c.utrNumber || "",
        paymentScreenshot: c.paymentScreenshot || "",
        paymentStatus: c.paymentStatus,
        createdAt: c.createdAt,
      })),
      allPayments: allPayments.map((c) => ({
        id: c._id.toString(),
        _id: c._id.toString(),
        title: c.title,
        clientName: c.clientName,
        budget: c.budget,
        utrNumber: c.utrNumber || "",
        paymentStatus: c.paymentStatus,
        rejectionReason: c.rejectionReason || "",
        createdAt: c.createdAt,
      })),
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
