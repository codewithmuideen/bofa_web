"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownLeft, Banknote, FileText, Building, ChevronRight } from "lucide-react";
import AppShell from "@/components/AppShell";
import TransactionIcon from "@/components/TransactionIcon";
import { useAuth } from "@/lib/auth";
import { getBalance, getTransactions, formatCurrency, formatDate } from "@/lib/data";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [activeCard, setActiveCard] = useState(0);
  const [balanceVisible, setBalanceVisible] = useState(true);

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
    { label: "Checking Account", balance: bal.checking, account: user.accountNumber, gradient: "from-[#1C3668] to-[#2A4A85]", tag: "Bank of America" },
    { label: "Savings Account", balance: bal.savings, account: user.accountNumber.replace("****", "****"), gradient: "from-[#0A1628] to-[#1C3668]", tag: "Advantage Savings" },
    { label: "Cash Rewards", balance: bal.rewards, account: "Rewards Points", gradient: "from-[#E31837] to-[#A01025]", tag: "BankAmericard" },
  ];

  const quickActions = [
    { icon: FileText, label: "Pay Bills", href: "/pay-bills", color: "#1C3668" },
    { icon: Banknote, label: "eDeposit", href: "/deposit", color: "#1C3668" },
    { icon: ArrowUpRight, label: "Transfers", href: "/transfer", color: "#1C3668" },
    { icon: Building, label: "Locations", href: "#", color: "#1C3668" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <div className="animate-fade-in">
        {/* Greeting */}
        <div className="bg-[#1C3668] px-4 pb-6 pt-2">
          <p className="text-white/60 text-sm">{greeting},</p>
          <p className="text-white font-bold text-2xl">{user.firstName} {user.lastName}</p>
        </div>

        {/* Account Cards */}
        <div className="px-4 -mt-3">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`snap-center shrink-0 w-[calc(100vw-48px)] max-w-sm rounded-2xl bg-gradient-to-br ${card.gradient} p-5 shadow-lift cursor-pointer transition-transform ${activeCard === idx ? "scale-100" : "scale-[0.97]"}`}
              >
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{card.tag}</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{card.label}</p>
                  </div>
                  <img src="/logo.png" alt="BoA" className="h-6 object-contain brightness-0 invert opacity-70" />
                </div>

                <div className="mb-4">
                  <p className="text-white/50 text-xs mb-1">Available Balance</p>
                  <p className="text-white text-3xl font-bold tracking-tight">
                    {balanceVisible ? formatCurrency(card.balance) : "••••••"}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-white/60 text-sm font-mono">{card.account}</p>
                  <button
                    onClick={e => { e.stopPropagation(); setBalanceVisible(v => !v); }}
                    className="text-xs text-white/60 hover:text-white border border-white/20 rounded-lg px-2 py-1 transition"
                  >
                    {balanceVisible ? "Hide" : "Show"}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Card dots */}
          <div className="flex justify-center gap-2 mt-3">
            {cards.map((_, i) => (
              <button key={i} onClick={() => setActiveCard(i)} className={`h-1.5 rounded-full transition-all ${i === activeCard ? "w-6 bg-[#1C3668]" : "w-1.5 bg-[#D1D5DB]"}`} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 px-4">
          <div className="grid grid-cols-4 gap-3">
            {quickActions.map(({ icon: Icon, label, href }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-2"
              >
                <div className="h-14 w-14 rounded-2xl bg-white shadow-card flex items-center justify-center hover:shadow-lift transition">
                  <Icon size={22} className="text-[#1C3668]" />
                </div>
                <span className="text-[11px] text-[#6B7280] font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transfer row */}
        <div className="mt-4 px-4 grid grid-cols-2 gap-3">
          <button onClick={() => router.push("/transfer")} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-lift transition">
            <div className="h-10 w-10 bg-[#EFF3FA] rounded-xl flex items-center justify-center">
              <ArrowUpRight size={18} className="text-[#1C3668]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1A1A2E]">Send Money</p>
              <p className="text-[11px] text-[#6B7280]">Zelle & transfers</p>
            </div>
          </button>
          <button onClick={() => router.push("/deposit")} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-lift transition">
            <div className="h-10 w-10 bg-[#EFF3FA] rounded-xl flex items-center justify-center">
              <ArrowDownLeft size={18} className="text-[#1C3668]" />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-[#1A1A2E]">Deposit Check</p>
              <p className="text-[11px] text-[#6B7280]">Mobile capture</p>
            </div>
          </button>
        </div>

        {/* Recent Transactions */}
        <div className="mt-6 px-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1A1A2E] text-base">Recent Transactions</h2>
            <button onClick={() => router.push("/transactions")} className="text-xs text-[#1C3668] font-semibold flex items-center gap-0.5 hover:underline">
              See all <ChevronRight size={14} />
            </button>
          </div>
          <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-[#F4F6F9]">
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

        {/* Member FDIC notice */}
        <p className="text-center text-[11px] text-[#9CA3AF] pb-6">Bank of America, N.A. &bull; Member FDIC &bull; Equal Housing Lender</p>
      </div>
    </AppShell>
  );
}
