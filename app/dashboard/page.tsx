"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ArrowDownLeft, Banknote, FileText, Building, ChevronRight, Eye, EyeOff, TrendingDown } from "lucide-react";
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
  const allTxns = getTransactions(user.transactionKey);
  const txns = allTxns.slice(0, 5);
  const netWorth = bal.checking + bal.savings + bal.rewards;
  const totalSpend = allTxns.filter(t => t.amount < 0).reduce((s, t) => s + Math.abs(t.amount), 0);
  const spendBars = allTxns.slice(0, 7).slice().reverse();
  const maxSpend = Math.max(...spendBars.map(t => Math.abs(t.amount)), 1);

  const cards = [
    { label: "Checking Account", balance: bal.checking, account: user.accountNumber, gradient: "from-[#1C3668] to-[#2A4A85]", tag: "Bank of America" },
    { label: "Savings Account", balance: bal.savings, account: user.accountNumber.replace("****", "****"), gradient: "from-[#0A1628] to-[#13294B]", tag: "Advantage Savings" },
    { label: "Cash Rewards", balance: bal.rewards, account: "Rewards Points", gradient: "from-[#E31837] to-[#8C0F22]", tag: "BankAmericard" },
  ];

  const quickActions = [
    { icon: FileText, label: "Pay Bills", href: "/pay-bills", bg: "#EEF2FF", fg: "#4338CA" },
    { icon: Banknote, label: "eDeposit", href: "/deposit", bg: "#ECFDF5", fg: "#059669" },
    { icon: ArrowUpRight, label: "Transfers", href: "/transfer", bg: "#FEF2F2", fg: "#E31837" },
    { icon: Building, label: "Locations", href: "#", bg: "#FFFBEB", fg: "#D97706" },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppShell>
      <div className="animate-fade-in">
        {/* Greeting */}
        <div className="bg-gradient-to-b from-[#0A1628] to-[#1C3668] px-4 pb-7 pt-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-white/55 text-sm">{greeting},</p>
            <p className="text-white font-bold text-2xl truncate">{user.firstName} {user.lastName}</p>
            <p className="text-white/40 text-xs mt-1">Bank of America Life Plan &bull; Member since {new Date(user.memberSince).getFullYear()}</p>
          </div>
          <div className="h-14 w-14 rounded-2xl overflow-hidden border-2 border-white/25 shadow-lg shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-white font-bold">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            )}
          </div>
        </div>

        {/* Net worth strip */}
        <div className="px-4 -mt-4">
          <div className="bg-white rounded-2xl shadow-card px-5 py-3.5 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Total Balance</p>
              <p className="text-lg font-bold text-[#1A1A2E] mt-0.5">{balanceVisible ? formatCurrency(netWorth) : "••••••"}</p>
            </div>
            <button
              onClick={() => setBalanceVisible(v => !v)}
              className="h-9 w-9 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-[#6B7280] hover:text-[#1C3668] hover:bg-[#EFF3FA] transition"
            >
              {balanceVisible ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>
        </div>

        {/* Account Cards */}
        <div className="px-4 mt-4">
          <div className="flex gap-4 overflow-x-auto pb-2 snap-x snap-mandatory hide-scrollbar">
            {cards.map((card, idx) => (
              <div
                key={idx}
                onClick={() => setActiveCard(idx)}
                className={`card-premium snap-center shrink-0 w-[calc(100vw-48px)] max-w-sm rounded-3xl bg-gradient-to-br ${card.gradient} p-5 shadow-lift cursor-pointer transition-transform ${activeCard === idx ? "scale-100" : "scale-[0.97]"}`}
              >
                <div className="flex justify-between items-start mb-6 relative z-10">
                  <div>
                    <p className="text-white/60 text-xs font-medium uppercase tracking-wide">{card.tag}</p>
                    <p className="text-white font-semibold text-sm mt-0.5">{card.label}</p>
                  </div>
                  <img src="/logo.png" alt="BoA" className="h-6 object-contain brightness-0 invert opacity-70" />
                </div>

                <div className="mb-4 relative z-10">
                  <p className="text-white/50 text-xs mb-1">Available Balance</p>
                  <p className="text-white text-3xl font-bold tracking-tight">
                    {balanceVisible ? formatCurrency(card.balance) : "••••••"}
                  </p>
                </div>

                <div className="flex items-center justify-between relative z-10">
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
            {quickActions.map(({ icon: Icon, label, href, bg, fg }) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="h-14 w-14 rounded-2xl shadow-card flex items-center justify-center group-hover:shadow-lift group-active:scale-95 transition-all" style={{ background: bg }}>
                  <Icon size={22} style={{ color: fg }} />
                </div>
                <span className="text-[11px] text-[#6B7280] font-medium text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Transfer row */}
        <div className="mt-4 px-4 grid grid-cols-2 gap-3">
          <button onClick={() => router.push("/transfer")} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-lift active:scale-[0.98] transition">
            <div className="h-10 w-10 bg-[#EFF3FA] rounded-xl flex items-center justify-center">
              <ArrowUpRight size={18} className="text-[#1C3668]" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-[#1A1A2E]">Send Money</p>
              <p className="text-[11px] text-[#6B7280]">Zelle & transfers</p>
            </div>
          </button>
          <button onClick={() => router.push("/deposit")} className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-3 hover:shadow-lift active:scale-[0.98] transition">
            <div className="h-10 w-10 bg-[#EFF3FA] rounded-xl flex items-center justify-center">
              <ArrowDownLeft size={18} className="text-[#1C3668]" />
            </div>
            <div className="text-left min-w-0">
              <p className="text-xs font-bold text-[#1A1A2E]">Deposit Check</p>
              <p className="text-[11px] text-[#6B7280]">Mobile capture</p>
            </div>
          </button>
        </div>

        {/* Spending snapshot */}
        <div className="mt-6 px-4">
          <div className="bg-white rounded-2xl shadow-card p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-[11px] text-[#9CA3AF] font-semibold uppercase tracking-wide">Spending Snapshot</p>
                <p className="text-xl font-bold text-[#1A1A2E] mt-0.5">{formatCurrency(totalSpend)}</p>
              </div>
              <span className="flex items-center gap-1 text-[11px] font-semibold text-[#E31837] bg-red-50 px-2 py-1 rounded-full">
                <TrendingDown size={12} /> Last 7 txns
              </span>
            </div>
            <div className="flex items-end justify-between gap-2 h-20">
              {spendBars.map(t => (
                <div key={t.id} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div
                    className={`w-full rounded-lg transition-all group-hover:opacity-80 ${t.amount < 0 ? "bg-gradient-to-t from-[#1C3668] to-[#2A4A85]" : "bg-gradient-to-t from-emerald-500 to-emerald-400"}`}
                    style={{ height: `${Math.max((Math.abs(t.amount) / maxSpend) * 100, 8)}%` }}
                    title={`${t.merchant}: ${formatCurrency(t.amount)}`}
                  />
                  <span className="text-[9px] text-[#9CA3AF] truncate w-full text-center">{t.merchant.split(" ")[0]}</span>
                </div>
              ))}
            </div>
          </div>
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
