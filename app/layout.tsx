/** @format */

import type React from "react";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import { CricketSidebar } from "@/components/cricket-sidebar";
import { Suspense } from "react";
import { MatchProvider } from "@/context/match-context";

export const metadata: Metadata = {
  title: "Cricket Match Dashboard",
  description: "Professional cricket management dashboard",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <MatchProvider>
          <div className="flex h-screen">
            <Suspense fallback={<div>Loading...</div>}>
              <CricketSidebar />
              <main className="flex-1 overflow-auto">{children}</main>
            </Suspense>
          </div>
        </MatchProvider>
        <Analytics />
      </body>
    </html>
  );
}
