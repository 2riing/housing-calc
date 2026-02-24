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
import { calculateCapitalGainsTax, calculateBrokerageFee } from "@/lib/calc-tax";
import { getSources, getTaxRules, findSourcesByIds } from "@/lib/data";
import type { Source, TaxRulesData } from "@/lib/types";
import { manwonToWon, formatKRW, formatPercent } from "@/lib/format";
import { cards } from "@/lib/cards";

interface FormValues {
  acquisitionPrice: number;
  salePrice: number;
  // 취득 시 비용
  acquisitionTax: number;
  acqBrokerageFee: number;
  legalFee: number;
  stampDutyBondCost: number;
  // 보유 시 비용
  renovationCost: number;
  capitalRepairs: number;
}

export default function TaxPage() {
  const [sources, setSources] = useState<Source[]>([]);
  const [rules, setRules] = useState<TaxRulesData | null>(null);

  useEffect(() => {
    getTaxRules().then((r) => {
      setRules(r);
      getSources().then((d) => {
        const allSourceIds = [
          ...r.capitalGainsSimple.sourceIds,
          ...r.brokerageFee.sourceIds,
        ];
        setSources(findSourcesByIds(d.sources, allSourceIds));
      });
    });
  }, []);

  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      acquisitionPrice: 30000,
      salePrice: 50000,
      acquisitionTax: 0,
      acqBrokerageFee: 0,
      legalFee: 0,
      stampDutyBondCost: 0,
      renovationCost: 0,
      capitalRepairs: 0,
    },
  });

  const v = watch();

  const acqSubtotal =
    (Number(v.acquisitionTax) || 0) +
    (Number(v.acqBrokerageFee) || 0) +
    (Number(v.legalFee) || 0) +
    (Number(v.stampDutyBondCost) || 0);

  const holdSubtotal =
    (Number(v.renovationCost) || 0) +
    (Number(v.capitalRepairs) || 0);

  const totalExpenses = acqSubtotal + holdSubtotal;

  const salePriceWon = manwonToWon(Number(v.salePrice) || 0);

  const brokerageResult = useMemo(() => {
    if (!rules) return null;
    return calculateBrokerageFee(salePriceWon, rules.brokerageFee.tiers);
  }, [salePriceWon, rules]);

  const result = useMemo(() => {
    if (!rules) return null;
    const saleBrokerageFee = brokerageResult?.fee ?? 0;
    return calculateCapitalGainsTax(
      {
        acquisitionPrice: manwonToWon(Number(v.acquisitionPrice) || 0),
        salePrice: salePriceWon,
        expenses: manwonToWon(totalExpenses) + saleBrokerageFee,
      },
      rules.capitalGainsSimple
    );
  }, [v.acquisitionPrice, salePriceWon, totalExpenses, rules, brokerageResult]);

  const netProceeds = useMemo(() => {
    if (!result || !brokerageResult) return null;
    return salePriceWon - result.totalTax - brokerageResult.fee;
  }, [salePriceWon, result, brokerageResult]);

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">{cards.find((c) => c.href === "/tax")!.title}</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        {cards.find((c) => c.href === "/tax")!.subtitle}
      </p>

      {/* ── 양도 정보 ── */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <FormField label="취득가" htmlFor="acquisitionPrice" suffix="만원">
          <Input id="acquisitionPrice" type="number" variant="ghost" className="text-right tabular-nums" {...register("acquisitionPrice", { valueAsNumber: true })} />
        </FormField>
        <FormField label="양도가" htmlFor="salePrice" suffix="만원">
          <Input id="salePrice" type="number" variant="ghost" className="text-right tabular-nums" {...register("salePrice", { valueAsNumber: true })} />
        </FormField>
      </div>

      {/* ── 필요경비 ── */}
      <div className="mt-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">필요경비</h2>
          <span className="text-sm font-semibold tabular-nums">
            합계 {totalExpenses.toLocaleString()}만원{brokerageResult ? ` + 중개수수료(양도) ${formatKRW(brokerageResult.fee)}` : ""}
          </span>
        </div>

        {/* 취득 시 비용 */}
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">취득 시 비용</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <FormField label="취득세" htmlFor="acquisitionTax" suffix="만원">
            <Input id="acquisitionTax" type="number" variant="ghost" className="text-right tabular-nums" {...register("acquisitionTax", { valueAsNumber: true })} />
          </FormField>
          <FormField label="중개수수료(취득)" htmlFor="acqBrokerageFee" suffix="만원">
            <Input id="acqBrokerageFee" type="number" variant="ghost" className="text-right tabular-nums" {...register("acqBrokerageFee", { valueAsNumber: true })} />
          </FormField>
          <FormField label="법무사비" htmlFor="legalFee" suffix="만원">
            <Input id="legalFee" type="number" variant="ghost" className="text-right tabular-nums" {...register("legalFee", { valueAsNumber: true })} />
          </FormField>
          <FormField label="인지세/채권비용" htmlFor="stampDutyBondCost" suffix="만원">
            <Input id="stampDutyBondCost" type="number" variant="ghost" className="text-right tabular-nums" {...register("stampDutyBondCost", { valueAsNumber: true })} />
          </FormField>
        </div>
        <p className="mt-2 text-right text-[11px] text-muted-foreground tabular-nums">
          소계 {acqSubtotal.toLocaleString()}만원
        </p>

        {/* 구분선 */}
        <div className="my-4 border-t border-border" />

        {/* 보유 시 비용 */}
        <p className="mb-2 text-[11px] font-medium text-muted-foreground">보유 시 비용 (자본적 지출)</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-3">
          <FormField label="인테리어/확장 공사" htmlFor="renovationCost" suffix="만원">
            <Input id="renovationCost" type="number" variant="ghost" className="text-right tabular-nums" {...register("renovationCost", { valueAsNumber: true })} />
          </FormField>
          <FormField label="수선비(자본적)" htmlFor="capitalRepairs" suffix="만원">
            <Input id="capitalRepairs" type="number" variant="ghost" className="text-right tabular-nums" {...register("capitalRepairs", { valueAsNumber: true })} />
          </FormField>
        </div>
        <p className="mt-2 text-right text-[11px] text-muted-foreground tabular-nums">
          소계 {holdSubtotal.toLocaleString()}만원
        </p>
      </div>

      {/* ── 결과 ── */}
      {result && brokerageResult && netProceeds !== null && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
            📋 계산 결과
          </h2>

          {/* ── 실수령액 하이라이트 배너 ── */}
          <div className="mb-4 rounded-2xl bg-primary/5 p-5">
            <p className="text-xs font-medium text-primary">
              실수령액
            </p>
            <p className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">
              {formatKRW(netProceeds)}
            </p>
            <p className="mt-2 text-[11px] text-primary/80">
              양도가 {formatKRW(salePriceWon)} - 양도세 {formatKRW(result.totalTax)} - 중개수수료 {formatKRW(brokerageResult.fee)}
            </p>
          </div>

          {result.gain <= 0 ? (
            <div className="rounded-2xl bg-primary/5 p-6 text-center">
              <p className="text-3xl">🎉</p>
              <p className="mt-2 font-semibold text-primary">
                양도차익이 없어요!
              </p>
              <p className="mt-1 text-sm text-primary/70">
                양도소득세는 없지만 중개수수료는 발생해요
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
            </>
          )}

          {/* ── 중개수수료 카드 ── */}
          <div className="mt-3">
            <ResultCard
              emoji="🏠"
              title="중개수수료"
              value={brokerageResult.fee}
              description={`적용요율 ${formatPercent(brokerageResult.rate)}${brokerageResult.cap ? ` · 한도 ${formatKRW(brokerageResult.cap)}` : ""}`}
            />
          </div>

          {/* ── 비용 총정리 ── */}
          <Collapsible title="비용 총정리">
            <div className="space-y-2">
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">양도가</span>
                <span className="font-mono font-medium">{formatKRW(salePriceWon)}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">(-) 양도소득세</span>
                <span className="font-mono font-medium text-destructive">{formatKRW(result.totalTax)}</span>
              </div>
              <div className="flex items-baseline justify-between text-xs">
                <span className="text-muted-foreground">(-) 중개수수료</span>
                <span className="font-mono font-medium text-destructive">{formatKRW(brokerageResult.fee)}</span>
              </div>

              {/* 필요경비 내역 */}
              {(totalExpenses > 0 || brokerageResult.fee > 0) && (
                <>
                  <div className="border-t border-border pt-2" />
                  <p className="text-[11px] font-medium text-muted-foreground">필요경비 내역</p>
                  {(Number(v.acquisitionTax) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">취득세</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.acquisitionTax) || 0))}</span>
                    </div>
                  )}
                  {(Number(v.acqBrokerageFee) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">중개수수료(취득)</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.acqBrokerageFee) || 0))}</span>
                    </div>
                  )}
                  {(Number(v.legalFee) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">법무사비</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.legalFee) || 0))}</span>
                    </div>
                  )}
                  {(Number(v.stampDutyBondCost) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">인지세/채권비용</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.stampDutyBondCost) || 0))}</span>
                    </div>
                  )}
                  {(Number(v.renovationCost) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">인테리어/확장 공사</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.renovationCost) || 0))}</span>
                    </div>
                  )}
                  {(Number(v.capitalRepairs) || 0) > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">수선비(자본적)</span>
                      <span className="font-mono font-medium">{formatKRW(manwonToWon(Number(v.capitalRepairs) || 0))}</span>
                    </div>
                  )}
                  {brokerageResult.fee > 0 && (
                    <div className="flex items-baseline justify-between text-xs pl-2">
                      <span className="text-muted-foreground">중개수수료(양도)</span>
                      <span className="font-mono font-medium">{formatKRW(brokerageResult.fee)}</span>
                    </div>
                  )}
                  <div className="flex items-baseline justify-between text-xs pl-2 font-medium">
                    <span className="text-muted-foreground">필요경비 합계</span>
                    <span className="font-mono">{formatKRW(manwonToWon(totalExpenses) + brokerageResult.fee)}</span>
                  </div>
                </>
              )}

              <div className="border-t border-border pt-2 flex items-baseline justify-between text-sm font-semibold">
                <span>= 실수령액</span>
                <span className="font-mono">{formatKRW(netProceeds)}</span>
              </div>
            </div>
          </Collapsible>

          {/* ── 계산 과정 (양도세) ── */}
          {result.gain > 0 && (
            <Collapsible title="양도세 계산 과정 보기">
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
          )}

          <SourceBadge sources={sources} />

          <Disclaimer
            messages={[
              "기본세율만 적용한 단순 모델이에요.",
              "1세대1주택 비과세 · 장기보유특별공제 · 다주택 중과 등은 미반영.",
              "중개수수료는 상한 요율 기준이며, 실제 수수료는 중개사와 협의 가능해요.",
              "정확한 세금은 국세청 홈택스 또는 세무사에게 문의하세요.",
            ]}
          />
        </div>
      )}
    </PageShell>
  );
}
