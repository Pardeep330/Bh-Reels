import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findOne({ email: auth.email.toLowerCase() });

    if (!user) {
      return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        avatar: user.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300",
        is2FAEnabled: user.is2FAEnabled,
        status: user.status,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    const user = await User.findOne({ email: auth.email.toLowerCase() });
    if (!user) {
      return NextResponse.json({ error: "Admin profile not found" }, { status: 404 });
    }

    if (body.name) user.name = body.name;
    if (body.phone !== undefined) user.phone = body.phone;
    if (body.avatar) user.avatar = body.avatar;
    if (body.is2FAEnabled !== undefined) user.is2FAEnabled = Boolean(body.is2FAEnabled);

    if (body.newPassword) {
      if (body.currentPassword) {
        const isMatch = await bcrypt.compare(body.currentPassword, user.passwordHash);
        if (!isMatch) {
          return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }
      }
      user.passwordHash = await bcrypt.hash(body.newPassword, 10);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      message: "Admin profile updated successfully",
      profile: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        avatar: user.avatar,
        is2FAEnabled: user.is2FAEnabled,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update profile" }, { status: 500 });
  }
}
