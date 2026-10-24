import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { name, email, phone, password } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const cleanEmail = email.trim().toLowerCase();
    const existingUser = await User.findOne({ email: cleanEmail });

    // Generate secure token valid for 24 hours
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const origin =
      req.headers.get("origin") ||
      req.headers.get("referer")?.replace(/\/$/, "") ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000";

    const baseUrl = origin.replace(/\/$/, "");
    const verificationUrl = `${baseUrl}/verify-email?token=${verificationToken}`;

    if (existingUser) {
      if (existingUser.isEmailVerified) {
        return NextResponse.json(
          { error: "An account with this email already exists and is verified. Please log in." },
          { status: 400 }
        );
      }

      // Existing unverified account: update token and resend
      existingUser.name = name.trim();
      existingUser.phone = phone || existingUser.phone;
      existingUser.passwordHash = await bcrypt.hash(password, 10);
      existingUser.emailVerificationToken = verificationToken;
      existingUser.emailVerificationExpires = expiresAt;
      await existingUser.save();

      await sendVerificationEmail({
        to: cleanEmail,
        name: existingUser.name,
        verificationUrl,
      });

      return NextResponse.json({
        success: true,
        message: `Verification link sent to ${cleanEmail}. Please check your inbox.`,
      });
    }

    // New user creation
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name.trim(),
      email: cleanEmail,
      phone: phone || "",
      passwordHash: hashedPassword,
      role: "user",
      isEmailVerified: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpires: expiresAt,
      is2FAEnabled: false,
      status: "active",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
    });

    await sendVerificationEmail({
      to: cleanEmail,
      name: newUser.name,
      verificationUrl,
    });

    return NextResponse.json({
      success: true,
      message: `Account registered successfully! A verification link has been sent to ${cleanEmail}.`,
    });
  } catch (error: any) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to register account" },
      { status: 500 }
    );
  }
}
