import { NextResponse } from "next/server";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/db";
import { User } from "@/models/User";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findById(id);
    } else {
      user = await User.findOne({ email: id.toLowerCase() });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone || "",
        status: user.status,
        avatar: user.avatar || "",
        is2FAEnabled: user.is2FAEnabled,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;
    const body = await req.json();

    const updateFields: any = {};
    if (body.name !== undefined) updateFields.name = body.name;
    if (body.email !== undefined) updateFields.email = body.email.toLowerCase();
    if (body.role !== undefined) updateFields.role = body.role;
    if (body.phone !== undefined) updateFields.phone = body.phone;
    if (body.avatar !== undefined) updateFields.avatar = body.avatar;
    if (body.status !== undefined) updateFields.status = body.status;
    if (body.is2FAEnabled !== undefined) updateFields.is2FAEnabled = body.is2FAEnabled;

    if (body.password && body.password.trim() !== "") {
      updateFields.passwordHash = await bcrypt.hash(body.password, 10);
    }

    let user = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      user = await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });
    } else {
      user = await User.findOneAndUpdate({ email: id.toLowerCase() }, { $set: updateFields }, { new: true });
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id.toString(),
        _id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        status: user.status,
        avatar: user.avatar,
        is2FAEnabled: user.is2FAEnabled,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    if (mongoose.Types.ObjectId.isValid(id)) {
      await User.findByIdAndDelete(id);
    } else {
      await User.findOneAndDelete({ email: id.toLowerCase() });
    }

    return NextResponse.json({ success: true, message: "User deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete user" }, { status: 500 });
  }
}
