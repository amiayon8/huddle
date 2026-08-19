import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { HuddleProvider } from "./context/HuddleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huddle — Skill Development Platform",
  description: "A calm, focused space for deliberate skill practice with intimate 4-member micro-squads and curated roadmap steps.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-indigo-600 selection:text-white`}>
        <HuddleProvider>
          {children}
        </HuddleProvider>
      </body>
    </html>
  );
}

