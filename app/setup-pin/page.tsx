"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Delete, ShieldCheck } from "lucide-react";
import { hashPassword } from "@/lib/data";
import { useAuth } from "@/lib/auth";

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
          localStorage.setItem("bofa_pin", hashPassword(next));
          router.replace("/dashboard");
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#1C3668] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="h-16 w-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {step === "create" ? "Create Your PIN" : "Confirm Your PIN"}
          </h1>
          <p className="text-white/60 text-sm mt-2">
            {step === "create"
              ? `Hi ${user?.firstName ?? "there"}, create a 4-digit PIN for quick access.`
              : "Enter your PIN again to confirm."}
          </p>
        </div>

        <div className={`flex gap-4 justify-center mb-4 ${shake ? "animate-shake" : ""}`}>
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className={`h-5 w-5 rounded-full border-2 border-white/40 transition-all ${i < currentPin.length ? "bg-white scale-110 border-white" : "bg-transparent"}`}
            />
          ))}
        </div>

        {error && <p className="text-center text-sm text-[#FFB3BC] mb-4">{error}</p>}

        <div className="bg-white/10 rounded-3xl p-4 backdrop-blur-sm">
          <div className="grid grid-cols-3 gap-3">
            {pad.map((k, i) => (
              k === "" ? <div key={i} /> :
              k === "⌫" ? (
                <button key={i} onClick={() => handleKey(k)}
                  className="h-16 rounded-2xl flex items-center justify-center text-white/70 hover:bg-white/10 active:scale-95 transition">
                  <Delete size={22} />
                </button>
              ) : (
                <button key={i} onClick={() => handleKey(k)}
                  className="h-16 rounded-2xl text-xl font-semibold text-white bg-white/10 hover:bg-white/20 active:scale-95 active:bg-white active:text-[#1C3668] transition">
                  {k}
                </button>
              )
            ))}
          </div>
        </div>

        <button onClick={() => router.replace("/dashboard")} className="mt-4 w-full py-3 text-white/50 text-sm hover:text-white/70 transition">
          Skip for now
        </button>
      </div>
    </div>
  );
}
