"use client";
import { useEffect, useState } from "react";
import { X, Delete } from "lucide-react";
import { hashPassword } from "@/lib/data";

interface PinModalProps {
  isOpen: boolean;
  title?: string;
  subtitle?: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function PinModal({ isOpen, title = "Enter PIN", subtitle, onSuccess, onCancel }: PinModalProps) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (!isOpen) { setPin(""); setError(""); }
  }, [isOpen]);

  useEffect(() => {
    if (pin.length === 4) {
      const stored = localStorage.getItem("bofa_pin");
      if (!stored || stored === hashPassword(pin)) {
        setError("");
        onSuccess();
      } else {
        setShake(true);
        setError("Incorrect PIN. Please try again.");
        setTimeout(() => { setShake(false); setPin(""); }, 600);
      }
    }
  }, [pin, onSuccess]);

  if (!isOpen) return null;

  const pad = ["1","2","3","4","5","6","7","8","9","","0","⌫"];

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 pt-6 pb-2">
          <div>
            <p className="text-[16px] font-bold text-[#1A1A2E]">{title}</p>
            {subtitle && <p className="text-xs text-[#6B7280] mt-0.5">{subtitle}</p>}
          </div>
          <button onClick={onCancel} className="h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center shrink-0">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>

        <div className={`px-8 py-6 ${shake ? "animate-shake" : ""}`}>
          <div className="flex gap-4 justify-center mb-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className={`h-4 w-4 rounded-full transition-all ${i < pin.length ? "bg-[#1C3668] scale-110" : "bg-[#E5E7EB]"}`} />
            ))}
          </div>
          {error && <p className="text-center text-xs text-[#E31837] mb-4">{error}</p>}

          <div className="grid grid-cols-3 gap-3 justify-items-center">
            {pad.map((k, i) => (
              k === "" ? <div key={i} /> :
              k === "⌫" ? (
                <button key={i} onClick={() => setPin(p => p.slice(0,-1))}
                  className="h-14 w-14 rounded-full flex items-center justify-center text-[#6B7280] hover:bg-[#F4F6F9] active:scale-95 transition">
                  <Delete size={20} />
                </button>
              ) : (
                <button key={i} onClick={() => setPin(p => p.length < 4 ? p + k : p)}
                  className="h-14 w-14 rounded-full text-xl font-semibold text-[#1A1A2E] bg-[#F4F6F9] border border-[#E5E7EB] hover:bg-[#EFF3FA] active:scale-95 active:bg-[#1C3668] active:text-white transition">
                  {k}
                </button>
              )
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
