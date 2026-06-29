import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sansFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Codexa | Developer Productivity & Analytics Platform",
  description: "The ultimate developer productivity platform. Sync your LeetCode, Codeforces, and GitHub profiles, track your coding sheets, generate ATS-friendly resumes, and view comprehensive analytics.",
  keywords: ["developer productivity", "leetcode tracker", "github analytics", "coding profile", "resume builder", "coding sheet", "striver sde sheet"],
};

import Providers from "@/components/shared/Providers";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${sansFont.variable} ${monoFont.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
