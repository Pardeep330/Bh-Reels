import nodemailer, { type Transporter } from "nodemailer";

// Lazy initialization of transporter so environment variables are loaded properly
let transporter: Transporter | null = null;

export function getTransporter(): Transporter {
  if (!transporter) {
    const host = process.env.SMTP_HOST || "smtp.gmail.com";
    const port = Number(process.env.SMTP_PORT) || 465;
    const secure = process.env.SMTP_SECURE !== "false"; // true for 465, false for 587
    const user = process.env.SMTP_USER || "no.reply.bhreels@gmail.com";
    const pass = (process.env.SMTP_PASS || "").replace(/\s+/g, "");

    transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: {
        user,
        pass,
      },
    });
  }
  return transporter;
}

export async function verifySmtpConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const mailer = getTransporter();
    await mailer.verify();
    return { success: true, message: "SMTP connection established successfully!" };
  } catch (error: any) {
    console.error("SMTP verification error:", error);
    return { success: false, message: error?.message || "Failed to verify SMTP credentials." };
  }
}

interface SendOtpOptions {
  to: string;
  otp: string;
  purpose?: "2FA Login" | "Password Reset" | "Account Verification";
  expiresInMinutes?: number;
}

export async function sendOtpEmail({
  to,
  otp,
  purpose = "2FA Login",
  expiresInMinutes = 10,
}: SendOtpOptions) {
  try {
    const mailer = getTransporter();
    const from = process.env.EMAIL_FROM || `"Chetan Dada" <${process.env.SMTP_USER || "no.reply.bhreels@gmail.com"}>`;

    const title =
      purpose === "Password Reset"
        ? "Reset Your Password"
        : purpose === "Account Verification"
        ? "Verify Your Account"
        : "Two-Factor Verification Code";

    const subtitle =
      purpose === "Password Reset"
        ? "Use the verification code below to reset your password for Bh-Reels Admin."
        : "A login attempt was made for your Bh-Reels account. Enter this code to proceed:";

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0b0f19;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #e2e8f0;
        }
        .container {
          max-width: 520px;
          margin: 40px auto;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 36px 32px;
          text-align: center;
        }
        .badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .headline {
          font-size: 18px;
          font-weight: 600;
          color: #f8fafc;
          margin: 0 0 10px;
        }
        .text {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0 0 28px;
        }
        .otp-box {
          background: #1e293b;
          border: 2px dashed #f59e0b;
          border-radius: 12px;
          padding: 20px 16px;
          margin: 0 auto 28px;
          display: inline-block;
          min-width: 240px;
        }
        .otp-digits {
          font-family: 'Courier New', Courier, monospace;
          font-size: 38px;
          font-weight: 800;
          letter-spacing: 8px;
          color: #f59e0b;
          text-shadow: 0 0 20px rgba(245, 158, 11, 0.3);
        }
        .expires {
          font-size: 12px;
          color: #64748b;
          margin-top: 8px;
        }
        .security-note {
          background: rgba(15, 23, 42, 0.6);
          border-radius: 8px;
          padding: 14px;
          font-size: 12px;
          color: #94a3b8;
          line-height: 1.5;
          text-align: left;
          border-left: 3px solid #f59e0b;
        }
        .footer {
          padding: 20px 32px;
          background: #0d131f;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 12px;
          color: #475569;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Bh-Reels</h1>
          <p>Security & Authentication</p>
        </div>
        <div class="content">
          <div class="badge">${purpose}</div>
          <div class="headline">${title}</div>
          <p class="text">${subtitle}</p>
          
          <div class="otp-box">
            <div class="otp-digits">${otp}</div>
            <div class="expires">Valid for ${expiresInMinutes} minutes</div>
          </div>

          <div class="security-note">
            ⚠️ <strong>Security Notice:</strong> If you did not initiate this request, someone may be trying to access your account. Please change your password immediately. Never share this code with anyone.
          </div>
        </div>
        <div class="footer">
          Sent by Chetan Dada &bull; Bh-Reels Portal &bull; Automated Security Service
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await mailer.sendMail({
      from,
      to,
      subject: `[Bh-Reels] Your ${purpose} Code: ${otp}`,
      text: `Your ${purpose} verification code is: ${otp}. This code is valid for ${expiresInMinutes} minutes. Never share this code with anyone.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send OTP email:", error);
    return { success: false, error: error?.message || "Failed to send email" };
  }
}

interface SendVerificationEmailOptions {
  to: string;
  name: string;
  verificationUrl: string;
}

export async function sendVerificationEmail({
  to,
  name,
  verificationUrl,
}: SendVerificationEmailOptions) {
  try {
    const mailer = getTransporter();
    const from = process.env.EMAIL_FROM || `"Chetan Dada" <${process.env.SMTP_USER || "no.reply.bhreels@gmail.com"}>`;

    const htmlContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email - BH Reels</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          background-color: #0b0f19;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #e2e8f0;
        }
        .container {
          max-width: 540px;
          margin: 40px auto;
          background: #111827;
          border-radius: 16px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }
        .header {
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          padding: 32px 24px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 26px;
          font-weight: 800;
          color: #ffffff;
          letter-spacing: -0.5px;
        }
        .header p {
          margin: 6px 0 0;
          color: rgba(255, 255, 255, 0.9);
          font-size: 13px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .content {
          padding: 36px 32px;
          text-align: center;
        }
        .badge {
          display: inline-block;
          padding: 6px 14px;
          background: rgba(245, 158, 11, 0.15);
          color: #fbbf24;
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 600;
          margin-bottom: 20px;
        }
        .headline {
          font-size: 20px;
          font-weight: 700;
          color: #f8fafc;
          margin: 0 0 12px;
        }
        .text {
          font-size: 14px;
          color: #94a3b8;
          line-height: 1.6;
          margin: 0 0 28px;
        }
        .btn-box {
          margin: 28px 0;
        }
        .btn {
          display: inline-block;
          background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
          color: #ffffff !important;
          text-decoration: none;
          font-size: 15px;
          font-weight: 800;
          padding: 14px 36px;
          border-radius: 12px;
          box-shadow: 0 4px 15px rgba(245, 158, 11, 0.4);
          letter-spacing: 0.3px;
        }
        .link-fallback {
          background: #1e293b;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 8px;
          padding: 12px;
          font-size: 11px;
          color: #94a3b8;
          word-break: break-all;
          margin-top: 24px;
          text-align: left;
        }
        .link-fallback a {
          color: #fbbf24;
          text-decoration: none;
        }
        .footer {
          padding: 20px 32px;
          background: #0d131f;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          font-size: 12px;
          color: #64748b;
          line-height: 1.5;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>BH Reels</h1>
          <p>Influencer Network &amp; Campaigns</p>
        </div>
        <div class="content">
          <div class="badge">Account Activation</div>
          <div class="headline">Verify Your Email Address</div>
          <p class="text">
            Hello <strong>${name}</strong>,<br>
            Thank you for creating an account with BH Reels. Please verify your email address to activate your account and log in automatically.
          </p>

          <div class="btn-box">
            <a href="${verificationUrl}" class="btn" target="_blank">Verify Email &amp; Sign In</a>
          </div>

          <div class="link-fallback">
            <strong>Can't click the button?</strong> Copy and paste this link in your browser:<br>
            <a href="${verificationUrl}">${verificationUrl}</a>
          </div>
        </div>
        <div class="footer">
          BH Team Studios, Sec 08, Chandigarh, 160009<br>
          Sent by Chetan Dada &bull; Bh-Reels Official Verification
        </div>
      </div>
    </body>
    </html>
    `;

    const info = await mailer.sendMail({
      from,
      to,
      subject: `[BH Reels] Verify your email address - Activate Account`,
      text: `Hello ${name},\n\nPlease verify your email address to activate your BH Reels account:\n${verificationUrl}\n\nIf you did not sign up, please ignore this email.`,
      html: htmlContent,
    });

    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error("Failed to send verification email:", error);
    return { success: false, error: error?.message || "Failed to send email" };
  }
}
