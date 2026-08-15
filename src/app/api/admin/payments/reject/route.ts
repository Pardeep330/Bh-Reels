import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { campaignId, reason } = await req.json();

    if (!campaignId) {
      return NextResponse.json({ error: "Campaign ID is required" }, { status: 400 });
    }

    const updated = store.rejectPayment(campaignId, reason || "Invalid UTR or payment proof mismatch.");
    if (!updated) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Payment rejected.",
      campaign: updated,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Rejection failed" }, { status: 500 });
  }
}
