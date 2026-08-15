import mongoose, { Schema, Document, Model } from "mongoose";

export interface ICampaign extends Document {
  title: string;
  clientName: string;
  producerName?: string;
  producerEmail?: string;
  producerPhone?: string;
  budget: number;
  reelsCount: number;
  assignedInfluencers: string[]; // Influencer IDs or Handles
  status: "draft" | "active" | "completed" | "on_hold";
  paymentStatus: "pending_verification" | "approved" | "rejected";
  utrNumber?: string;
  paymentScreenshot?: string;
  rejectionReason?: string;
  startDate: Date;
  endDate: Date;
  targetCategory: string;
  notes?: string;
  description?: string;
  posterUrl?: string;
  youtubeUrl?: string;
  spotifyUrl?: string;
  instagramUrl?: string;
  deliveredReels: number;
  createdAt: Date;
  updatedAt: Date;
}

const CampaignSchema: Schema = new Schema<ICampaign>(
  {
    title: { type: String, required: true, trim: true },
    clientName: { type: String, required: true, trim: true },
    producerName: { type: String, default: "" },
    producerEmail: { type: String, default: "" },
    producerPhone: { type: String, default: "" },
    budget: { type: Number, required: true, min: 0 },
    reelsCount: { type: Number, required: true, min: 1 },
    assignedInfluencers: [{ type: String }],
    status: { type: String, enum: ["draft", "active", "completed", "on_hold"], default: "active" },
    paymentStatus: {
      type: String,
      enum: ["pending_verification", "approved", "rejected"],
      default: "approved",
    },
    utrNumber: { type: String, default: "" },
    paymentScreenshot: { type: String, default: "" },
    rejectionReason: { type: String, default: "" },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: () => new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    targetCategory: { type: String, default: "General" },
    notes: { type: String, default: "" },
    description: { type: String, default: "" },
    posterUrl: { type: String, default: "" },
    youtubeUrl: { type: String, default: "" },
    spotifyUrl: { type: String, default: "" },
    instagramUrl: { type: String, default: "" },
    deliveredReels: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Campaign: Model<ICampaign> =
  mongoose.models.Campaign || mongoose.model<ICampaign>("Campaign", CampaignSchema);
