"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageShell from "@/components/PageShell";
import ResultCard from "@/components/ResultCard";
import FormField from "@/components/FormField";
import Collapsible from "@/components/Collapsible";
import Disclaimer from "@/components/Disclaimer";
import SourceBadge from "@/components/SourceBadge";
import { Input } from "@/components/ui/input";
import { calculateCapitalGainsTax } from "@/lib/calc-tax";
import { getSources, getTaxRules, findSourcesByIds } from "@/lib/data";
import type { Source, TaxRulesData } from "@/lib/types";
import { manwonToWon, formatKRW, formatPercent } from "@/lib/format";

interface FormValues {
  acquisitionPrice: number;
  salePrice: number;
  expenses: number;
}

export default function TaxPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [rules, setRules] = useState<TaxRulesData | null>(null);

  useEffect(() => {
    getTaxRules().then((r) => {
      setRules(r);
      getSources().then((d) =>
        setSources(findSourcesByIds(d.sources, r.capitalGainsSimple.sourceIds))
      );
    });
  }, []);

  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      acquisitionPrice: 30000,
      salePrice: 50000,
      expenses: 500,
    },
  });

  const v = watch();

  const result = useMemo(() => {
    if (!rules) return null;
    return calculateCapitalGainsTax(
      {
        acquisitionPrice: manwonToWon(Number(v.acquisitionPrice) || 0),
        salePrice: manwonToWon(Number(v.salePrice) || 0),
        expenses: manwonToWon(Number(v.expenses) || 0),
      },
      rules.capitalGainsSimple
    );
  }, [v, rules]);

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">💸 집 팔면 남는 돈?</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        양도세, 중개비 다 빼고 진짜 손에 쥐는 금액
      </p>

      {/* ── 입력 ── */}
      <div className="grid grid-cols-3 gap-x-6 gap-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <FormField label="🏷️ 취득가" htmlFor="acquisitionPrice" suffix="만원">
          <Input id="acquisitionPrice" type="number" variant="ghost" className="text-right tabular-nums" {...register("acquisitionPrice", { valueAsNumber: true })} />
        </FormField>
        <FormField label="💴 양도가" htmlFor="salePrice" suffix="만원">
          <Input id="salePrice" type="number" variant="ghost" className="text-right tabular-nums" {...register("salePrice", { valueAsNumber: true })} />
        </FormField>
        <FormField label="🧾 필요경비" htmlFor="expenses" suffix="만원">
          <Input id="expenses" type="number" variant="ghost" className="text-right tabular-nums" {...register("expenses", { valueAsNumber: true })} />
        </FormField>
      </div>

      {/* ── 결과 ── */}
      {result && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            📋 계산 결과
          </h2>

          {result.gain <= 0 ? (
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 p-6 text-center">
              <p className="text-3xl">🎉</p>
              <p className="mt-2 font-semibold text-emerald-700">
                양도차익이 없어요!
              </p>
              <p className="mt-1 text-sm text-emerald-500">
                과세 대상이 아닙니다
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard emoji="📈" title="양도차익" value={result.gain} />
                <ResultCard
                  emoji="📐"
                  title="과세표준"
                  value={result.taxableGain}
                  description="기본공제 250만원 적용"
                />
                <ResultCard
                  emoji="🏛️"
                  title="산출세액"
                  value={result.taxAmount}
                  description={`세율 ${formatPercent(result.appliedBracket.rate, 0)}`}
                />
                <ResultCard
                  emoji="💳"
                  title="총 납부세액"
                  value={result.totalTax}
                  description={`실효세율 ${formatPercent(result.effectiveRate)}`}
                  highlight
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-[11px] text-muted-foreground">적용 세율</p>
                  <p className="text-lg font-bold">
                    {formatPercent(result.appliedBracket.rate, 0)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    누진공제 {formatKRW(result.appliedBracket.deduction)}
                  </p>
                </div>
                <div className="rounded-xl bg-muted px-4 py-3">
                  <p className="text-[11px] text-muted-foreground">지방소득세</p>
                  <p className="text-lg font-bold">
                    {formatKRW(result.localTax)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">산출세액의 10%</p>
                </div>
              </div>

              <Collapsible title="계산 과정 보기">
                <div className="space-y-2">
                  {result.steps.map((step, i) => (
                    <div
                      key={i}
                      className="flex items-baseline justify-between text-xs"
                    >
                      <span className="text-muted-foreground">{step.label}</span>
                      <span className="font-mono font-medium">
                        {formatKRW(step.value)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="mt-3 space-y-1 border-t border-border pt-3">
                  {result.steps
                    .filter((s) => s.formula)
                    .map((step, i) => (
                      <p key={i} className="text-[11px] text-muted-foreground">
                        {step.label}: {step.formula}
                      </p>
                    ))}
                </div>
              </Collapsible>
            </>
          )}

          <SourceBadge sources={sources} />

          <Disclaimer
            messages={[
              "기본세율만 적용한 단순 모델이에요.",
              "1세대1주택 비과세 · 장기보유특별공제 · 다주택 중과 등은 미반영.",
              "정확한 세금은 국세청 홈택스 또는 세무사에게 문의하세요.",
            ]}
          />
        </div>
      )}
    </PageShell>
  );
}
