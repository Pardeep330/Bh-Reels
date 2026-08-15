import mongoose, { Schema, Document, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: "admin" | "user" | "manager";
  phone?: string;
  avatar?: string;
  is2FAEnabled: boolean;
  otpCode?: string;
  otpExpiresAt?: Date;
  status: "active" | "inactive" | "suspended";
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user", "manager"], default: "user" },
    phone: { type: String, default: "" },
    avatar: { type: String, default: "" },
    is2FAEnabled: { type: Boolean, default: true },
    otpCode: { type: String, default: null },
    otpExpiresAt: { type: Date, default: null },
    status: { type: String, enum: ["active", "inactive", "suspended"], default: "active" },
  },
  { timestamps: true }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
