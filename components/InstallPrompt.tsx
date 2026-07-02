"use client";
import { useEffect, useState } from "react";
import { Download, X } from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "bofa_install_dismissed";

function wasDismissedRecently(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const ts = localStorage.getItem(DISMISSED_KEY);
    if (!ts) return false;
    return Date.now() - parseInt(ts, 10) < 3 * 86400000;
  } catch { return false; }
}

function setDismissed() {
  try { localStorage.setItem(DISMISSED_KEY, Date.now().toString()); } catch {}
}

function isIos(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iphone|ipad|ipod/i.test(navigator.userAgent);
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as unknown as { standalone?: boolean }).standalone === true;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIos, setShowIos] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (isStandalone() || wasDismissedRecently()) return;
    if (isIos()) {
      setTimeout(() => setShowIos(true), 2000);
      return;
    }
    type WinBip = Window & { __bip?: BeforeInstallPromptEvent };
    const early = (window as WinBip).__bip;
    if (early) { setDeferredPrompt(early); return; }
    const handler = (e: Event) => { e.preventDefault(); setDeferredPrompt(e as BeforeInstallPromptEvent); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    if (deferredPrompt) { setTimeout(() => setVisible(true), 1500); }
  }, [deferredPrompt]);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") { setDeferredPrompt(null); setVisible(false); }
  };

  const handleDismiss = () => { setVisible(false); setShowIos(false); setDeferredPrompt(null); setDismissed(); };

  if (visible && deferredPrompt) {
    return (
      <div className="fixed bottom-20 inset-x-0 z-50 px-4" style={{ animation: 'slide-up 0.3s ease-out' }}>
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] overflow-hidden">
          <div className="p-4">
            <div className="flex items-start gap-3">
              <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#1C3668] flex items-center justify-center shrink-0">
                <img src="/favicon.png" alt="BofA" className="h-8 w-8 object-contain" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-[#1C3668] text-[14px]">Install Bank of America</p>
                <p className="text-xs text-[#6B7280] mt-0.5">Add to home screen for quick access to your accounts.</p>
              </div>
              <button onClick={handleDismiss} className="h-7 w-7 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center">
                <X size={14} className="text-[#6B7280]" />
              </button>
            </div>
            <div className="mt-3 flex gap-2">
              <button onClick={handleDismiss} className="flex-1 py-2 rounded-xl text-sm font-semibold text-[#6B7280] hover:bg-[#F4F6F9] transition">Not now</button>
              <button onClick={handleInstall} className="flex-1 py-2 rounded-xl text-sm font-bold text-white bg-[#1C3668] hover:bg-[#152A52] transition flex items-center justify-center gap-1.5">
                <Download size={14} /> Install
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (showIos) {
    return (
      <div className="fixed bottom-20 inset-x-0 z-50 px-4" style={{ animation: 'slide-up 0.3s ease-out' }}>
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-[#E5E7EB] p-4">
          <div className="flex items-start gap-3">
            <div className="h-12 w-12 rounded-xl overflow-hidden bg-[#1C3668] flex items-center justify-center shrink-0">
              <img src="/favicon.png" alt="BofA" className="h-8 w-8 object-contain" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-[#1C3668] text-[14px]">Install Bank of America</p>
              <p className="text-xs text-[#6B7280] mt-1">Tap the Share button then &quot;Add to Home Screen&quot;</p>
            </div>
            <button onClick={handleDismiss} className="h-7 w-7 rounded-full hover:bg-[#F4F6F9] flex items-center justify-center">
              <X size={14} className="text-[#6B7280]" />
            </button>
          </div>
          <button onClick={handleDismiss} className="mt-3 w-full py-2 text-sm font-semibold text-[#1C3668] hover:bg-[#F4F6F9] rounded-xl transition">Got it</button>
        </div>
      </div>
    );
  }

  return null;
}
