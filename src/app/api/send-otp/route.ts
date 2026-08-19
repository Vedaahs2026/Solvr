import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: Request) {
  try {
    const { email, otp } = await request.json();

    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;

    if (!smtpUser || !smtpPass) {
      console.error("Missing SMTP configuration in environment variables");
      return NextResponse.json({ error: "SMTP configuration not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: smtpUser,
        pass: smtpPass
      }
    });

    const mailOptions = {
      from: `"SOLVR Support" <${smtpUser}>`,
      to: email,
      subject: `[SOLVR] Your Verification Code: ${otp}`,
      text: `Hello,

Your One-Time Password (OTP) verification code for logging in to SOLVR is:

${otp}

This code is valid for 10 minutes. If you did not request this code, please ignore this email.

Best regards,
The SOLVR Team`,
      html: `
        <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 500px; margin: 0 auto; padding: 30px; border: 1px solid rgba(6, 78, 59, 0.1); border-radius: 20px; background-color: #fdfbf7;">
          <h2 style="color: #064e3b; margin-top: 0; font-weight: 800; text-align: center; letter-spacing: 0.05em;">SOL<span style="color: #c5a059;">V</span>R</h2>
          <hr style="border: 0; border-top: 1px solid rgba(6, 78, 59, 0.1); margin: 20px 0;" />
          <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">Hello,</p>
          <p style="font-size: 16px; color: #1f2937; line-height: 1.6;">Your One-Time Password (OTP) verification code for logging in to SOLVR is:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="font-size: 32px; font-weight: 800; color: #064e3b; background-color: rgba(6, 78, 59, 0.06); padding: 12px 30px; border-radius: 12px; letter-spacing: 0.15em; border: 1px dashed rgba(6, 78, 59, 0.2); display: inline-block;">
              ${otp}
            </span>
          </div>
          
          <p style="font-size: 14px; color: #6b7280; line-height: 1.5; text-align: center; margin-top: 20px;">
            This code is valid for 10 minutes. If you did not request this verification code, please ignore this email.
          </p>
          <hr style="border: 0; border-top: 1px solid rgba(6, 78, 59, 0.1); margin: 20px 0;" />
          <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
            Sent by SOLVR Store support. Do not reply to this automated email.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Error sending OTP email:", error);
    return NextResponse.json({ error: error.message || "Failed to send OTP email" }, { status: 500 });
  }
}
