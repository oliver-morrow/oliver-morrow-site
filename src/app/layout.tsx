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
    "A personal site about data systems, agent infrastructure, side projects, and the work behind them.",
  keywords: [
    "Oliver Morrow",
    "Data Engineer",
    "Systems Engineering",
    "Agents",
    "Toronto",
    "Next.js",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth" style={{ backgroundColor: "#000000" }}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ backgroundColor: "#000000", color: "#a1a1aa" }}
      >
        <div className="min-h-screen bg-black">
          <Navbar />
          <main className="min-h-screen bg-black pt-12">{children}</main>
        </div>
      </body>
    </html>
  );
}
