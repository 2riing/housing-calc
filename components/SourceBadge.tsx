import type { Source } from "@/lib/types";

interface Props {
  sources: Source[];
}

export default function SourceBadge({ sources }: Props) {
  if (sources.length === 0) return null;

  return (
    <div className="mt-3 flex flex-wrap gap-1.5">
      {sources.map((s) => (
        <a
          key={s.id}
          href={s.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-2.5 py-1 text-[11px] text-gray-400 transition hover:bg-blue-50 hover:text-blue-500"
        >
          📎 {s.title}
        </a>
      ))}
    </div>
  );
}
