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
      <body className="min-h-full flex flex-col font-sans text-rose-950 bg-white">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4 focus:bg-white focus:text-indigo-600 focus:font-bold"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <footer className="border-t border-rose-100 bg-white">
          <div className="mx-auto max-w-[1200px] px-6 py-10 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <p className="text-sm text-rose-400">
                &copy; {new Date().getFullYear()} DeepDive &mdash; Learn deep learning interactively.
              </p>
              <div className="flex gap-6 text-sm text-rose-400">
                <a href="/curriculum" className="hover:text-rose-700 transition-colors">Curriculum</a>
                <a href="/playground" className="hover:text-rose-700 transition-colors">Lab</a>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
