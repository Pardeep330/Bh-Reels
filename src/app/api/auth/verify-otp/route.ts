import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP code are required" }, { status: 400 });
    }

    const isValid = store.verifyOtp(email, otp);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP code. Please try again." }, { status: 400 });
    }

    const admin = store.getAdmin();
    const token = `bh_reels_session_${Date.now()}_${Math.random().toString(36).substring(2)}`;

    return NextResponse.json({
      success: true,
      token,
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        avatar: admin.avatar,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "OTP verification failed" }, { status: 500 });
  }
}
