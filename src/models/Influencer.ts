import mongoose, { Schema, Document, Model } from "mongoose";

export interface IInfluencer extends Document {
  name: string;
  instaHandle: string;
  instaProfileUrl: string;
  ratePerReel: number;
  followersCount: number;
  engagementRate: number;
  category: string;
  email?: string;
  phone?: string;
  location?: string;
  status: "active" | "inactive" | "pending";
  avatar?: string;
  bio?: string;
  totalReelsCompleted: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
}

const InfluencerSchema: Schema = new Schema<IInfluencer>(
  {
    name: { type: String, required: true, trim: true },
    instaHandle: { type: String, required: true, trim: true },
    instaProfileUrl: { type: String, required: true, trim: true },
    ratePerReel: { type: Number, required: true, min: 0 },
    followersCount: { type: Number, required: true, default: 0 },
    engagementRate: { type: Number, default: 3.5 },
    category: { type: String, required: true, default: "Lifestyle" },
    email: { type: String, default: "" },
    phone: { type: String, default: "" },
    location: { type: String, default: "Mumbai, India" },
    status: { type: String, enum: ["active", "inactive", "pending"], default: "active" },
    avatar: { type: String, default: "" },
    bio: { type: String, default: "" },
    totalReelsCompleted: { type: Number, default: 0 },
    averageRating: { type: Number, default: 4.8 },
  },
  { timestamps: true }
);

export const Influencer: Model<IInfluencer> =
  mongoose.models.Influencer || mongoose.model<IInfluencer>("Influencer", InfluencerSchema);
