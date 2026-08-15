import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { campaignId } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const updated = store.approvePayment(campaignId);
    if (!updated) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment approved successfully! Campaign is now active.",
      campaign: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Approval failed" }, { status: 500 });
  }
}
