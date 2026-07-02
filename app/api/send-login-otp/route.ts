import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { PREDEFINED_USERS } from "@/lib/data";
import { generateOtp } from "@/lib/registration";
import { createOtpToken } from "@/lib/otp-token";

const resend = new Resend(process.env.RESEND_API_KEY || "re_placeholder_key_not_set");

export async function POST(req: NextRequest) {
  const { userId } = await req.json();
  const user = PREDEFINED_USERS.find(
    u => u.userId.toLowerCase() === userId.trim().toLowerCase() ||
         u.id.toLowerCase() === userId.trim().toLowerCase()
  );
  if (!user) return NextResponse.json({ ok: false, error: "User not found." }, { status: 404 });

  const code = generateOtp();
  const expiresAt = Date.now() + 10 * 60 * 1000;
  const token = await createOtpToken(code, user.id, expiresAt);
  console.log(`[BofA OTP] Code for ${user.firstName}: ${code}`);

  let emailSent = false;
  try {
    const { error } = await resend.emails.send({
      from: "Bank of America <onboarding@resend.dev>",
      to: user.email,
      subject: `${code} is your Bank of America verification code`,
      html: `<div style="font-family:sans-serif;max-width:480px;margin:0 auto;border:1px solid #E5E7EB;border-radius:12px;overflow:hidden"><div style="background:#1C3668;padding:24px;text-align:center"><h2 style="color:#fff;margin:0">Bank of America</h2></div><div style="padding:32px 24px"><p style="color:#1A1A2E;font-size:15px">Hi ${user.firstName},</p><p style="color:#6B7280;font-size:15px">Your verification code is:</p><div style="text-align:center;margin:28px 0"><span style="display:inline-block;background:#F4F6F9;border:2px solid #E5E7EB;border-radius:12px;padding:16px 32px;font-size:32px;font-weight:700;letter-spacing:8px;color:#1C3668;font-family:monospace">${code}</span></div><p style="color:#6B7280;font-size:13px">This code expires in <strong>10 minutes</strong>.</p></div></div>`,
    });
    emailSent = !error;
    if (error) console.error(`[BofA OTP] Email failed — ${error.message}`);
  } catch {
    console.error(`[BofA OTP] Email failed — token still valid`);
  }

  const masked = user.email.replace(/^(.{2})(.*)(@.*)$/, (_, a, b, c) => a + b.replace(/./g, "•") + c);
  return NextResponse.json({
    ok: true,
    maskedEmail: masked,
    userInternalId: user.id,
    token,
    ...(emailSent ? {} : { devCode: code }),
  });
}
