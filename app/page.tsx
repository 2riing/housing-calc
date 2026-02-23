import Link from "next/link";
import PageShell from "@/components/PageShell";

const cards = [
  {
    href: "/buy",
    title: "집을 살 수 있을까?",
    desc: "월급, 저축, 대출 한도 — 현실적인 매수 가능 금액을 알려드립니다. 희망은 자유지만 통장은 정직하니까요.",
  },
  {
    href: "/rent",
    title: "전세를 얻을 수 있을까?",
    desc: "버팀목, 디딤돌... 이름은 들어봤는데 나는 되는 건지? 소득, 자산, 무주택 여부만 넣으면 자격부터 한도까지.",
  },
  {
    href: "/tax",
    title: "집 팔면 남는 돈?",
    desc: "팔면 얼마 남을까 — 양도세, 중개비 다 빼고 진짜 내 손에 들어오는 금액을 알려드립니다.",
  },
];

export default function Home() {
  return (
    <PageShell>
      <div className="grid gap-3">
        {cards.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group rounded-2xl border border-stone-200 bg-white p-5 transition-all hover:border-sky-300 hover:shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-bold text-stone-800">{c.title}</h2>
                <p className="mt-1.5 text-sm leading-relaxed text-stone-400">
                  {c.desc}
                </p>
              </div>
              <span className="mt-0.5 text-stone-300 transition-transform group-hover:translate-x-1 group-hover:text-sky-400">
                →
              </span>
            </div>
          </Link>
        ))}
      </div>

      <p className="mt-10 text-center text-xs leading-relaxed text-stone-300">
        모든 계산은 공식 자료 기반이지만 참고용입니다.
        <br />
        실제 대출·세금은 금융기관과 세무사에게 확인하세요.
      </p>
    </PageShell>
  );
}
