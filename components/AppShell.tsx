"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, ReactNode } from "react";
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

  const handleSignOut = () => {
    signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9] flex flex-col">
      {/* Top header */}
      <header className="bg-[#1C3668] text-white px-4 py-3 flex items-center justify-between shrink-0">
        <button onClick={() => setMenuOpen(true)} className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 transition">
          <Menu size={22} />
        </button>
        <img src="/logo.png" alt="Bank of America" className="h-8 w-8 object-contain" style={{ filter: "brightness(0) invert(1)" }} />
        <div className="flex items-center gap-2">
          <button className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-white/10 transition relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-[#E31837]" />
          </button>
          <button onClick={() => router.push("/profile")} className="h-9 w-9 rounded-full overflow-hidden border-2 border-white/30">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.firstName} className="h-full w-full object-cover" onError={e => { (e.target as HTMLImageElement).src = ''; }} />
            ) : (
              <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-xs font-bold">
                {user?.firstName[0]}{user?.lastName[0]}
              </div>
            )}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-auto pb-20">{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 bg-white border-t border-[#E5E7EB] z-40">
        <div className="flex">
          {NAV.map(({ href, icon: Icon, label }) => {
            const active = pathname.startsWith(href);
            return (
              <Link key={href} href={href} className={`flex-1 flex flex-col items-center py-2.5 gap-0.5 transition-colors relative ${active ? "text-[#1C3668]" : "text-[#9CA3AF] hover:text-[#6B7280]"}`}>
                <Icon size={22} strokeWidth={active ? 2.5 : 1.8} />
                <span className="text-[10px] font-medium">{label}</span>
                {active && <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#E31837] rounded-full" />}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Slide-out menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMenuOpen(false)} />
          <div className="relative w-72 bg-white h-full shadow-2xl flex flex-col">
            <div className="bg-[#1C3668] px-6 py-8 relative">
              <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 h-8 w-8 rounded-full flex items-center justify-center hover:bg-white/10">
                <X size={18} className="text-white" />
              </button>
              <div className="flex items-center gap-3 mt-4">
                <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-white/30 shrink-0">
                  {user?.avatar ? (
                    <img src={user.avatar} className="h-full w-full object-cover" alt={user.firstName} onError={e => { (e.target as HTMLImageElement).style.display='none'; }} />
                  ) : (
                    <div className="h-full w-full bg-[#E31837] flex items-center justify-center text-lg font-bold text-white">
                      {user?.firstName[0]}{user?.lastName[0]}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-bold text-[15px]">{user?.firstName} {user?.lastName}</p>
                  <p className="text-white/60 text-xs mt-0.5">{user?.userId}</p>
                </div>
              </div>
            </div>

            <div className="flex-1 py-4 overflow-auto">
              {[
                { href: '/dashboard', icon: Home, label: 'Home' },
                { href: '/transfer', icon: ArrowLeftRight, label: 'Transfers' },
                { href: '/pay-bills', icon: Receipt, label: 'Pay Bills' },
                { href: '/deposit', icon: CreditCard, label: 'Mobile Deposit' },
                { href: '/transactions', icon: BarChart3, label: 'Activity' },
                { href: '/profile', icon: Building2, label: 'Profile & Settings' },
              ].map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-6 py-3.5 text-[#1A1A2E] hover:bg-[#F4F6F9] transition text-[14px] font-medium">
                  <Icon size={18} className="text-[#1C3668]" />
                  {label}
                </Link>
              ))}
            </div>

            <div className="border-t border-[#E5E7EB] p-4">
              <button onClick={handleSignOut} className="w-full flex items-center gap-3 px-3 py-3 text-[#E31837] hover:bg-red-50 rounded-xl transition text-sm font-semibold">
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
