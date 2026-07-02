"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function SplashPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!isLoading && ready) {
      const t = setTimeout(() => {
        router.replace(user ? "/dashboard" : "/login");
      }, 2200);
      return () => clearTimeout(t);
    }
  }, [isLoading, ready, user, router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-[#F4F6F9] flex flex-col items-center justify-center">
      <div
        className="flex flex-col items-center gap-8 transition-all duration-700"
        style={{ opacity: ready ? 1 : 0, transform: ready ? 'scale(1)' : 'scale(0.95)' }}
      >
        <img src="/logo.png" alt="Bank of America" className="w-64 object-contain drop-shadow-sm" />
        <div className="flex gap-2">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="h-2.5 w-2.5 rounded-full bg-[#1C3668]"
              style={{ animation: `soft-ping 1.2s ease-in-out ${i * 0.2}s infinite` }}
            />
          ))}
        </div>
      </div>
      <p className="absolute bottom-10 text-xs text-[#9CA3AF] tracking-wide">Equal Housing Lender &bull; Member FDIC</p>
    </div>
  );
}
