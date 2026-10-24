import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return NextResponse.json(
        { error: "No account found with this email address" },
        { status: 404 }
      );
    }

    if (user.isEmailVerified) {
      return NextResponse.json({
        success: true,
        alreadyVerified: true,
        message: "Your email is already verified. You can log in directly.",
      });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    user.emailVerificationToken = verificationToken;
    user.emailVerificationExpires = expiresAt;
    await user.save();

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/$/, "") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const baseUrl = origin.replace(/\/$/, "");
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    await sendVerificationEmail({
      to: cleanEmail,
      name: user.name,
      verificationUrl,
    });

    return NextResponse.json({
      success: true,
      message: `A fresh verification link has been sent to ${cleanEmail}. Please check your inbox.`,
    });
  } catch (error: any) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
