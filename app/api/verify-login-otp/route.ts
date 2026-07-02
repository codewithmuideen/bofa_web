import { NextRequest, NextResponse } from "next/server";
import { verifyOtpToken } from "@/lib/otp-token";

export async function POST(req: NextRequest) {
  const { token, code } = await req.json();
  if (!token || !code) return NextResponse.json({ ok: false, error: "Missing token or code." }, { status: 400 });
  const result = await verifyOtpToken(token, code);
  if (!result.ok) return NextResponse.json({ ok: false, error: result.error }, { status: 400 });
  return NextResponse.json({ ok: true });
}
