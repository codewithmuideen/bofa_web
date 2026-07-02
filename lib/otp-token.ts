const OTP_SECRET = process.env.OTP_SECRET ?? "bofa-otp-demo-secret-2026";

async function hmacSign(data: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await globalThis.crypto.subtle.importKey(
    "raw", enc.encode(OTP_SECRET),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]
  );
  const sig = await globalThis.crypto.subtle.sign("HMAC", key, enc.encode(data));
  return Buffer.from(sig).toString("base64url");
}

export async function createOtpToken(code: string, userId: string, expiresAt: number): Promise<string> {
  const sig = await hmacSign(`${code}:${userId}:${expiresAt}`);
  const payload = JSON.stringify({ u: userId, e: expiresAt, s: sig });
  return Buffer.from(payload).toString("base64url");
}

export async function verifyOtpToken(token: string, submittedCode: string):
  Promise<{ ok: true; userId: string } | { ok: false; error: "expired" | "invalid" }> {
  try {
    const { u: userId, e: expiresAt, s: storedSig } = JSON.parse(
      Buffer.from(token, "base64url").toString("utf-8")
    );
    if (Date.now() > expiresAt) return { ok: false, error: "expired" };
    const expectedSig = await hmacSign(`${submittedCode.trim()}:${userId}:${expiresAt}`);
    if (expectedSig !== storedSig) return { ok: false, error: "invalid" };
    return { ok: true, userId };
  } catch {
    return { ok: false, error: "invalid" };
  }
}
