import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sudoku Quest",
    template: "%s | Sudoku Quest",
  },
  description:
    "Sudoku mobile gamifié. Dessine les chiffres avec ton doigt et progresse.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Sudoku Quest",
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
      <body className={`${inter.variable} font-sans antialiased`}>
        <div className="mobile-frame">{children}</div>
      </body>
    </html>
  );
}
