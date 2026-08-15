import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { verifyAdminAuth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { is2FAEnabled } = await req.json();

    const user = await User.findOne({ email: auth.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
    }

    user.is2FAEnabled = Boolean(is2FAEnabled);
    await user.save();

    return NextResponse.json({
      success: true,
      is2FAEnabled: user.is2FAEnabled,
      message: `2-Factor Authentication is now ${user.is2FAEnabled ? "Enabled" : "Disabled"}.`,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update 2FA settings" }, { status: 500 });
  }
}
