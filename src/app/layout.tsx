import type { Metadata } from "next";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";
import { SiteHeader } from "@/components/ui/SiteHeader";
import "./globals.css";

export const metadata: Metadata = {
  title: "DeepDive",
  description: "Interactive learning website that teaches deep learning end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-violet-900 focus:text-white focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col relative">
          {children}
        </main>
        <footer className="relative z-10 border-t border-white/5">
          <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-white/25">
                &copy; {new Date().getFullYear()} DeepDive &mdash; Learn deep learning interactively.
              </p>
              <div className="flex gap-6 text-sm text-white/25">
                <a href="/curriculum" className="hover:text-violet-400 transition-colors duration-300">Curriculum</a>
                <a href="/playground" className="hover:text-cyan-400 transition-colors duration-300">Lab</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
