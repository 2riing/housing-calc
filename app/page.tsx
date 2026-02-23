import Link from "next/link";
import PageShell from "@/components/PageShell";
import { cards } from "@/lib/cards";

export default function Home() {
  return (
    <PageShell>
      <div className="grid gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-foreground">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {c.subtitle}
                </p>
              </div>
              <span className="mt-0.5 text-muted-foreground/40 transition-transform group-hover:translate-x-1 group-hover:text-primary">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground/50">
        모든 계산은 공식 자료 기반이지만 참고용입니다.
        <br />
        실제 대출·세금은 금융기관과 세무사에게 확인하세요.
      </p>
    </PageShell>
  );
}
