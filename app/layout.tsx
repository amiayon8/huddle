import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "katex/dist/katex.min.css";
import { HuddleProvider } from "./context/HuddleContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huddle - Skill Development Platform",
  description:
    "A calm, focused space for deliberate skill practice with intimate 4-member micro-squads and curated roadmap steps.",
  icons: {
    icon: [
      { url: "/logo.svg" },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('huddle_theme');if(t==='light'){document.documentElement.classList.remove('dark');document.documentElement.classList.add('light');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className={`${inter.className} min-h-screen bg-[#f6f7fc] dark:bg-[#080c18] text-[#06427D] dark:text-[#BBBCE4] antialiased selection:bg-[#5420A6] selection:text-[#FFFFFF] dark:selection:text-[#BBBCE4] transition-colors duration-150`}
      >
        <HuddleProvider>{children}</HuddleProvider>
      </body>
    </html>
  );
}
