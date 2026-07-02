"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import AppShell from "@/components/AppShell";
import TransactionIcon from "@/components/TransactionIcon";
import { useAuth } from "@/lib/auth";
import { getTransactions, formatCurrency, formatDate, Transaction } from "@/lib/data";

type FilterTab = "all" | "debit" | "credit";

function groupByDate(txns: Transaction[]) {
  const groups: Record<string, Transaction[]> = {};
  for (const t of txns) {
    if (!groups[t.date]) groups[t.date] = [];
    groups[t.date].push(t);
  }
  return groups;
}

function getDateLabel(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return "Today";
  if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
  return formatDate(dateStr);
}

export default function TransactionsPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<FilterTab>("all");

  useEffect(() => {
    if (!isLoading && !user) router.replace("/login");
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  const allTxns = getTransactions(user.transactionKey);

  const filtered = allTxns.filter(t => {
    const matchFilter = filter === "all" || t.type === filter;
    const matchSearch = search === "" || t.merchant.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const grouped = groupByDate(filtered);
  const sortedDates = Object.keys(grouped).sort((a, b) => b.localeCompare(a));

  return (
    <AppShell>
      <div className="animate-fade-in">
        {/* Header */}
        <div className="bg-[#1C3668] px-4 py-5">
          <h1 className="text-white font-bold text-xl">Transaction History</h1>
          <p className="text-white/60 text-sm mt-0.5">All account activity</p>
        </div>

        {/* Search */}
        <div className="px-4 py-3 bg-white border-b border-[#E5E7EB]">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-[#F4F6F9] border border-[#E5E7EB] text-sm text-[#1A1A2E] placeholder-[#9CA3AF] focus:outline-none focus:border-[#1C3668]"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X size={14} className="text-[#9CA3AF]" />
              </button>
            )}
          </div>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 px-4 py-3 bg-white border-b border-[#E5E7EB]">
          {(["all", "debit", "credit"] as FilterTab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold capitalize transition ${filter === tab ? "bg-[#1C3668] text-white" : "text-[#6B7280] hover:bg-[#F4F6F9]"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Transactions grouped by date */}
        <div className="p-4 space-y-4">
          {sortedDates.length === 0 ? (
            <div className="text-center py-12 text-[#9CA3AF]">
              <p className="text-lg font-semibold">No transactions found</p>
              <p className="text-sm mt-1">Try a different search or filter</p>
            </div>
          ) : (
            sortedDates.map(date => (
              <div key={date}>
                <p className="text-xs font-semibold text-[#9CA3AF] uppercase tracking-wide mb-2 px-1">{getDateLabel(date)}</p>
                <div className="bg-white rounded-2xl shadow-card overflow-hidden divide-y divide-[#F4F6F9]">
                  {grouped[date].map(txn => (
                    <div key={txn.id} className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#F9FAFC] transition">
                      <TransactionIcon icon={txn.icon} merchant={txn.merchant} />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#1A1A2E] truncate">{txn.merchant}</p>
                        <p className="text-xs text-[#9CA3AF]">{txn.category}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className={`text-sm font-bold ${txn.amount >= 0 ? "text-green-600" : "text-[#1A1A2E]"}`}>
                          {txn.amount >= 0 ? "+" : ""}{formatCurrency(txn.amount)}
                        </p>
                        <p className="text-[10px] text-[#9CA3AF] mt-0.5 capitalize">{txn.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AppShell>
  );
}
