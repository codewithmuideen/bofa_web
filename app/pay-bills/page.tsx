"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Phone, MapPin, ChevronRight, X, Plus } from "lucide-react";
import AppShell from "@/components/AppShell";
import PinModal from "@/components/PinModal";
import { useAuth } from "@/lib/auth";
import { getPayees, Payee } from "@/lib/data";

function DormantAccountScreen({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden relative">
        <button onClick={onClose} className="absolute top-4 right-4 h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center z-10">
          <X size={18} className="text-[#6B7280]" />
        </button>
        <div className="px-6 pt-8 pb-8 text-center">
          <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={30} className="text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A2E] mb-2">Payment Failed</h3>
          <p className="text-sm text-[#6B7280] mb-1 font-semibold">Account Restricted — Dormant Account</p>
          <p className="text-sm text-[#6B7280] mb-6">
            Your account has been flagged as dormant and bill payments have been temporarily suspended. Please contact us to restore full account access.
          </p>
          <div className="space-y-3">
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
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PayBillsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [selectedPayee, setSelectedPayee] = useState<Payee | null>(null);
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [memo, setMemo] = useState("");
  const [payErr, setPayErr] = useState("");
  const [step, setStep] = useState<"list" | "form" | "review">("list");
  const [pinOpen, setPinOpen] = useState(false);
  const [dormant, setDormant] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const payees = getPayees(user.transactionKey);

  const handlePayeeSelect = (p: Payee) => {
    setSelectedPayee(p);
    setAmount("");
    setMemo("");
    setPayErr("");
    setStep("form");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPayErr("");
    if (!amount || parseFloat(amount) <= 0) { setPayErr("Please enter a valid amount."); return; }
    if (!date) { setPayErr("Please select a payment date."); return; }
    setStep("review");
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <AppShell>
      <div className="animate-fade-in">
        <div className="bg-[#1C3668] px-4 py-6">
          <h1 className="text-white font-bold text-xl">Pay Bills</h1>
          <p className="text-white/60 text-sm mt-0.5">Schedule payments to your payees</p>
        </div>

        {step === "list" && (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between mb-2">
              <p className="font-semibold text-[#1A1A2E] text-sm">Your Payees</p>
              <button className="flex items-center gap-1 text-xs text-[#1C3668] font-semibold hover:underline">
                <Plus size={14} /> Add Payee
              </button>
            </div>
            {payees.map(p => (
              <button
                key={p.id}
                onClick={() => handlePayeeSelect(p)}
                className="w-full flex items-center gap-4 p-4 bg-white rounded-2xl shadow-card hover:shadow-lift active:scale-[0.98] transition text-left"
              >
                <div className="h-12 w-12 bg-[#EFF3FA] rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#1C3668] font-bold text-lg">{p.name[0]}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-[#1A1A2E]">{p.name}</p>
                  <p className="text-xs text-[#6B7280]">{p.category} &bull; Acct ****{p.accountLast4}</p>
                </div>
                <ChevronRight size={18} className="text-[#9CA3AF]" />
              </button>
            ))}
          </div>
        )}

        {step === "form" && selectedPayee && (
          <form onSubmit={handleFormSubmit} className="p-4 space-y-4">
            <div className="bg-white rounded-3xl shadow-card p-5 space-y-4">
              <div className="flex items-center gap-3 pb-1">
                <div className="h-12 w-12 bg-[#EFF3FA] rounded-xl flex items-center justify-center shrink-0">
                  <span className="text-[#1C3668] font-bold text-lg">{selectedPayee.name[0]}</span>
                </div>
                <div>
                  <p className="font-bold text-[#1A1A2E]">{selectedPayee.name}</p>
                  <p className="text-xs text-[#6B7280]">Acct ****{selectedPayee.accountLast4}</p>
                </div>
              </div>

              {payErr && <p className="text-sm text-[#E31837]">{payErr}</p>}

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1">Payment Amount</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280] font-semibold">$</span>
                  <input type="number" min="0.01" step="0.01" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00"
                    className="w-full pl-8 pr-4 py-3 rounded-2xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1">Payment Date</label>
                <input type="date" value={date} min={today} onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#6B7280] mb-1">Memo (optional)</label>
                <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="Add a note"
                  className="w-full px-4 py-3 rounded-2xl border-2 border-[#E5E7EB] bg-[#F4F6F9] text-sm focus:outline-none focus:border-[#1C3668] focus:bg-white transition" />
              </div>
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => setStep("list")} className="flex-1 py-3.5 rounded-full border-2 border-[#E5E7EB] text-[#6B7280] font-semibold text-sm hover:bg-[#F4F6F9] transition">
                Back
              </button>
              <button type="submit" className="flex-2 flex-1 py-3.5 rounded-full bg-[#1C3668] text-white font-bold text-sm hover:bg-[#152A52] active:scale-[0.98] transition">
                Review Payment
              </button>
            </div>
          </form>
        )}

        {step === "review" && selectedPayee && (
          <div className="p-4 space-y-4">
            <div className="bg-white rounded-3xl shadow-card p-5 space-y-3">
              <p className="font-bold text-[#1A1A2E] text-base">Review Payment</p>
              <div className="space-y-3 py-2">
                {[
                  { label: "Payee", value: selectedPayee.name },
                  { label: "Account", value: `****${selectedPayee.accountLast4}` },
                  { label: "Amount", value: `$${parseFloat(amount).toFixed(2)}` },
                  { label: "Date", value: new Date(date + "T12:00:00").toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) },
                  { label: "From", value: `Checking ${user.accountNumber}` },
                  ...(memo ? [{ label: "Memo", value: memo }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-center py-2 border-b border-[#F4F6F9] last:border-0">
                    <span className="text-xs text-[#6B7280] font-semibold">{label}</span>
                    <span className="text-sm text-[#1A1A2E] font-medium">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep("form")} className="flex-1 py-3.5 rounded-full border-2 border-[#E5E7EB] text-[#6B7280] font-semibold text-sm hover:bg-[#F4F6F9] transition">
                Edit
              </button>
              <button onClick={() => setPinOpen(true)} className="flex-1 py-3.5 rounded-full bg-[#1C3668] text-white font-bold text-sm hover:bg-[#152A52] active:scale-[0.98] transition">
                Confirm Payment
              </button>
            </div>
          </div>
        )}
      </div>

      <PinModal
        isOpen={pinOpen}
        title="Authorize Payment"
        subtitle="Enter your PIN to confirm"
        onSuccess={() => { setPinOpen(false); setDormant(true); }}
        onCancel={() => setPinOpen(false)}
      />

      {dormant && <DormantAccountScreen onClose={() => { setDormant(false); setStep("list"); }} />}
    </AppShell>
  );
}
