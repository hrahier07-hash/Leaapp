import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";

import { PwaRegister } from "@/components/pwa/PwaRegister";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const niagaraSolid = localFont({
  src: "./fonts/NiagaraSolid.woff2",
  variable: "--font-niagara",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "LeaDoku",
    template: "%s | LeaDoku",
  },
  description:
    "Sudoku mobile gamifié. Dessine les chiffres avec ton doigt et progresse.",
  manifest: "/manifest.json",
  applicationName: "LeaDoku",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "LeaDoku",
  },
  icons: {
    icon: [{ url: "/icons/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} ${niagaraSolid.variable} font-sans antialiased`}>
        <PwaRegister />
        <div className="mobile-frame">{children}</div>
      </body>
    </html>
  );
}
