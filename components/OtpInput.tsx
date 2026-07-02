"use client";
import { useRef, KeyboardEvent, ClipboardEvent } from "react";

interface OtpInputProps {
  value: string;
  onChange: (v: string) => void;
  onComplete: (v: string) => void;
  error?: boolean;
  disabled?: boolean;
}

export default function OtpInput({ value, onChange, onComplete, error = false, disabled = false }: OtpInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const update = (next: string) => {
    const clean = next.replace(/\D/g, "").slice(0, 6);
    onChange(clean);
    if (clean.length === 6) onComplete(clean);
  };

  const handleKey = (i: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !value[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handleChange = (i: number, v: string) => {
    const digit = v.replace(/\D/g, "").slice(-1);
    const arr = value.split("");
    arr[i] = digit;
    const next = arr.join("").slice(0, 6);
    update(next);
    if (digit && i < 5) inputs.current[i + 1]?.focus();
  };

  const handlePaste = (e: ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text");
    update(pasted);
    const clean = pasted.replace(/\D/g, "").slice(0, 6);
    inputs.current[Math.min(5, clean.length)]?.focus();
  };

  const borderClass = error
    ? "border-[#E31837] bg-red-50 focus:border-[#E31837] focus:ring-[#E31837]/20"
    : "border-[#E5E7EB] bg-[#F4F6F9] focus:border-[#1C3668] focus:ring-[#1C3668]/10";

  return (
    <div className="flex gap-3 justify-center">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={el => { inputs.current[i] = el; }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ""}
          disabled={disabled}
          onChange={e => handleChange(i, e.target.value)}
          onKeyDown={e => handleKey(i, e)}
          onPaste={handlePaste}
          onClick={() => inputs.current[i]?.select()}
          className={`h-14 w-12 rounded-xl border-2 text-center text-xl font-bold text-[#1A1A2E] transition focus:outline-none focus:ring-2 disabled:opacity-50 ${borderClass}`}
        />
      ))}
    </div>
  );
}
