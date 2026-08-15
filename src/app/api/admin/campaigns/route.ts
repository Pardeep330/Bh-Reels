import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";
import { verifyAdminAuth } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const status = searchParams.get("status");
    const paymentStatus = searchParams.get("paymentStatus");

    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { clientName: { $regex: search, $options: "i" } },
        { producerName: { $regex: search, $options: "i" } },
        { targetCategory: { $regex: search, $options: "i" } },
      ];
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (paymentStatus && paymentStatus !== "All") {
      query.paymentStatus = paymentStatus;
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      count: campaigns.length,
      campaigns: campaigns.map((cmp) => ({
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
        notes: cmp.notes || "",
        description: cmp.description || "",
        posterUrl: cmp.posterUrl || "",
        youtubeUrl: cmp.youtubeUrl || "",
        spotifyUrl: cmp.spotifyUrl || "",
        instagramUrl: cmp.instagramUrl || "",
        deliveredReels: cmp.deliveredReels || 0,
        createdAt: cmp.createdAt,
      })),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch campaigns" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const auth = verifyAdminAuth(req);
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    await dbConnect();
    const body = await req.json();

    if (!body.title || !body.clientName || body.budget === undefined || body.budget === null) {
      return NextResponse.json(
        { error: "Title and client name are required" },
        { status: 400 }
      );
    }

    const newCampaign = await Campaign.create({
      title: body.title,
      clientName: body.clientName,
      producerName: body.producerName || "",
      producerEmail: body.producerEmail || "",
      producerPhone: body.producerPhone || "",
      budget: Number(body.budget),
      reelsCount: Number(body.reelsCount || 1),
      assignedInfluencers: body.assignedInfluencers || [],
      status: body.status || "active",
      paymentStatus: body.paymentStatus || "approved",
      utrNumber: body.utrNumber || "",
      paymentScreenshot: body.paymentScreenshot || "",
      startDate: body.startDate ? new Date(body.startDate) : new Date(),
      endDate: body.endDate ? new Date(body.endDate) : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      targetCategory: body.targetCategory || "General",
      notes: body.notes || "",
      description: body.description || "",
      posterUrl: body.posterUrl || "",
      youtubeUrl: body.youtubeUrl || "",
      spotifyUrl: body.spotifyUrl || "",
      instagramUrl: body.instagramUrl || "",
      deliveredReels: Number(body.deliveredReels || 0),
    });

    return NextResponse.json({
      success: true,
      campaign: {
        id: newCampaign._id.toString(),
        _id: newCampaign._id.toString(),
        title: newCampaign.title,
        clientName: newCampaign.clientName,
        producerName: newCampaign.producerName,
        producerEmail: newCampaign.producerEmail,
        producerPhone: newCampaign.producerPhone,
        budget: newCampaign.budget,
        reelsCount: newCampaign.reelsCount,
        assignedInfluencers: newCampaign.assignedInfluencers,
        status: newCampaign.status,
        paymentStatus: newCampaign.paymentStatus,
        utrNumber: newCampaign.utrNumber,
        paymentScreenshot: newCampaign.paymentScreenshot,
        startDate: newCampaign.startDate,
        endDate: newCampaign.endDate,
        targetCategory: newCampaign.targetCategory,
        notes: newCampaign.notes,
        description: newCampaign.description,
        posterUrl: newCampaign.posterUrl,
        youtubeUrl: newCampaign.youtubeUrl,
        spotifyUrl: newCampaign.spotifyUrl,
        instagramUrl: newCampaign.instagramUrl,
        deliveredReels: newCampaign.deliveredReels,
        createdAt: newCampaign.createdAt,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to create campaign" }, { status: 500 });
  }
}
