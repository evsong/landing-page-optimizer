import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PageScore — AI Landing Page Analyzer",
  description: "Get a comprehensive 7-dimension score for any landing page. AI-powered analysis with actionable optimization suggestions.",
  keywords: ["landing page analyzer", "landing page grader", "conversion optimization", "page score", "website audit"],
  openGraph: {
    title: "PageScore — AI Landing Page Analyzer",
    description: "Input any URL, get a 7-dimension score + AI suggestions in under 60 seconds.",
    type: "website",
    siteName: "PageScore",
  },
  twitter: {
    card: "summary_large_image",
    title: "PageScore — AI Landing Page Analyzer",
    description: "7-dimension score + AI suggestions for any landing page.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrains.variable} font-sans antialiased bg-zinc-950 text-zinc-100 min-h-screen`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
