"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Phone, MapPin, X, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import PinModal from "@/components/PinModal";
import { useAuth } from "@/lib/auth";

type Tab = "zelle" | "ach" | "wire";

function DormantAccountScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-sm bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex justify-end p-4">
          <button onClick={onClose} className="h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center">
            <X size={18} className="text-[#6B7280]" />
          </button>
        </div>
        <div className="px-6 pb-8 text-center">
          <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={30} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Account Restricted</h3>
          <p className="text-sm text-[#6B7280] mb-1 font-semibold">Dormant Account — Action Required</p>
          <p className="text-sm text-[#6B7280] mb-6">
            Your account has been flagged as dormant and outgoing transfers have been temporarily restricted. Please contact us to reactivate your account.
          </p>
          <div className="space-y-3">
            <a href="tel:18004321000" className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F6F9] transition">
              <div className="h-10 w-10 bg-[#EFF3FA] rounded-full flex items-center justify-center shrink-0">
                <Phone size={18} className="text-[#1C3668]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1A1A2E] text-sm">Call Us Now</p>
                <p className="text-xs text-[#6B7280]">1-800-432-1000 (24/7)</p>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF] ml-auto" />
            </a>
            <button className="w-full flex items-center gap-4 p-4 rounded-xl border border-[#E5E7EB] hover:bg-[#F4F6F9] transition">
              <div className="h-10 w-10 bg-[#EFF3FA] rounded-full flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-[#1C3668]" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-[#1A1A2E] text-sm">Find a Branch</p>
                <p className="text-xs text-[#6B7280]">Visit your nearest location</p>
              </div>
              <ChevronRight size={16} className="text-[#9CA3AF] ml-auto" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TransferPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [tab, setTab] = useState<Tab>("zelle");
  const [pinOpen, setPinOpen] = useState(false);
  const [dormant, setDormant] = useState(false);

  // Zelle form
  const [zelleRecip, setZelleRecip] = useState("");
  const [zelleAmount, setZelleAmount] = useState("");
  const [zelleMemo, setZelleMemo] = useState("");
  const [zelleErr, setZelleErr] = useState("");

  // ACH form
  const [achBank, setAchBank] = useState("");
  const [achRouting, setAchRouting] = useState("");
  const [achAccount, setAchAccount] = useState("");
  const [achAmount, setAchAmount] = useState("");
  const [achErr, setAchErr] = useState("");

  // Wire form
  const [wireBank, setWireBank] = useState("");
  const [wireRouting, setWireRouting] = useState("");
  const [wireAccount, setWireAccount] = useState("");
  const [wireAmount, setWireAmount] = useState("");
  const [wireErr, setWireErr] = useState("");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const handleZelleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setZelleErr("");
    if (!zelleRecip.trim()) { setZelleErr("Please enter a recipient."); return; }
    if (!zelleAmount || parseFloat(zelleAmount) <= 0) { setZelleErr("Please enter a valid amount."); return; }
    setPinOpen(true);
  };

  const handleAchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAchErr("");
    if (!achBank.trim()) { setAchErr("Please enter bank name."); return; }
    if (!achRouting || achRouting.length < 9) { setAchErr("Please enter a valid routing number."); return; }
    if (!achAccount.trim()) { setAchErr("Please enter account number."); return; }
    if (!achAmount || parseFloat(achAmount) <= 0) { setAchErr("Please enter a valid amount."); return; }
    setPinOpen(true);
  };

  const handleWireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setWireErr("");
    if (!wireBank.trim()) { setWireErr("Please enter bank name."); return; }
    if (!wireRouting || wireRouting.length < 9) { setWireErr("Please enter a valid routing number."); return; }
    if (!wireAccount.trim()) { setWireErr("Please enter account number."); return; }
    if (!wireAmount || parseFloat(wireAmount) <= 0) { setWireErr("Please enter a valid amount."); return; }
    setPinOpen(true);
  };

  const inputClass = "w-full px-4 py-3 rounded-xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1C3668] transition";
  const labelClass = "block text-xs font-semibold text-[#6B7280] mb-1";

  return (
    <AppShell>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A1628] to-[#1C3668] px-4 py-6">
          <h1 className="text-white font-bold text-xl">Transfer Money</h1>
          <p className="text-white/60 text-sm mt-0.5">Send funds securely</p>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[#E5E7EB] bg-white shadow-sm">
          {([["zelle", "Zelle"], ["ach", "Bank Transfer"], ["wire", "Wire"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-3.5 text-sm font-semibold transition border-b-2 ${tab === t ? "border-[#E31837] text-[#1C3668]" : "border-transparent text-[#9CA3AF] hover:text-[#6B7280]"}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-4">
          {/* Zelle Tab */}
          {tab === "zelle" && (
            <form onSubmit={handleZelleSubmit} className="bg-white rounded-3xl shadow-card p-5 space-y-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 bg-[#6913D8] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">Z</span>
                </div>
                <div>
                  <p className="font-bold text-[#1A1A2E]">Send with Zelle</p>
                  <p className="text-xs text-[#6B7280]">Fast, free transfers between bank accounts</p>
                </div>
              </div>
              {zelleErr && <p className="text-sm text-[#E31837]">{zelleErr}</p>}
              <div>
                <label className={labelClass}>Recipient (Email or Phone)</label>
                <input value={zelleRecip} onChange={e => setZelleRecip(e.target.value)} placeholder="email@example.com or 555-123-4567" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">$</span>
                  <input type="number" min="0.01" step="0.01" value={zelleAmount} onChange={e => setZelleAmount(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} />
                </div>
              </div>
              <div>
                <label className={labelClass}>Memo (optional)</label>
                <input value={zelleMemo} onChange={e => setZelleMemo(e.target.value)} placeholder="What's it for?" className={inputClass} />
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1C3668] to-[#152A52] text-white font-bold text-sm hover:brightness-110 active:scale-[0.98] transition">
                Send with Zelle
              </button>
            </form>
          )}

          {/* ACH Tab */}
          {tab === "ach" && (
            <form onSubmit={handleAchSubmit} className="bg-white rounded-3xl shadow-card p-5 space-y-4">
              <p className="font-bold text-[#1A1A2E]">External Bank Transfer (ACH)</p>
              <p className="text-xs text-[#6B7280] -mt-2">Transfers typically take 1–3 business days.</p>
              {achErr && <p className="text-sm text-[#E31837]">{achErr}</p>}
              <div>
                <label className={labelClass}>Recipient Bank Name</label>
                <input value={achBank} onChange={e => setAchBank(e.target.value)} placeholder="e.g. Chase, Wells Fargo" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Routing Number</label>
                <input value={achRouting} onChange={e => setAchRouting(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="9 digit routing number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Account Number</label>
                <input value={achAccount} onChange={e => setAchAccount(e.target.value)} placeholder="Recipient account number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">$</span>
                  <input type="number" min="0.01" step="0.01" value={achAmount} onChange={e => setAchAmount(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1C3668] to-[#152A52] text-white font-bold text-sm hover:brightness-110 active:scale-[0.98] transition">
                Initiate Transfer
              </button>
            </form>
          )}

          {/* Wire Tab */}
          {tab === "wire" && (
            <form onSubmit={handleWireSubmit} className="bg-white rounded-3xl shadow-card p-5 space-y-4">
              <p className="font-bold text-[#1A1A2E]">Wire Transfer</p>
              <p className="text-xs text-[#6B7280] -mt-2">Same-day delivery. Fees may apply.</p>
              {wireErr && <p className="text-sm text-[#E31837]">{wireErr}</p>}
              <div>
                <label className={labelClass}>Recipient Bank Name</label>
                <input value={wireBank} onChange={e => setWireBank(e.target.value)} placeholder="e.g. Citibank" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>ABA / Routing Number</label>
                <input value={wireRouting} onChange={e => setWireRouting(e.target.value.replace(/\D/g, "").slice(0, 9))} placeholder="9 digit ABA routing" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Recipient Account Number</label>
                <input value={wireAccount} onChange={e => setWireAccount(e.target.value)} placeholder="Account number" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Wire Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">$</span>
                  <input type="number" min="0.01" step="0.01" value={wireAmount} onChange={e => setWireAmount(e.target.value)} placeholder="0.00" className={`${inputClass} pl-8`} />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#1C3668] to-[#152A52] text-white font-bold text-sm hover:brightness-110 active:scale-[0.98] transition">
                Send Wire Transfer
              </button>
            </form>
          )}
        </div>
      </div>

      <PinModal
        isOpen={pinOpen}
        title="Confirm Transfer"
        subtitle="Enter your PIN to authorize"
        onSuccess={() => { setPinOpen(false); setDormant(true); }}
        onCancel={() => setPinOpen(false)}
      />

      {dormant && <DormantAccountScreen onClose={() => setDormant(false)} />}
    </AppShell>
  );
}
