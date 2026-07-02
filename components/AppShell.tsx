"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, ReactNode } from "react";
import { Home, ArrowLeftRight, BarChart3, User, Menu, X, Bell, LogOut, CreditCard, Receipt, Building2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

const NAV = [
  { href: "/dashboard", icon: Home, label: "Home" },
  { href: "/transfer", icon: ArrowLeftRight, label: "Transfers" },
  { href: "/transactions", icon: BarChart3, label: "Activity" },
  { href: "/profile", icon: User, label: "Profile" },
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

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      {/* Top header */}
      <header className="bg-[#1C3668] text-white px-4 py-3 flex items-center justify-between shrink-0 safe-top shadow-sm">
        <button onClick={() => setMenuOpen(true)} className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition">
          <Menu size={21} />
        </button>
        <img src="/logo.png" alt="Bank of America" className="h-7 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="flex items-center gap-1.5">
          <button className="h-10 w-10 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-95 transition relative">
            <Bell size={19} />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E31837] ring-2 ring-[#1C3668]" />
          </button>
          <button onClick={() => router.push("/profile")} className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/40 shrink-0 hover:border-white/70 transition">
            {user?.avatar && !avatarFailed ? (
              <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" onError={() => setAvatarFailed(true)} />
            ) : (
              <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-xs font-bold">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-24">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] z-40 safe-bottom">
        <div className="flex">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2.5 gap-1 transition-colors relative ${active ? "text-[#1C3668]" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                <span className={`h-7 w-7 rounded-xl flex items-center justify-center transition-all ${active ? "bg-[#1C3668]/10" : ""}`}>
                  <Icon size={20} strokeWidth={active ? 2.5 : 1.8} />
                </span>
                <span className={`text-[10px] transition-all ${active ? "font-bold" : "font-medium"}`}>{label}</span>
                {active && <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E31837] rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] animate-fade-in" onClick={() => setMenuOpen(false)} />
          <div className="relative w-[19rem] max-w-[85vw] bg-white h-full shadow-2xl flex flex-col">
            <div className="bg-[#1C3668] px-6 pt-8 pb-8 relative overflow-hidden">
              <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10 z-10">
                <X size={18} className="text-white" />
              </button>
              <div className="flex items-center gap-3 mt-4 relative z-10">
                <div className="h-16 w-16 rounded-2xl overflow-hidden border-2 border-white/25 shrink-0 shadow-lg">
                  {user?.avatar && !avatarFailed ? (
                    <img src={user.avatar} className="h-full w-full object-cover" alt={user.firstName} onError={() => setAvatarFailed(true)} />
                  ) : (
                    <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-lg font-bold text-white">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-white font-bold text-[15px] truncate">{user?.firstName} {user?.lastName}</p>
                  <p className="text-white/50 text-xs mt-0.5">{user?.userId}</p>
                  <span className="inline-block mt-1.5 text-[10px] font-bold uppercase tracking-wide text-white/80 bg-white/10 px-2 py-0.5 rounded-full">Preferred Rewards</span>
                </div>
              </div>
            </div>

            <div className="flex-1 py-3 overflow-auto">
              {[
                { href: '/dashboard', icon: Home, label: 'Home' },
                { href: '/transfer', icon: ArrowLeftRight, label: 'Transfers' },
                { href: '/pay-bills', icon: Receipt, label: 'Pay Bills' },
                { href: '/deposit', icon: CreditCard, label: 'Mobile Deposit' },
                { href: '/transactions', icon: BarChart3, label: 'Activity' },
                { href: '/profile', icon: Building2, label: 'Profile & Settings' },
              ].map(({ href, icon: Icon, label }) => {
                const active = pathname.startsWith(href);
                return (
                  <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 mx-3 px-4 py-3 rounded-xl transition text-[14px] font-medium ${active ? "bg-[#1C3668]/8 text-[#1C3668] font-bold" : "text-[#1A1A2E] hover:bg-[#F4F6F9]"}`}>
                    <span className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-[#1C3668] text-white" : "bg-[#EFF3FA] text-[#1C3668]"}`}>
                      <Icon size={16} />
                    </span>
                    {label}
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-[#E5E7EB] p-4">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-4 py-3 text-[#E31837] hover:bg-red-50 rounded-xl transition text-sm font-semibold active:scale-[0.98]">
                <LogOut size={18} />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
