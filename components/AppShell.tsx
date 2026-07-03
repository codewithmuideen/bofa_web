"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Home, Banknote, ArrowLeftRight, BarChart3, Menu as MenuIcon, X, LogOut, Receipt, User as UserIcon, FileText } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/deposit", icon: Banknote, label: "Deposit" },
  { href: "/transfer", icon: ArrowLeftRight, label: "Transfers" },
  { href: "/transactions", icon: BarChart3, label: "Activity" },
];

const MENU_ITEMS = [
  { href: "/transactions", icon: FileText, label: "Transactions" },
  { href: "/pay-bills", icon: Receipt, label: "Pay bills" },
  { href: "/transfer", icon: ArrowLeftRight, label: "Transfer money" },
  { href: "/deposit", icon: Banknote, label: "Deposit a check" },
  { href: "/profile", icon: UserIcon, label: "Profile & settings" },
];

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarFailed, setAvatarFailed] = useState(false);

  useEffect(() => { setAvatarFailed(false); }, [user?.id]);

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  const handleNav = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      <div className="h-[3px] bg-[#E31837] safe-top shrink-0" />

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-40 safe-bottom">
        <div className="flex">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors relative ${active ? "text-[#1C3668]" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                <span className={`h-7 w-7 rounded-full flex items-center justify-center transition-all ${active ? "bg-[#1C3668]/10" : ""}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                <span className={`text-[10px] transition-all ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E31837] rounded-full" />}
              </Link>
            );
          })}
          <button onClick={() => setMenuOpen(true)} className="flex-1 flex flex-col items-center py-2.5 gap-1 text-[#9CA3AF] hover:text-[#6B7280] transition-colors">
            <span className="h-7 w-7 rounded-full flex items-center justify-center">
              <MenuIcon size={20} strokeWidth={1.8} />
            </span>
            <span className="text-[10px] font-medium">Menu</span>
          </button>
        </div>
      </nav>

      {/* Menu modal (centered, Wells-Fargo style) */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50 animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="relative w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#E5E7EB]">
              <button onClick={() => handleNav("/profile")} className="flex items-center gap-3 text-left min-w-0 group">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-[#E5E7EB] shrink-0 group-hover:border-[#1C3668]/40 transition">
                  {user?.avatar && !avatarFailed ? (
                    <img src={user.avatar} className="h-full w-full object-cover" alt={user.firstName} onError={() => setAvatarFailed(true)} />
                  ) : (
                    <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-sm font-bold text-white">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-[#1A1A2E] text-[15px] truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[#6B7280] text-xs truncate">{user?.email}</p>
                </div>
              </button>
              <button onClick={() => setMenuOpen(false)} className="h-8 w-8 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center shrink-0">
                <X size={18} className="text-[#6B7280]" />
              </button>
            </div>

            <div className="py-2">
              {MENU_ITEMS.map(({ href, icon: Icon, label }) => (
                <button key={href} onClick={() => handleNav(href)}
                  className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[#F4F6F9] transition text-left">
                  <span className="h-10 w-10 rounded-full bg-red-50 text-[#E31837] flex items-center justify-center shrink-0">
                    <Icon size={17} />
                  </span>
                  <span className="text-[15px] font-medium text-[#1A1A2E]">{label}</span>
                </button>
              ))}
              <button onClick={handleSignOut}
                className="w-full flex items-center gap-4 px-6 py-3 hover:bg-[#F4F6F9] transition text-left">
                <span className="h-10 w-10 rounded-full bg-red-50 text-[#E31837] flex items-center justify-center shrink-0">
                  <LogOut size={17} />
                </span>
                <span className="text-[15px] font-bold text-[#E31837]">Sign off</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
