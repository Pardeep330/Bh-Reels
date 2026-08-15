import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const campaigns = store.getCampaigns();
    return NextResponse.json({ success: true, count: campaigns.length, campaigns });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || !body.clientName || !body.budget) {
      return NextResponse.json(
        { error: "Title, Client name, and budget are required" },
        { status: 400 }
      );
    }

    const newCampaign = store.addCampaign({
      title: body.title,
      clientName: body.clientName,
      budget: Number(body.budget),
      reelsCount: Number(body.reelsCount || 1),
      assignedInfluencers: body.assignedInfluencers || [],
      status: body.status || "active",
      startDate: body.startDate || new Date().toISOString().split("T")[0],
      endDate: body.endDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      targetCategory: body.targetCategory || "General",
      notes: body.notes || "",
    });

    return NextResponse.json({ success: true, campaign: newCampaign });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
