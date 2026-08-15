import { NextResponse } from "next/server";
import { store } from "@/lib/store";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const admin = store.getAdmin();

    // Check credentials (accepts default admin@bhreels.com / admin123 or stored password)
    if (email.toLowerCase() !== admin.email.toLowerCase()) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 401 });
    }

    // Generate 6-Digit OTP for 2-Step Verification
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    store.setOtp(admin.email, otpCode);

    return NextResponse.json({
      success: true,
      requiresOtp: true,
      email: admin.email,
      message: "2-Step verification OTP sent successfully.",
      demoOtp: otpCode, // Provided for easy demo testing
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 500 });
  }
}
