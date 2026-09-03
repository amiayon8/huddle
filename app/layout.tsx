import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { HuddleProvider } from "./context/HuddleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huddle — Skill Development Platform",
  description: "A calm, focused space for deliberate skill practice with intimate 4-member micro-squads and curated roadmap steps.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-[#f8f9fc] dark:bg-[#090a0f] text-zinc-900 dark:text-zinc-100 antialiased selection:bg-indigo-600 selection:text-white transition-colors duration-150`}>
        <HuddleProvider>
          {children}
        </HuddleProvider>
      </body>
    </html>
  );
}
