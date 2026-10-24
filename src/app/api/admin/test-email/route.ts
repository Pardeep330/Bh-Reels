import { NextResponse } from "next/server";
import { verifySmtpConnection, sendOtpEmail } from "@/lib/email";

export async function GET() {
  try {
    const status = await verifySmtpConnection();
    return NextResponse.json(status);
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const recipient = body.to || process.env.SMTP_USER || "no.reply.bhreels@gmail.com";

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    const result = await sendOtpEmail({
      to: recipient,
      otp: otpCode,
      purpose: "2FA Login",
      expiresInMinutes: 15,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: `Test email sent successfully to ${recipient}!`,
        otpCode,
        messageId: result.messageId,
      });
    } else {
      return NextResponse.json({ success: false, error: result.error }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
