"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, X, ScanFace, Phone, MapPin, User as UserIcon, Lock, ShieldCheck } from "lucide-react";
import { verifyCredentials } from "@/lib/auth";

type Modal = "none" | "faceid" | "forgot" | "enroll";

export default function LoginPage() {
  const router = useRouter();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [saveId, setSaveId] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [modal, setModal] = useState<Modal>("none");
  const [faceState, setFaceState] = useState<"scanning" | "failed">("scanning");

  // Enroll form
  const [enrollName, setEnrollName] = useState("");
  const [enrollSsn, setEnrollSsn] = useState("");
  const [enrollCard, setEnrollCard] = useState("");
  const [enrollDone, setEnrollDone] = useState(false);
  const [enrollErr, setEnrollErr] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!userId.trim()) { setError("Please enter your User ID."); return; }
    if (!password.trim()) { setError("Please enter your password."); return; }

    const user = verifyCredentials(userId.trim(), password);
    if (!user) {
      setError("The User ID or Password you entered is incorrect. Please try again.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/send-login-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId }),
      });
      const data = await res.json();
      if (!data.ok) { setError(data.error ?? "Failed to send verification code."); setLoading(false); return; }

      const params = new URLSearchParams({
        token: data.token,
        maskedEmail: data.maskedEmail,
        userInternalId: data.userInternalId,
        ...(data.devCode ? { devCode: data.devCode } : {}),
      });
      router.push(`/login-otp?${params.toString()}`);
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const handleFaceId = () => {
    setFaceState("scanning");
    setModal("faceid");
    setTimeout(() => setFaceState("failed"), 2000);
  };

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    setEnrollErr("");
    if (!enrollName.trim()) { setEnrollErr("Please enter your full name."); return; }
    if (enrollSsn.length < 4) { setEnrollErr("Please enter last 4 digits of SSN."); return; }
    if (enrollCard.length < 4) { setEnrollErr("Please enter your card number."); return; }
    setEnrollDone(true);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* BoA header */}
      <div className="flex flex-col items-center gap-2 pt-8 pb-6 safe-top">
        <img src="/logo.png" alt="" className="h-10 w-10 object-contain" />
        <span className="text-[#1C3668] text-sm font-bold tracking-wide">Bank of America</span>
      </div>

      <div className="flex-1 flex flex-col items-center justify-start px-4">
        <div className="w-full max-w-sm">
          <div className="pb-3 border-b border-[#E5E7EB] mb-5">
            <h1 className="text-xl font-bold text-[#1A1A2E]">Sign in</h1>
            <p className="text-sm text-[#6B7280] mt-1">Bank of America Online Banking</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-[#E31837] animate-fade-in">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">User ID</label>
              <div className="relative">
                <UserIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type="text"
                  value={userId}
                  onChange={e => setUserId(e.target.value)}
                  placeholder="Enter your User ID"
                  autoComplete="username"
                  className="w-full pl-11 pr-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-[#1A1A2E] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#1C3668] focus:bg-white transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A1A2E] mb-1.5">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  className="w-full pl-11 pr-12 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-[#1A1A2E] text-sm placeholder-[#9CA3AF] focus:outline-none focus:border-[#1C3668] focus:bg-white transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 flex items-center justify-center text-[#9CA3AF] hover:text-[#6B7280]"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                id="save-id"
                type="checkbox"
                checked={saveId}
                onChange={e => setSaveId(e.target.checked)}
                className="h-4 w-4 rounded accent-[#1C3668]"
              />
              <label htmlFor="save-id" className="text-sm text-[#6B7280] cursor-pointer">Save User ID</label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-[#E31837] text-white font-bold text-sm tracking-wide shadow-sm hover:bg-[#B8122A] active:scale-[0.98] transition disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
            >
              {loading ? "Verifying..." : "LOG IN"}
            </button>

            <div className="flex items-center justify-between pt-1">
              <button type="button" onClick={() => setModal("forgot")} className="text-sm text-[#1C3668] font-semibold hover:underline">
                Forgot ID/Password?
              </button>
              <button type="button" onClick={() => setModal("enroll")} className="text-sm text-[#1C3668] font-semibold hover:underline">
                Enroll Now
              </button>
            </div>
          </form>
        </div>

        <div className="w-full max-w-sm mt-2">
          <div className="flex items-center gap-4 py-3 border-b border-[#E5E7EB]">
            <button className="text-sm font-semibold text-[#1C3668]">My Balance</button>
            <span className="text-[#E5E7EB]">|</span>
            <button type="button" onClick={() => setModal("enroll")} className="text-sm font-semibold text-[#1C3668]">Enroll</button>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {[
              { title: "Open a savings account", sub: "High-yield options available", emoji: "🏦" },
              { title: "$200 bonus offer", sub: "For new checking customers", emoji: "💳" },
              { title: "Send money with Zelle", sub: "Fast, free, secure", emoji: "💜" },
              { title: "Open an account", sub: "Checking, savings & more", emoji: "➕" },
            ].map(tile => (
              <button key={tile.title} className="bg-[#F4F6F9] rounded-2xl p-4 text-left hover:bg-[#EFF3FA] transition">
                <span className="text-xl">{tile.emoji}</span>
                <p className="text-xs font-bold text-[#1A1A2E] mt-2 leading-tight">{tile.title}</p>
                <p className="text-[11px] text-[#6B7280] mt-1 leading-tight">{tile.sub}</p>
              </button>
            ))}
          </div>
        </div>

        <p className="mt-8 text-xs text-[#9CA3AF] text-center pb-8">Locations &bull; Contact &bull; Equal Housing Lender &bull; Member FDIC</p>
      </div>

      {/* Face ID button */}
      <button
        onClick={handleFaceId}
        className="fixed bottom-8 right-6 h-14 w-14 bg-[#1C3668] rounded-2xl shadow-lift flex items-center justify-center hover:bg-[#152A52] transition active:scale-95"
        title="Sign in with Face ID"
      >
        <ScanFace size={26} className="text-white" />
      </button>

      {/* Face ID Modal */}
      {modal === "faceid" && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="p-6 text-center">
              <button onClick={() => setModal("none")} className="absolute top-4 right-4 h-7 w-7 rounded-full flex items-center justify-center hover:bg-[#F4F6F9]">
                <X size={16} className="text-[#6B7280]" />
              </button>
              <div className="h-20 w-20 rounded-full bg-[#F4F6F9] mx-auto flex items-center justify-center mb-4">
                {faceState === "scanning" ? (
                  <div className="h-10 w-10 border-4 border-[#1C3668] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ScanFace size={40} className="text-[#E31837]" />
                )}
              </div>
              <p className="font-bold text-[#1A1A2E] text-lg">
                {faceState === "scanning" ? "Scanning face…" : "Face ID Unavailable"}
              </p>
              {faceState === "failed" && (
                <>
                  <p className="text-sm text-[#6B7280] mt-2">
                    Face ID is not set up on this device. Please sign in with your User ID and password.
                  </p>
                  <button
                    onClick={() => setModal("none")}
                    className="mt-4 w-full py-3 rounded-xl bg-[#1C3668] text-white font-semibold text-sm"
                  >
                    Use Password
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Forgot Modal */}
      {modal === "forgot" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <p className="font-bold text-[#1A1A2E]">Account Recovery</p>
              <button onClick={() => setModal("none")} className="h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center">
                <X size={18} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="p-6 space-y-3">
              <p className="text-sm text-[#6B7280] mb-4">Choose how you&apos;d like to recover your account:</p>
              <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F6F9] transition">
                <div className="h-10 w-10 bg-[#EFF3FA] rounded-full flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-[#1C3668]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1A1A2E] text-sm">Call Us</p>
                  <p className="text-xs text-[#6B7280]">1-800-432-1000 (24/7)</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F6F9] transition">
                <div className="h-10 w-10 bg-[#EFF3FA] rounded-full flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-[#1C3668]" />
                </div>
                <div className="text-left">
                  <p className="font-semibold text-[#1A1A2E] text-sm">Visit a Branch</p>
                  <p className="text-xs text-[#6B7280]">Find the nearest location</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Enroll Modal */}
      {modal === "enroll" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E5E7EB]">
              <p className="font-bold text-[#1A1A2E]">Enroll in Online Banking</p>
              <button onClick={() => { setModal("none"); setEnrollDone(false); setEnrollName(""); setEnrollSsn(""); setEnrollCard(""); setEnrollErr(""); }} className="h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center">
                <X size={18} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="p-6">
              {enrollDone ? (
                <div className="text-center py-4">
                  <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-check-pop">
                    <span className="text-3xl">✓</span>
                  </div>
                  <p className="font-bold text-[#1A1A2E]">Application Submitted!</p>
                  <p className="text-sm text-[#6B7280] mt-2">We&apos;ll review your information and send enrollment details to your email within 1-2 business days.</p>
                  <button onClick={() => { setModal("none"); setEnrollDone(false); }} className="mt-4 w-full py-3 rounded-xl bg-[#1C3668] text-white font-semibold text-sm">
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEnroll} className="space-y-4">
                  <div className="flex items-center gap-2 bg-[#EFF3FA] rounded-xl px-3 py-2.5 mb-1">
                    <ShieldCheck size={15} className="text-[#1C3668] shrink-0" />
                    <p className="text-[11px] text-[#1C3668] font-medium">Your information is encrypted and never shared.</p>
                  </div>
                  {enrollErr && <p className="text-sm text-[#E31837]">{enrollErr}</p>}
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">Legal Full Name</label>
                    <input value={enrollName} onChange={e => setEnrollName(e.target.value)} placeholder="As it appears on your card" className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">Last 4 digits of SSN</label>
                    <input value={enrollSsn} onChange={e => setEnrollSsn(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="• • • •" inputMode="numeric" className="w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm tracking-widest focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1">Debit/Credit Card Number</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-[#9CA3AF] font-mono tracking-wider">••••</span>
                      <input value={enrollCard} onChange={e => setEnrollCard(e.target.value.replace(/\D/g, "").slice(0, 4))} placeholder="Last 4 digits" inputMode="numeric" className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm tracking-widest focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
                    </div>
                  </div>
                  <button type="submit" className="w-full py-3.5 rounded-xl bg-[#1C3668] text-white font-bold text-sm hover:bg-[#152A52] active:scale-[0.98] transition">
                    Submit Application
                  </button>
                  <p className="text-[11px] text-[#9CA3AF] text-center leading-relaxed">By continuing, you agree to the Online Banking Service Agreement and Privacy Notice.</p>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
