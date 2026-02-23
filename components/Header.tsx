"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { LastUpdated } from "@/lib/types";

export default function Header() {
  const [updated, setUpdated] = useState<LastUpdated | null>(null);

  useEffect(() => {
    fetch("/data/last_updated.json")
      .then((r) => r.json())
      .then(setUpdated)
      .catch(() => {});
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-base font-bold">
          내집내놔
        </Link>

        <nav className="flex items-center gap-1 text-[13px]">
          <Link href="/buy" className="rounded-full px-3 py-1 transition hover:bg-blue-50 hover:text-blue-600">
            매매
          </Link>
          <Link href="/rent" className="rounded-full px-3 py-1 transition hover:bg-green-50 hover:text-green-600">
            전세
          </Link>
          <Link href="/tax" className="rounded-full px-3 py-1 transition hover:bg-orange-50 hover:text-orange-600">
            매도
          </Link>
          <Link href="/sources" className="rounded-full px-3 py-1 transition hover:bg-gray-100">
            📎 근거
          </Link>
        </nav>

        {updated && (
          <span className="hidden text-[11px] text-gray-300 sm:inline">
            📅 {updated.updatedAt}
          </span>
        )}
      </div>
    </header>
  );
}
