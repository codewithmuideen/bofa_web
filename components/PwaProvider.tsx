"use client";
import { useEffect } from "react";
import InstallPrompt from "./InstallPrompt";

export default function PwaProvider() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return <InstallPrompt />;
}
