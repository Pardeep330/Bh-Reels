import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const stats = store.getStats();
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch stats" }, { status: 500 });
  }
}
