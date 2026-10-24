import { NextResponse } from "next/server";
import { store } from "@/lib/store";
import { sendOtpEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    store.setOtp(cleanEmail, otpCode);

    // Send real email via SMTP
    const emailResult = await sendOtpEmail({
      to: cleanEmail,
      otp: otpCode,
      purpose: "Password Reset",
      expiresInMinutes: 10,
    });

    return NextResponse.json({
      success: true,
      message: emailResult.success
        ? `Password reset OTP has been sent to ${cleanEmail}. Please check your inbox.`
        : "Failed to send OTP email. Please try again.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Request failed" }, { status: 500 });
  }
}

