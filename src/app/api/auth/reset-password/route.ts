import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { email, otp, newPassword } = await req.json();

    if (!email || !otp || !newPassword) {
      return NextResponse.json({ error: "Email, OTP, and new password are required" }, { status: 400 });
    }

    const isValid = store.verifyOtp(email, otp);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid or expired OTP code" }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: "Password reset successful. You can now login with your new password.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Reset failed" }, { status: 500 });
  }
}
