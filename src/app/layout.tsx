import type { Metadata } from "next";
import { Fraunces, DM_Sans } from "next/font/google";
import Link from "next/link";
import { Providers } from "@/components/onboarding/Providers";
import { NavHeader } from "@/components/ui/NavHeader";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Roost -- Find Where You'll Thrive",
  description:
    "AI-powered life-relocation assistant. Discover US cities where you'd thrive -- not just job listings.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="antialiased">
        <Providers>
          <header className="sticky top-0 z-50 border-b border-charcoal/10 bg-cream/90 backdrop-blur-sm">
            <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
              <Link href="/" className="font-display text-2xl font-semibold text-terracotta">
                Roost
              </Link>
              <NavHeader />
            </nav>
          </header>
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
