import { formatKRW } from "@/lib/format";

interface Props {
  emoji?: string;
  title: string;
  value: number;
  description?: string;
  highlight?: boolean;
}

export default function ResultCard({
  emoji,
  title,
  value,
  description,
  highlight,
}: Props) {
  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${
        highlight
          ? "border-primary/20 bg-primary/5 shadow-sm"
          : "border-border bg-card"
      }`}
    >
      <div className="flex items-center gap-2">
        {emoji && <span className="text-lg">{emoji}</span>}
        <p className="text-xs text-muted-foreground">{title}</p>
      </div>
      <p className="mt-1.5 text-xl font-bold tracking-tight text-foreground">{formatKRW(value)}</p>
      {description && (
        <p className="mt-0.5 text-[11px] text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
