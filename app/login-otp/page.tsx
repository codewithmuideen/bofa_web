"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/lib/auth";
import OtpInput from "@/components/OtpInput";
import { ArrowLeft, RefreshCw } from "lucide-react";

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
      const hasPinStored = typeof window !== "undefined" && !!localStorage.getItem("bofa_pin");
      router.replace(hasPinStored ? "/dashboard" : "/setup-pin");
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      <div className="bg-[#1C3668] py-6 px-4 flex items-center gap-3">
        <button onClick={() => router.back()} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 transition">
          <ArrowLeft size={20} className="text-white" />
        </button>
        <img src="/logo.png" alt="Bank of America" className="h-7 object-contain brightness-0 invert" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4 py-10">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-xl font-bold text-[#1A1A2E] mb-1">Verify Your Identity</h2>
          <p className="text-sm text-[#6B7280] mb-6">
            We sent a 6-digit code to <strong className="text-[#1A1A2E]">{maskedEmail}</strong>. It expires in 10 minutes.
          </p>

          {devCode && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
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
            className="mt-6 w-full py-3.5 rounded-xl bg-[#1C3668] text-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#152A52] transition"
          >
            {loading ? "Verifying..." : "Verify Code"}
          </button>

          <button
            disabled={resendCooldown > 0}
            onClick={() => { setResendCooldown(30); router.back(); }}
            className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-sm text-[#1C3668] font-semibold hover:bg-[#F4F6F9] rounded-xl transition disabled:opacity-50"
          >
            <RefreshCw size={14} />
            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend Code"}
          </button>
        </div>

        <p className="mt-6 text-xs text-[#9CA3AF] text-center">Having trouble? Call 1-800-432-1000</p>
      </div>
    </div>
  );
}

export default function LoginOtpPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F4F6F9] flex items-center justify-center"><div className="h-8 w-8 border-4 border-[#1C3668] border-t-transparent rounded-full animate-spin" /></div>}>
      <LoginOtpContent />
    </Suspense>
  );
}
