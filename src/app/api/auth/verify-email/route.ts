import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "bh_reels_super_secret_gold_key_2026_jwt_token_safe";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired verification link. Please request a new verification email." },
        { status: 400 }
      );
    }

    // Mark as verified and clear tokens
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationExpires = undefined;
    await user.save();

    // Create session token for auto-login
    const jwtToken = jwt.sign(
      {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const userProfile = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      role: user.role,
      avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
      isEmailVerified: true,
    };

    const response = NextResponse.json({
      success: true,
      message: "Email verified successfully! You are now logged in.",
      token: jwtToken,
      user: userProfile,
    });

    response.cookies.set("bh_auth_token", jwtToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to verify email" },
      { status: 500 }
    );
  }
}
