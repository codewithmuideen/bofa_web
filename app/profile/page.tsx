"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Shield, Bell, Phone, Mail, LogOut, ChevronRight, Copy, CheckCircle2 } from "lucide-react";
import AppShell from "@/components/AppShell";
import { useAuth } from "@/lib/auth";
import { formatDate } from "@/lib/data";

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  const doCopy = () => {
    navigator.clipboard.writeText(value).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={doCopy} className="ml-2 text-[#1C3668] hover:text-[#152A52] transition">
      {copied ? <CheckCircle2 size={14} className="text-emerald-500" /> : <Copy size={14} />}
    </button>
  );
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [imgFailed, setImgFailed] = useState(false);

  if (!user) return null;

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <AppShell>
      <div className="p-4 sm:p-6 max-w-xl mx-auto space-y-5">
        {/* Avatar card */}
        <div className="card-premium bg-gradient-to-br from-[#0A1628] to-[#1C3668] rounded-3xl p-6 text-white text-center shadow-xl-navy relative overflow-hidden">
          <div className="relative z-10">
            <div className="mx-auto h-24 w-24 rounded-2xl overflow-hidden border-4 border-white/25 mb-4 bg-[#E31837] flex items-center justify-center shadow-lg">
              {user.avatar && !imgFailed ? (
                <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover"
                  onError={() => setImgFailed(true)} />
              ) : (
                <span className="text-3xl font-bold">{user.firstName[0]}{user.lastName[0]}</span>
              )}
            </div>
            <h2 className="text-xl font-bold">{user.firstName} {user.lastName}</h2>
            <p className="text-white/60 text-sm mt-0.5">{user.userId}</p>
            <p className="text-white/40 text-xs mt-1">Member since {formatDate(user.memberSince)}</p>
          </div>
        </div>

        {/* Account info */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Account Information</h3>
          </div>
          {[
            { label: "Account Number", value: user.accountNumber },
            { label: "Routing Number", value: user.routingNumber },
            { label: "Card", value: `•••• •••• •••• ${user.cardLast4} · Expires ${user.cardExpiry}` },
            { label: "Phone", value: user.phone },
            { label: "Email", value: user.email },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-5 py-3.5 border-b border-[#E5E7EB] last:border-0">
              <span className="text-xs text-[#6B7280]">{label}</span>
              <div className="flex items-center">
                <span className="text-sm font-semibold text-[#1A1A2E]">{value}</span>
                {(label === "Account Number" || label === "Routing Number") && (
                  <CopyButton value={value.replace(/\*/g, "")} />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Settings */}
        <div className="bg-white rounded-3xl border border-[#E5E7EB] shadow-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[#E5E7EB]">
            <h3 className="text-sm font-bold text-[#1A1A2E]">Settings</h3>
          </div>
          {[
            { icon: User,   label: "Personal Information",   desc: "Update your name and address" },
            { icon: Shield, label: "Security & Privacy",     desc: "PIN, password, and 2FA settings" },
            { icon: Bell,   label: "Notifications",          desc: "Manage alerts and preferences" },
            { icon: Phone,  label: "Contact Preferences",    desc: "Phone numbers on file" },
            { icon: Mail,   label: "Paperless Settings",     desc: "Manage e-statements" },
          ].map(({ icon: Icon, label, desc }) => (
            <button key={label}
              className="w-full flex items-center gap-4 px-5 py-4 border-b border-[#E5E7EB] last:border-0 hover:bg-[#F4F6F9] active:bg-[#EFF3FA] transition text-left group">
              <span className="h-9 w-9 rounded-xl bg-[#1C3668]/10 text-[#1C3668] flex items-center justify-center shrink-0">
                <Icon size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#1A1A2E]">{label}</p>
                <p className="text-xs text-[#6B7280] mt-0.5">{desc}</p>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF] shrink-0" />
            </button>
          ))}
        </div>

        {/* Sign out */}
        <button onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-[#E31837]/30 text-[#E31837] font-semibold text-sm hover:bg-red-50 active:scale-[0.98] transition">
          <LogOut size={17} />
          Sign Out
        </button>

        <p className="text-center text-[11px] text-[#9CA3AF] pb-4">
          Bank of America, N.A. · Member FDIC · Equal Housing Lender
        </p>
      </div>
    </AppShell>
  );
}
