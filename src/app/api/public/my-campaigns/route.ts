import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Campaign } from "@/models/Campaign";

export async function GET(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    const query: any = {};
    if (email) {
      query.$or = [
        { producerEmail: { $regex: email.trim(), $options: "i" } },
        { clientName: { $regex: email.trim(), $options: "i" } },
      ];
    } else if (phone) {
      query.producerPhone = phone.trim();
    }

    const campaigns = await Campaign.find(query).sort({ createdAt: -1 }).limit(30);

    // Populate influencer records if selectedCreators is missing
    const { Influencer } = await import("@/models/Influencer");
    const allInfluencers = await Influencer.find({}).lean();
    const influencerMap = new Map(allInfluencers.map((i: any) => [i._id.toString(), i]));
    allInfluencers.forEach((i: any) => {
      if (i.id) influencerMap.set(i.id, i);
    });

    return NextResponse.json({
      success: true,
      count: campaigns.length,
      campaigns: campaigns.map((cmp: any) => {
        let creators = cmp.selectedCreators || [];
        if ((!creators || creators.length === 0) && cmp.assignedInfluencers && cmp.assignedInfluencers.length > 0) {
          creators = cmp.assignedInfluencers.map((id: string) => {
            const inf = influencerMap.get(id);
            return {
              id,
              name: inf?.name || id,
              instaHandle: inf?.instaHandle || "",
              avatar: inf?.avatar || "",
              category: inf?.category || "",
              ratePerReel: inf?.ratePerReel || 0,
              reelCount: 1,
              subtotal: inf?.ratePerReel || 0,
            };
          });
        }

        return {
          id: cmp._id.toString(),
          _id: cmp._id.toString(),
          title: cmp.title,
          clientName: cmp.clientName,
          producerName: cmp.producerName || cmp.clientName,
          producerEmail: cmp.producerEmail || "",
          producerPhone: cmp.producerPhone || "",
          budget: cmp.budget,
          reelsCount: cmp.reelsCount,
          assignedInfluencers: cmp.assignedInfluencers || [],
          selectedCreators: creators,
          selectedMap: cmp.selectedMap || {},
          status: cmp.status,
          paymentStatus: cmp.paymentStatus || "pending_verification",
          utrNumber: cmp.utrNumber || "",
          paymentScreenshot: cmp.paymentScreenshot || "",
          rejectionReason: cmp.rejectionReason || "",
          startDate: cmp.startDate,
          endDate: cmp.endDate,
          notes: cmp.notes || cmp.description || "",
          deliveredReels: cmp.deliveredReels || 0,
          createdAt: cmp.createdAt,
        };
      }),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch client campaigns" }, { status: 500 });
  }
}
