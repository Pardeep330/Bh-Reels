import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const { id } = params;

    let cmp = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cmp = await Campaign.findById(id);
    }
    if (!cmp) {
      cmp = await Campaign.findOne({ _id: id });
    }

    if (!cmp) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: cmp._id.toString(),
        _id: cmp._id.toString(),
        title: cmp.title,
        clientName: cmp.clientName,
        producerName: cmp.producerName || "",
        producerEmail: cmp.producerEmail || "",
        producerPhone: cmp.producerPhone || "",
        budget: cmp.budget,
        reelsCount: cmp.reelsCount,
        assignedInfluencers: cmp.assignedInfluencers || [],
        status: cmp.status,
        paymentStatus: cmp.paymentStatus || "approved",
        utrNumber: cmp.utrNumber || "",
        paymentScreenshot: cmp.paymentScreenshot || "",
        rejectionReason: cmp.rejectionReason || "",
        startDate: cmp.startDate,
        endDate: cmp.endDate,
        targetCategory: cmp.targetCategory || "General",
        deliveredReels: cmp.deliveredReels || 0,
        notes: cmp.notes || "",
        description: cmp.description || "",
        posterUrl: cmp.posterUrl || "",
        youtubeUrl: cmp.youtubeUrl || "",
        spotifyUrl: cmp.spotifyUrl || "",
        instagramUrl: cmp.instagramUrl || "",
        createdAt: cmp.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch campaign details" }, { status: 500 });
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
    if (body.title !== undefined) updateFields.title = body.title;
    if (body.posterUrl !== undefined) updateFields.posterUrl = body.posterUrl;
    if (body.description !== undefined) updateFields.description = body.description;
    if (body.notes !== undefined) updateFields.notes = body.notes;
    if (body.youtubeUrl !== undefined) updateFields.youtubeUrl = body.youtubeUrl;
    if (body.spotifyUrl !== undefined) updateFields.spotifyUrl = body.spotifyUrl;
    if (body.instagramUrl !== undefined) updateFields.instagramUrl = body.instagramUrl;
    if (body.clientName !== undefined) updateFields.clientName = body.clientName;
    if (body.budget !== undefined) updateFields.budget = body.budget;
    if (body.status !== undefined) updateFields.status = body.status;

    let cmp = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      cmp = await Campaign.findByIdAndUpdate(id, { $set: updateFields }, { new: true, runValidators: false });
    }
    if (!cmp) {
      cmp = await Campaign.findOneAndUpdate({ _id: id }, { $set: updateFields }, { new: true });
    }

    if (!cmp) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      campaign: {
        id: cmp._id.toString(),
        _id: cmp._id.toString(),
        title: cmp.title,
        clientName: cmp.clientName,
        producerName: cmp.producerName || "",
        producerEmail: cmp.producerEmail || "",
        producerPhone: cmp.producerPhone || "",
        budget: cmp.budget,
        reelsCount: cmp.reelsCount,
        assignedInfluencers: cmp.assignedInfluencers || [],
        status: cmp.status,
        paymentStatus: cmp.paymentStatus || "approved",
        utrNumber: cmp.utrNumber || "",
        paymentScreenshot: cmp.paymentScreenshot || "",
        rejectionReason: cmp.rejectionReason || "",
        startDate: cmp.startDate,
        endDate: cmp.endDate,
        targetCategory: cmp.targetCategory || "General",
        deliveredReels: cmp.deliveredReels || 0,
        notes: cmp.notes || "",
        description: cmp.description || "",
        posterUrl: cmp.posterUrl || "",
        youtubeUrl: cmp.youtubeUrl || "",
        spotifyUrl: cmp.spotifyUrl || "",
        instagramUrl: cmp.instagramUrl || "",
        createdAt: cmp.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to update campaign" }, { status: 500 });
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
      await Campaign.findByIdAndDelete(id);
    } else {
      await Campaign.findOneAndDelete({ _id: id });
    }

    return NextResponse.json({ success: true, message: "Campaign deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to delete campaign" }, { status: 500 });
  }
}
