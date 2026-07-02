import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";
import PwaProvider from "@/components/PwaProvider";

export const metadata: Metadata = {
  title: "Bank of America | Mobile Banking",
  description: "Manage your accounts, transfer funds, deposit checks, and pay bills.",
  manifest: "/manifest.json",
  applicationName: "Bank of America",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Bank of America" },
  icons: { icon: "/favicon.png", apple: "/favicon.png" },
};

export const viewport: Viewport = {
  themeColor: "#1C3668",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full">
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.addEventListener('beforeinstallprompt',function(e){e.preventDefault();window.__bip=e;});` }} />
      </head>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          {children}
          <PwaProvider />
        </AuthProvider>
      </body>
    </html>
  );
}
