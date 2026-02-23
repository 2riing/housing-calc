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
          className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-[11px] text-muted-foreground transition hover:bg-primary/10 hover:text-primary"
        >
          📎 {s.title}
        </a>
      ))}
    </div>
  );
}
