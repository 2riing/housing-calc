"use client";

import { useState, useEffect } from "react";
import PageShell from "@/components/PageShell";
import { getSources, getLastUpdated } from "@/lib/data";
import type { Source, LastUpdated } from "@/lib/types";

export default function SourcesPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [updated, setUpdated] = useState<LastUpdated | null>(null);

  useEffect(() => {
    getSources().then((d) => setSources(d.sources));
    getLastUpdated().then(setUpdated);
  }, []);

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">📎 근거 자료 모음</h1>
      <p className="mb-6 text-sm text-gray-400">
        {updated
          ? `📅 데이터 기준일: ${updated.updatedAt}`
          : "불러오는 중..."}
      </p>

      <div className="space-y-2">
        {sources.map((s) => (
          <a
            key={s.id}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-white px-4 py-3.5 transition hover:border-blue-200 hover:shadow-sm"
          >
            <span className="text-lg">🔗</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-medium text-gray-800">
                {s.title}
              </h2>
              <p className="mt-0.5 text-[11px] text-gray-400">
                {s.publisher} · 확인일 {s.checkedAt}
              </p>
            </div>
            <span className="shrink-0 text-sm text-gray-300">↗</span>
          </a>
        ))}
      </div>

      {sources.length === 0 && (
        <p className="py-16 text-center text-gray-300">
          ⏳ 근거 자료를 불러오는 중...
        </p>
      )}
    </PageShell>
  );
}
