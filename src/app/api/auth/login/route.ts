import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { store } from "@/lib/store";
import { sendOtpEmail } from "@/lib/email";

const JWT_SECRET = process.env.JWT_SECRET || "bh_reels_super_secret_gold_key_2026_jwt_token_safe";

export async function POST(req: Request) {
  try {
    const conn = await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();
    const adminEmail = (process.env.ADMIN_EMAIL || "no.reply.bhreels@gmail.com").toLowerCase();
    const smtpEmail = (process.env.SMTP_USER || "no.reply.bhreels@gmail.com").toLowerCase();
    const officialEmail = "bhreels.offical@gmail.com";
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Deep@123";

    const isRecognizedAdminEmail =
      cleanEmail === adminEmail || cleanEmail === smtpEmail || cleanEmail === officialEmail;

    // If MongoDB Atlas is connected, use MongoDB User model
    if (conn) {
      let user = await User.findOne({ email: cleanEmail });

      if (!user && isRecognizedAdminEmail) {
        const hashed = await bcrypt.hash(defaultPassword, 10);
        user = await User.create({
          name: "Chetan Dada",
          email: cleanEmail,
          passwordHash: hashed,
          role: "admin",
          is2FAEnabled: true,
          status: "active",
        });
      }

      if (!user) {
        return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
      }

      let isPasswordValid = await bcrypt.compare(password, user.passwordHash);

      // If logging in with the configured Super Admin password, update hash if needed
      if (!isPasswordValid && isRecognizedAdminEmail && password === defaultPassword) {
        user.passwordHash = await bcrypt.hash(defaultPassword, 10);
        user.role = "admin";
        await user.save();
        isPasswordValid = true;
      }

      if (!isPasswordValid) {
        return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
      }

      // Check for regular user account
      if (user.role !== "admin") {
        if (!user.isEmailVerified) {
          return NextResponse.json(
            {
              error: "Please verify your email address first before logging in. Check your inbox for the activation link.",
              requiresVerification: true,
              email: user.email,
            },
            { status: 403 }
          );
        }

        // User is verified, generate session token and log in
        const token = jwt.sign(
          {
            id: user._id.toString(),
            name: user.name,
            email: user.email,
            role: user.role,
          },
          JWT_SECRET,
          { expiresIn: "7d" }
        );

        const userPayload = {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          phone: user.phone || "",
          role: user.role,
          avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
          isEmailVerified: true,
        };

        const res = NextResponse.json({
          success: true,
          token,
          user: userPayload,
        });

        res.cookies.set("bh_auth_token", token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60,
          path: "/",
        });

        return res;
      }

      // Admin Account: send dynamic OTP for 2FA
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otpCode;
      user.otpExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      // Send OTP to user's email
      const recipientEmail = cleanEmail.endsWith("@bhreels.com") ? smtpEmail : cleanEmail;
      await sendOtpEmail({
        to: recipientEmail,
        otp: otpCode,
        purpose: "2FA Login",
        expiresInMinutes: 15,
      });

      return NextResponse.json({
        success: true,
        requiresOtp: user.is2FAEnabled !== false,
        email: user.email,
        message: `2-Step verification OTP sent to ${recipientEmail}`,
      });
    } else {
      // Resilient fallback when MongoDB Atlas DNS/network is unreachable
      const admin = store.getAdmin();
      const isSuperAdminMatch =
        cleanEmail === admin.email.toLowerCase() ||
        cleanEmail === smtpEmail ||
        cleanEmail === adminEmail ||
        cleanEmail === officialEmail;
      
      if (!isSuperAdminMatch || password !== defaultPassword) {
        return NextResponse.json({ error: "Invalid admin email or password" }, { status: 401 });
      }

      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      store.setOtp(admin.email, otpCode);
      store.setOtp(cleanEmail, otpCode);

      // Send real email via SMTP
      await sendOtpEmail({
        to: smtpEmail,
        otp: otpCode,
        purpose: "2FA Login",
        expiresInMinutes: 15,
      });

      return NextResponse.json({
        success: true,
        requiresOtp: true,
        email: cleanEmail,
        message: `2-Step verification OTP sent to ${smtpEmail}`,
      });
    }
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}

