import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "OMOS Production Evidence | OneGodian Management & Operating System",
  description:
    "Review the repository-backed OMOS 1.1.0 capabilities, current maturity classifications, evidence sources, and open production deployment gates.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "https://onegodian-omos.onegodian.chatgpt.site/favicon.svg",
    shortcut: "https://onegodian-omos.onegodian.chatgpt.site/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
