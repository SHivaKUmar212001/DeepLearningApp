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
    <header className="sticky top-0 z-50 border-b border-rose-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-80"
          aria-label="DeepDive home"
        >
          <span className="flex size-8 items-center justify-center rounded-full bg-rose-950 text-sm font-black text-white">
            D
          </span>
          <span className="text-xl font-bold tracking-tight text-rose-950">
            DeepDive
          </span>
        </Link>

        {/* Navigation */}
        <nav aria-label="Primary navigation" className="flex items-center gap-1">
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
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-rose-950"
                    : "text-rose-400 hover:text-rose-700"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
                {isActive && (
                  <span className="absolute inset-x-1 -bottom-[1.05rem] h-[2px] rounded-full bg-rose-950" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
