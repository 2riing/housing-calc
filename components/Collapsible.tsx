"use client";

import { useState } from "react";

interface Props {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Collapsible({
  title,
  children,
  defaultOpen = false,
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="mt-3 overflow-hidden rounded-xl border border-gray-100">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-4 py-2.5 text-xs text-gray-400 transition hover:bg-gray-50"
      >
        <span>🔍 {title}</span>
        <span
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-gray-50 px-4 py-3">{children}</div>
      )}
    </div>
  );
}
