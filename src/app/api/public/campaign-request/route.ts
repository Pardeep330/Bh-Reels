import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.producerName || !body.producerEmail || !body.utrNumber) {
      return NextResponse.json(
        { error: "Producer name, email, and 12-digit UTR number are required" },
        { status: 400 }
      );
    }

    await dbConnect();

    const campaignData = {
      title: body.title || `${body.producerName}'s Reel Campaign`,
      clientName: body.clientName || body.producerName,
      producerName: body.producerName,
      producerEmail: body.producerEmail,
      producerPhone: body.producerPhone || "",
      budget: Number(body.budget || 0),
      reelsCount: Number(body.reelsCount || 1),
      assignedInfluencers: body.assignedInfluencers || [],
      selectedCreators: body.selectedCreators || [],
      selectedMap: body.selectedMap || {},
      status: "draft" as const,
      paymentStatus: "pending_verification" as const,
      utrNumber: body.utrNumber.trim(),
      paymentScreenshot: body.paymentScreenshot || "",
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetCategory: body.targetCategory || "General",
      notes: body.notes || "",
      description: body.notes || "",
    };

    // Save to MongoDB
    const newCampaign = await Campaign.create(campaignData);

    // Also mirror to memory store for backward compatibility
    try {
      store.addCampaign({
        ...campaignData,
        startDate: new Date().toISOString().split("T")[0],
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      });
    } catch (e) {}

    return NextResponse.json({
      success: true,
      message: "Campaign request & payment proof submitted successfully! Pending Admin approval.",
      campaign: {
        id: newCampaign._id.toString(),
        _id: newCampaign._id.toString(),
        title: newCampaign.title,
        paymentStatus: newCampaign.paymentStatus,
        status: newCampaign.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit campaign request" }, { status: 500 });
  }
}
