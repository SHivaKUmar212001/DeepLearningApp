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
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#111113]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 w-full max-w-[1200px] items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2.5" aria-label="DeepDive home">
          <span className="flex size-7 items-center justify-center rounded bg-teal-600 text-xs font-bold text-white">
            D
          </span>
          <span className="text-[15px] font-semibold text-zinc-100">
            DeepDive
          </span>
        </Link>

        <nav aria-label="Primary navigation" className="flex items-center gap-1">
          {navItems.map(({ href, label }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "px-3 py-1.5 text-sm rounded-md transition-colors",
                  isActive
                    ? "text-zinc-100 bg-white/[0.06]"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
                aria-current={isActive ? "page" : undefined}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
