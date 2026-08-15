import { NextResponse } from "next/server";
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

    const newCampaign = store.addCampaign({
      title: body.title || `${body.producerName}'s Reel Campaign`,
      clientName: body.clientName || body.producerName,
      producerName: body.producerName,
      producerEmail: body.producerEmail,
      producerPhone: body.producerPhone || "",
      budget: Number(body.budget || 0),
      reelsCount: Number(body.reelsCount || 1),
      assignedInfluencers: body.assignedInfluencers || [],
      status: "draft",
      paymentStatus: "pending_verification",
      utrNumber: body.utrNumber,
      paymentScreenshot:
        body.paymentScreenshot ||
        "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=400",
      startDate: new Date().toISOString().split("T")[0],
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      targetCategory: body.targetCategory || "General",
      notes: body.notes || "",
    });

    return NextResponse.json({
      success: true,
      message: "Campaign request & payment UTR submitted successfully! Pending Admin approval.",
      campaign: newCampaign,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to submit campaign request" }, { status: 500 });
  }
}
