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
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-2xl items-center justify-center px-4 py-3">
        <Link href="/" className="text-base font-bold text-stone-800">
          내집내놔
        </Link>
      </div>
    </header>
  );
}
