"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, ShieldCheck } from "lucide-react";
import { hashPassword } from "@/lib/data";
import { useAuth, pinKey } from "@/lib/auth";

type Step = "create" | "confirm";

export default function SetupPinPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("create");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  const currentPin = step === "create" ? pin : confirmPin;
  const setCurrentPin = step === "create" ? setPin : setConfirmPin;

  const pad = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  const handleKey = (k: string) => {
    if (k === "⌫") {
      setCurrentPin(p => p.slice(0, -1));
      return;
    }
    if (currentPin.length >= 4) return;
    const next = currentPin + k;
    setCurrentPin(next);

    if (next.length === 4) {
      if (step === "create") {
        setTimeout(() => { setStep("confirm"); }, 300);
      } else {
        if (next !== pin) {
          setShake(true);
          setError("PINs do not match. Please try again.");
          setTimeout(() => { setShake(false); setConfirmPin(""); setPin(""); setStep("create"); setError(""); }, 700);
        } else {
          if (user) localStorage.setItem(pinKey(user.id), hashPassword(next));
          router.replace("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 safe-top safe-bottom">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Bank of America" className="h-16 object-contain" />
        </div>

        <div className="bg-white rounded-3xl shadow-card border border-[#E5E7EB] p-8">
          <div className="text-center mb-6">
            <div className="h-16 w-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={30} className="text-[#E31837]" />
            </div>
            <div className="flex justify-center gap-1.5 mb-4">
              <span className={`h-1.5 w-6 rounded-full transition-colors ${step === "create" ? "bg-[#E31837]" : "bg-[#E5E7EB]"}`} />
              <span className={`h-1.5 w-6 rounded-full transition-colors ${step === "confirm" ? "bg-[#E31837]" : "bg-[#E5E7EB]"}`} />
            </div>
            <h1 className="text-xl font-bold text-[#1A1A2E]">
              {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
            </h1>
            <p className="text-[#6B7280] text-sm mt-2">
              {step === "create"
                ? `Hi ${user?.firstName ?? "there"}, choose a 4-digit PIN for quick sign-on.`
                : "Enter your PIN again to confirm."}
            </p>
          </div>

          <div className={`flex gap-4 justify-center mb-6 ${shake ? "animate-shake" : ""}`}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className={`h-4 w-4 rounded-full border-2 border-[#D1D5DB] transition-all ${i < currentPin.length ? "bg-[#1C3668] scale-110 border-[#1C3668]" : "bg-transparent"}`}
              />
            ))}
          </div>

          {error && <p className="text-center text-sm text-[#E31837] mb-4">{error}</p>}

          <div className="grid grid-cols-3 gap-3 justify-items-center">
            {pad.map((k, i) => (
              k === "" ? <div key={i} /> :
              k === "⌫" ? (
                <button key={i} onClick={() => handleKey(k)}
                  className="h-16 w-16 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4F6F9] active:scale-95 transition">
                  <Delete size={20} />
                </button>
              ) : (
                <button key={i} onClick={() => handleKey(k)}
                  className="h-16 w-16 rounded-full text-xl font-semibold text-[#1A1A2E] bg-[#F4F6F9] border border-[#E5E7EB] hover:bg-[#EFF3FA] active:scale-95 active:bg-[#1C3668] active:text-white transition">
                  {k}
                </button>
              )
            ))}
          </div>

          <button onClick={() => router.replace("/dashboard")} className="mt-6 w-full py-3 text-[#9CA3AF] text-sm hover:text-[#6B7280] transition">
            Skip for now
          </button>
        </div>
      </div>
    </div>
  );
}
