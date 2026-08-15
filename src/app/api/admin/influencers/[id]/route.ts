import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { Influencer } from "@/models/Influencer";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    let inf = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      inf = await Influencer.findById(id);
    }
    if (!inf) {
      inf = await Influencer.findOne({ $or: [{ _id: id }, { instaHandle: id }, { instaHandle: `@${id}` }] });
    }

    if (!inf) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      influencer: {
        id: inf._id.toString(),
        _id: inf._id.toString(),
        name: inf.name,
        instaHandle: inf.instaHandle,
        instaProfileUrl: inf.instaProfileUrl,
        ratePerReel: inf.ratePerReel,
        followersCount: inf.followersCount,
        engagementRate: inf.engagementRate,
        category: inf.category,
        email: inf.email || "",
        phone: inf.phone || "",
        location: inf.location || "Mumbai, India",
        status: inf.status,
        avatar: inf.avatar || "",
        bio: inf.bio || "",
        totalReelsCompleted: inf.totalReelsCompleted || 0,
        averageRating: inf.averageRating || 4.8,
        createdAt: inf.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch influencer details" }, { status: 500 });
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

    let inf = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      inf = await Influencer.findByIdAndUpdate(id, body, { new: true });
    } else {
      inf = await Influencer.findOneAndUpdate({ instaHandle: id }, body, { new: true });
    }

    if (!inf) {
      return NextResponse.json({ error: "Influencer not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      influencer: {
        id: inf._id.toString(),
        _id: inf._id.toString(),
        name: inf.name,
        instaHandle: inf.instaHandle,
        instaProfileUrl: inf.instaProfileUrl,
        ratePerReel: inf.ratePerReel,
        followersCount: inf.followersCount,
        engagementRate: inf.engagementRate,
        category: inf.category,
        email: inf.email,
        phone: inf.phone,
        location: inf.location,
        status: inf.status,
        avatar: inf.avatar,
        bio: inf.bio,
        totalReelsCompleted: inf.totalReelsCompleted,
        averageRating: inf.averageRating,
        createdAt: inf.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update influencer" }, { status: 500 });
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
      await Influencer.findByIdAndDelete(id);
    } else {
      await Influencer.findOneAndDelete({ instaHandle: id });
    }

    return NextResponse.json({ success: true, message: "Influencer deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete influencer" }, { status: 500 });
  }
}
