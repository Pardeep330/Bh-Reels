import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function GET() {
  try {
    const admin = store.getAdmin();
    return NextResponse.json({ success: true, admin });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const updated = store.updateAdminProfile(body);
    return NextResponse.json({ success: true, admin: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
