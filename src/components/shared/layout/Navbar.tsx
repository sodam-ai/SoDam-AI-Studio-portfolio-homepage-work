"use client";
/* eslint-disable @typescript-eslint/no-unused-vars */

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function Navbar({
  siteName = "SoDam AI Studio",
}: Readonly<{
  siteName?: string;
}>) {
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const isProjectDetailPage = pathname?.startsWith("/work/");

  if (!mounted || isProjectDetailPage) {
    return (
      <nav
        className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl h-[72px] bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full z-50 opacity-0 pointer-events-none"
        aria-hidden="true"
      />
    );
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-full z-50 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-700 animate-in fade-in slide-in-from-top-10">
      {/* 로고 영역 */}
      <Link
        href="/"
        className="relative z-1001 group"
        onClick={(e) => {
          if (globalThis.location.pathname === "/") {
            e.preventDefault();
            globalThis.scrollTo({ top: 0, behavior: "smooth" });
          }
        }}
      >
        <div className="flex items-center gap-3 hover:opacity-75 transition-opacity">
          {/* SD 배지 */}
          <div className="w-9 h-9 flex items-center justify-center rounded-lg border border-white/25 bg-white/8 group-hover:border-white/50 transition-all duration-300 shrink-0">
            <span className="text-white font-black text-sm leading-none select-none">
              SD
            </span>
          </div>

          {/* 브랜드명 — 한 줄, 크고 선명하게 */}
          <span className="text-white font-bold text-base tracking-normal whitespace-nowrap">
            SoDam <span className="text-white/60 font-normal">AI Studio</span>
          </span>
        </div>
      </Link>

      {/* 네비게이션 링크 */}
      <div className="flex items-center gap-8 text-[12px] font-semibold uppercase tracking-wide text-white">
        <Link
          href="/work"
          className="hover:opacity-50 transition-opacity hidden sm:block"
        >
          Work
        </Link>
        <Link
          href="/about"
          className="hover:opacity-50 transition-opacity hidden sm:block"
        >
          About
        </Link>
        <Link
          href="/contact"
          className="px-5 py-2 bg-white text-black text-[11px] font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105"
        >
          Talk
        </Link>
      </div>
    </nav>
  );
}
