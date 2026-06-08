"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/curriculum", label: "Curriculum" },
  { href: "/playground", label: "Lab" },
];

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 glass border-b border-transparent" style={{ borderImage: "linear-gradient(90deg, transparent, rgba(139,92,246,0.2), rgba(6,182,212,0.2), transparent) 1" }}>
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="group flex items-center gap-3 transition-opacity duration-200"
          aria-label="DeepDive home"
        >
          <span className="relative flex size-9 items-center justify-center rounded-lg text-sm font-black text-white overflow-hidden">
            <span className="absolute inset-0 bg-gradient-to-br from-violet-600 to-cyan-500 opacity-90" />
            <span className="absolute inset-0 bg-gradient-to-br from-violet-500 to-cyan-400 opacity-0 group-hover:opacity-90 transition-opacity duration-200" />
            <span className="relative z-10">D</span>
            <span className="absolute inset-0 rounded-lg ring-1 ring-white/10" />
          </span>
          <span className="text-xl font-bold tracking-tight text-white/90 group-hover:text-white transition-colors">
            Deep<span className="text-violet-400">Dive</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Primary navigation" className="flex items-center gap-0.5 rounded-full glass p-1">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/"
                ? pathname === "/"
                : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "relative px-5 py-2 text-sm font-medium rounded-full transition-colors duration-200",
                  isActive
                    ? "text-white"
                    : "text-white/40 hover:text-white/70"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-600/40 to-cyan-600/40 border border-violet-500/20" />
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
