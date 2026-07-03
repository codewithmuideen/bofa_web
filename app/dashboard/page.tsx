"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FileText, Banknote, BarChart3, CreditCard, ChevronRight, Eye, EyeOff } from "lucide-react";
import AppShell from "@/components/AppShell";
import TransactionIcon from "@/components/TransactionIcon";
import { useAuth } from "@/lib/auth";
import { getBalance, getTransactions, formatCurrency, formatDate } from "@/lib/data";

function NetworkMark({ type }: { type: "visa" | "mastercard" }) {
  if (type === "mastercard") {
    return (
      <div className="flex items-center">
        <div className="h-6 w-6 rounded-full bg-[#EB001B]" />
        <div className="h-6 w-6 rounded-full bg-[#F79E1B] opacity-80 -ml-3" />
      </div>
    );
  }
  return <span className="text-white italic font-black text-lg tracking-tight">VISA</span>;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#1C3668] flex items-center justify-center">
        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const bal = getBalance(user.transactionKey);
  const txns = getTransactions(user.transactionKey).slice(0, 5);

  const cards = [
    { kind: "checking" as const, bg: "#1C3668", label: "Checking Account", balance: bal.checking, masked: `•••• •••• •••• ${user.cardLast4}`, subLabel: "Expiry", subVal: user.cardExpiry },
    { kind: "savings" as const, bg: "#0A1628", label: "Savings Account", balance: bal.savings, masked: `Account ${user.accountNumber}`, subLabel: "Type", subVal: "Savings" },
    { kind: "rewards" as const, bg: "#E31837", label: "Cash Rewards", balance: bal.rewards, masked: "Rewards Points Balance", subLabel: "Type", subVal: "Rewards" },
  ];

  const quickActions = [
    { icon: FileText, label: "Bills", href: "/pay-bills" },
    { icon: Banknote, label: "eDeposit", href: "/deposit" },
    { icon: BarChart3, label: "Expenses", href: "/transactions" },
    { icon: CreditCard, label: "ATM", href: "#" },
  ];

  return (
    <AppShell>
      <div className="animate-fade-in">
        {/* Navy panel: greeting + card carousel */}
        <div className="card-premium bg-gradient-to-b from-[#0A1628] to-[#1C3668] rounded-b-[2rem] px-4 pt-4 pb-6">
          <div className="flex items-center justify-between mb-5">
            <p className="text-white font-bold text-xl truncate">Hello {user.firstName}!</p>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setBalanceVisible(v => !v)}
                className="h-9 w-9 rounded-full bg-white/10 flex items-center justify-center text-white/80 hover:bg-white/20 active:scale-95 transition"
              >
                {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button onClick={() => router.push("/profile")} className="h-11 w-11 rounded-full overflow-hidden border-2 border-white/30 shrink-0 hover:border-white/60 transition">
                {user.avatar && !avatarFailed ? (
                  <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" onError={() => setAvatarFailed(true)} />
                ) : (
                  <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-white font-bold text-sm">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                )}
              </button>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-1 snap-x snap-mandatory hide-scrollbar -mx-1 px-1">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                style={{ background: card.bg }}
                className={`card-premium snap-center shrink-0 w-[calc(100vw-32px)] max-w-[23rem] rounded-3xl p-5 shadow-lift cursor-pointer transition-transform ${activeCard === idx ? "scale-100" : "scale-[0.97]"}`}
              >
                <div className="relative z-10 flex justify-between items-start mb-8">
                  <img src="/logo.png" alt="" className="h-5 object-contain brightness-0 invert opacity-80" />
                  {card.kind === "checking" ? <NetworkMark type={user.cardType} /> : (
                    <span className="text-white/70 text-[10px] font-bold uppercase tracking-widest">{card.label}</span>
                  )}
                </div>

                <div className="relative z-10">
                  <p className="text-white/50 text-[11px] uppercase tracking-wide mb-1">Current Balance</p>
                  <p className="text-white text-3xl font-bold tracking-tight mb-5">
                    {balanceVisible ? formatCurrency(card.balance) : "••••••"}
                  </p>
                  <p className="text-white/70 text-[15px] font-mono tracking-widest mb-5">{card.masked}</p>

                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-white/40 text-[9px] uppercase tracking-wide">Account Holder</p>
                      <p className="text-white text-xs font-semibold uppercase tracking-wide">{user.firstName} {user.lastName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white/40 text-[9px] uppercase tracking-wide">{card.subLabel}</p>
                      <p className="text-white text-xs font-semibold">{card.subVal}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-center gap-2 mt-4">
            {cards.map((_, i) => (
              <button key={i} onClick={() => setActiveCard(i)} className={`h-1.5 rounded-full transition-all ${i === activeCard ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mt-4">
          <div className="bg-white rounded-3xl shadow-card p-4">
            <div className="grid grid-cols-4 gap-2">
              {quickActions.map(({ icon: Icon, label, href }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex flex-col items-center gap-2 py-1.5 rounded-2xl hover:bg-[#F9FAFC] active:scale-95 transition"
                >
                  <Icon size={22} className="text-[#1C3668]" strokeWidth={1.8} />
                  <span className="text-[11px] text-[#6B7280] font-medium text-center leading-tight">{label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Transactions */}
        <div className="mt-6 px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1A1A2E] text-base">Transactions</h2>
            <button onClick={() => router.push("/transactions")} className="text-xs text-[#1C3668] font-semibold flex items-center gap-0.5 hover:underline">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-3xl shadow-card overflow-hidden divide-y divide-[#F4F6F9]">
            {txns.map(txn => (
              <div key={txn.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFC] transition">
                <TransactionIcon icon={txn.icon} merchant={txn.merchant} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1A1A2E] truncate">{txn.merchant}</p>
                  <p className="text-xs text-[#9CA3AF]">{txn.category} &bull; {formatDate(txn.date)}</p>
                </div>
                <p className={`text-sm font-bold shrink-0 ${txn.amount >= 0 ? "text-green-600" : "text-[#1A1A2E]"}`}>
                  {txn.amount >= 0 ? "+" : ""}{formatCurrency(txn.amount)}
                </p>
              </div>
            ))}
          </div>
        </div>

        <p className="text-center text-[11px] text-[#9CA3AF] pb-6">Bank of America, N.A. &bull; Member FDIC &bull; Equal Housing Lender</p>
      </div>
    </AppShell>
  );
}
