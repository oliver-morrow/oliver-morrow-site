import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/components/Navbar";
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
  title: {
    template: "%s :: OLIVER MORROW",
    default: "OLIVER MORROW",
  },
  description:
    "Computer Engineering // Data Architecture // Hardware-Accelerated Interfaces.",
  keywords: ["Data Engineer", "Systems Engineering", "Toronto", "Next.js", "WebGL"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="min-h-screen">
          <Navbar />
          <main className="pt-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
