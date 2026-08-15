import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    const updated = store.updateInfluencer(id, body);
    if (!updated) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, influencer: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update influencer" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const deleted = store.deleteInfluencer(id);
    if (!deleted) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Influencer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete influencer" }, { status: 500 });
  }
}
