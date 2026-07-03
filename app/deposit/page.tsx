"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Camera, Upload, AlertTriangle, Phone, MapPin, ChevronRight, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/lib/auth";

type Step = "capture" | "loading" | "restricted";

export default function DepositPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState<Step>("capture");
  const [preview, setPreview] = useState<string | null>(null);
  const [amount, setAmount] = useState("");
  const [amountErr, setAmountErr] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const handleSubmit = () => {
    if (!preview) { return; }
    if (!amount || parseFloat(amount) <= 0) { setAmountErr("Please enter the check amount."); return; }
    setAmountErr("");
    setStep("loading");
    setTimeout(() => setStep("restricted"), 2500);
  };

  return (
    <AppShell>
      <div className="animate-fade-in">
        <div className="bg-[#1C3668] px-4 py-6">
          <h1 className="text-white font-bold text-xl">Mobile Deposit</h1>
          <p className="text-white/60 text-sm mt-0.5">Deposit a check with your camera</p>
        </div>

        <div className="p-4">
          {step === "capture" && (
            <div className="space-y-4">
              {/* Check capture area */}
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative rounded-2xl overflow-hidden cursor-pointer transition ${preview ? "" : "border-2 border-dashed border-[#1C3668]/30 bg-white"}`}
                style={{ minHeight: 200 }}
              >
                {preview ? (
                  <div className="relative">
                    <img src={preview} alt="Check front" className="w-full rounded-2xl object-cover" style={{ maxHeight: 220 }} />
                    <button
                      onClick={e => { e.stopPropagation(); setPreview(null); if (fileRef.current) fileRef.current.value = ""; }}
                      className="absolute top-2 right-2 h-8 w-8 bg-black/50 rounded-full flex items-center justify-center"
                    >
                      <X size={14} className="text-white" />
                    </button>
                    <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg">
                      Front of check
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-12 gap-3">
                    <div className="h-16 w-16 bg-[#EFF3FA] rounded-2xl flex items-center justify-center">
                      <Camera size={30} className="text-[#1C3668]" />
                    </div>
                    <p className="text-[#1C3668] font-semibold">Tap to photograph front of check</p>
                    <p className="text-xs text-[#9CA3AF]">Ensure the entire check is visible</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Upload size={14} className="text-[#9CA3AF]" />
                      <span className="text-xs text-[#9CA3AF]">Or upload from gallery</span>
                    </div>
                  </div>
                )}
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleCapture}
              />

              <div className="bg-white rounded-3xl shadow-card p-5 space-y-4">
                <h3 className="font-bold text-[#1A1A2E]">Deposit Details</h3>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">Deposit to Account</label>
                  <div className="px-4 py-3 rounded-2xl bg-[#F4F6F9] border-2 border-[#E5E7EB] text-sm text-[#1A1A2E]">
                    Checking — {user.accountNumber}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1">Check Amount</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">$</span>
                    <input
                      type="number"
                      min="0.01"
                      step="0.01"
                      value={amount}
                      onChange={e => { setAmount(e.target.value); setAmountErr(""); }}
                      placeholder="0.00"
                      className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm focus:outline-none focus:border-[#1C3668] focus:bg-white transition"
                    />
                  </div>
                  {amountErr && <p className="text-xs text-[#E31837] mt-1">{amountErr}</p>}
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                  <p className="text-xs text-amber-800 font-semibold">Funds Availability</p>
                  <p className="text-xs text-amber-700 mt-0.5">Deposits made before 9 PM ET on business days are available next business day.</p>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!preview}
                className="w-full py-3.5 rounded-full bg-[#1C3668] text-white font-bold text-sm hover:bg-[#152A52] active:scale-[0.98] transition disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100"
              >
                Submit Deposit
              </button>
            </div>
          )}

          {step === "loading" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <div className="h-16 w-16 border-4 border-[#1C3668] border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="font-bold text-[#1A1A2E] text-lg">Processing Deposit</p>
                <p className="text-sm text-[#6B7280] mt-1">Analyzing your check image...</p>
              </div>
            </div>
          )}

          {step === "restricted" && (
            <div className="bg-white rounded-3xl shadow-card overflow-hidden">
              <div className="bg-amber-50 p-6 flex flex-col items-center text-center border-b border-amber-100">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={30} className="text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-[#1A1A2E]">Deposit Unavailable</h3>
                <p className="text-sm font-semibold text-amber-700 mt-1">Account Restricted — Dormant Account</p>
                <p className="text-sm text-[#6B7280] mt-2">
                  Mobile deposit is currently unavailable for your account. Please contact us to resolve this restriction.
                </p>
              </div>
              <div className="p-4 space-y-3">
                <a href="tel:18004321000" className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#E31837]/40 hover:bg-red-50/40 transition">
                  <div className="h-11 w-11 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <Phone size={18} className="text-[#E31837]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1A1A2E] text-sm">Call 1-800-432-1000</p>
                    <p className="text-xs text-[#6B7280]">Available 24/7</p>
                  </div>
                  <ChevronRight size={16} className="text-[#9CA3AF] ml-auto" />
                </a>
                <button className="w-full flex items-center gap-4 p-4 rounded-2xl border border-[#E5E7EB] hover:border-[#E31837]/40 hover:bg-red-50/40 transition">
                  <div className="h-11 w-11 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                    <MapPin size={18} className="text-[#E31837]" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-[#1A1A2E] text-sm">Visit a Branch</p>
                    <p className="text-xs text-[#6B7280]">Find nearest location</p>
                  </div>
                  <ChevronRight size={16} className="text-[#9CA3AF] ml-auto" />
                </button>
                <button onClick={() => { setStep("capture"); setPreview(null); setAmount(""); }} className="w-full py-3 rounded-full text-[#6B7280] text-sm font-semibold hover:bg-[#F4F6F9] transition">
                  Try Again Later
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  );
}
