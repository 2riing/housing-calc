"use client";

import Image from "next/image";
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
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-3">
        <nav className="flex items-center gap-1 text-[13px] font-medium text-gray-500">
          <Link
            href="/buy"
            className="rounded-full px-3 py-1 transition hover:bg-green-50 hover:text-green-600"
          >
            매매
          </Link>
          <Link
            href="/tax"
            className="rounded-full px-3 py-1 transition hover:bg-green-50 hover:text-green-600"
          >
            매도
          </Link>
        </nav>

        <Link href="/" className="mx-4 flex items-center gap-2 text-base font-extrabold text-gray-900">
          <Image src="/logo.jpg" alt="내집내놔" width={32} height={32} className="rounded-full" />
          내집내놔
        </Link>

        <nav className="flex items-center gap-1 text-[13px] font-medium text-gray-500">
          <Link
            href="/rent"
            className="rounded-full px-3 py-1 transition hover:bg-green-50 hover:text-green-600"
          >
            전세
          </Link>
          <Link
            href="/rent"
            className="rounded-full px-3 py-1 transition hover:bg-green-50 hover:text-green-600"
          >
            월세
          </Link>
        </nav>
      </div>
    </header>
  );
}
