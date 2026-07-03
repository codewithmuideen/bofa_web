"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth, pinKey } from "@/lib/auth";
import OtpInput from "@/components/OtpInput";
import { Mail } from "lucide-react";

function LoginOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInById } = useAuth();

  const token = searchParams.get("token") ?? "";
  const maskedEmail = searchParams.get("maskedEmail") ?? "";
  const userInternalId = searchParams.get("userInternalId") ?? "";
  const devCode = searchParams.get("devCode") ?? "";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (!token) { router.replace("/login"); }
  }, [token, router]);

  useEffect(() => {
    if (resendCooldown > 0) {
      const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendCooldown]);

  const verify = async (code: string) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/verify-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, code }),
      });
      const data = await res.json();
      if (!data.ok) {
        setError(data.error === "expired" ? "Code expired. Please request a new one." : "Incorrect code. Please try again.");
        setLoading(false);
        return;
      }
      signInById(userInternalId);
      const hasPinStored = typeof window !== "undefined" && !!localStorage.getItem(pinKey(userInternalId));
      router.replace(hasPinStored ? "/dashboard" : "/setup-pin");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Bank of America" className="h-16 object-contain" />
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-[#E5E7EB] p-6 text-center">
          <div className="h-16 w-16 rounded-full bg-red-50 mx-auto flex items-center justify-center mb-5">
            <Mail size={26} className="text-[#E31837]" />
          </div>
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Verify your identity</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            We sent a code to <strong className="text-[#1A1A2E]">{maskedEmail}</strong>. Enter it below to complete sign-on.
          </p>

          {devCode && (
            <div className="mb-5 p-3 bg-yellow-50 border border-yellow-200 rounded-xl text-left">
              <p className="text-xs text-yellow-800 font-semibold">Dev mode — email not sent</p>
              <p className="text-lg font-mono font-bold text-yellow-900 mt-1 tracking-widest">{devCode}</p>
            </div>
          )}

          <OtpInput
            value={otp}
            onChange={setOtp}
            onComplete={verify}
            error={!!error}
            disabled={loading}
          />

          {error && <p className="text-center text-sm text-[#E31837] mt-4">{error}</p>}

          <button
            onClick={() => verify(otp)}
            disabled={otp.length < 6 || loading}
            className="mt-6 w-full py-3.5 rounded-full bg-[#E31837] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#B8122A] active:scale-[0.98] disabled:active:scale-100 transition"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <p className="mt-5 text-sm text-[#6B7280]">
            Didn&apos;t receive it?{" "}
            <button
              disabled={resendCooldown > 0}
              onClick={() => { setResendCooldown(30); router.back(); }}
              className="text-[#E31837] font-semibold hover:underline disabled:opacity-50 disabled:no-underline"
            >
              {resendCooldown > 0 ? `Resend code (${resendCooldown}s)` : "Resend code"}
            </button>
          </p>

          <button onClick={() => router.back()} className="mt-3 text-sm text-[#1C3668] font-semibold hover:underline">
            ← Back to sign on
          </button>
        </div>

        <p className="mt-6 text-[11px] text-[#9CA3AF] text-center leading-relaxed px-2">
          For your security, this code expires in 10 minutes. Never share it with anyone — Bank of America will never ask for your code.
        </p>
      </div>
    </div>
  );
}

export default function LoginOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><div className="h-8 w-8 border-4 border-[#1C3668] border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginOtpContent />
    </Suspense>
  );
}
