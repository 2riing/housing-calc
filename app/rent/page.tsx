"use client";

import { useMemo, useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { useSharedFields } from "@/lib/useSharedFields";
import PageShell from "@/components/PageShell";
import ResultCard from "@/components/ResultCard";
import FormField from "@/components/FormField";
import Collapsible from "@/components/Collapsible";
import Disclaimer from "@/components/Disclaimer";
import SourceBadge from "@/components/SourceBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { ToggleSwitch } from "@/components/ui/toggle-switch";
import { evaluateRentProduct } from "@/lib/calc-rent";
import { getSources, getLoanProducts, findSourcesByIds } from "@/lib/data";
import type { RentProductResult, Source, LoanProduct } from "@/lib/types";
import { manwonToWon, formatKRW } from "@/lib/format";

interface FormValues {
  deposit: number;
  regionType: string;
  annualIncome: number;
  totalAsset: number;
  isHomeless: boolean;
  tag: string;
  age: number;
  marriageYears: number;
}

export default function RentPage() {
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const { shared, save } = useSharedFields();

  useEffect(() => {
    getSources().then((d) => setAllSources(d.sources));
    getLoanProducts().then((d) =>
      setProducts(d.products.filter((p) => p.type === "lease"))
    );
  }, []);

  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      deposit: 20000,
      regionType: shared.regionType,
      annualIncome: shared.annualIncome,
      totalAsset: shared.totalAsset,
      isHomeless: true,
      tag: shared.tag,
      age: 30,
      marriageYears: 0,
    },
  });

  const v = watch();

  // 공유 필드 변경 시 localStorage에 저장
  const prevSharedRef = useRef({ annualIncome: v.annualIncome, totalAsset: v.totalAsset, regionType: v.regionType, tag: v.tag });
  useEffect(() => {
    const next = { annualIncome: v.annualIncome, totalAsset: v.totalAsset, regionType: v.regionType, tag: v.tag };
    const prev = prevSharedRef.current;
    if (prev.annualIncome !== next.annualIncome || prev.totalAsset !== next.totalAsset || prev.regionType !== next.regionType || prev.tag !== next.tag) {
      prevSharedRef.current = next;
      save(next);
    }
  }, [v.annualIncome, v.totalAsset, v.regionType, v.tag, save]);

  const results = useMemo(() => {
    if (products.length === 0) return [];
    return products.map((p) =>
      evaluateRentProduct(
        {
          deposit: manwonToWon(Number(v.deposit) || 0),
          region: v.regionType === "non_metro" ? "non_metro" : "metro",
          annualIncome: manwonToWon(Number(v.annualIncome) || 0),
          totalAsset: manwonToWon(Number(v.totalAsset) || 0),
          isHomeless: v.isHomeless,
          tag: v.tag,
          age: Number(v.age) || undefined,
          marriageYears: Number(v.marriageYears) || undefined,
        },
        p
      )
    );
  }, [v, products]);

  const eligible = results.filter((r) => r.eligible);
  const ineligible = results.filter((r) => !r.eligible);

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">전세사기는 무섭지만 전세는 살고 싶어</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        전세보증금 대출 자격과 예상 한도를 확인해요
      </p>

      {/* ── 기본 정보 ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-muted-foreground">자산 · 소득</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="전세보증금" htmlFor="deposit" suffix="만원">
            <Input id="deposit" type="number" variant="ghost" className="text-right tabular-nums" {...register("deposit", { valueAsNumber: true })} />
          </FormField>
          <FormField label="연 소득" htmlFor="annualIncome" suffix="만원">
            <Input id="annualIncome" type="number" variant="ghost" className="text-right tabular-nums" {...register("annualIncome", { valueAsNumber: true })} />
          </FormField>
          <FormField label="총 자산" htmlFor="totalAsset" suffix="만원">
            <Input id="totalAsset" type="number" variant="ghost" className="text-right tabular-nums" {...register("totalAsset", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 조건 ── */}
      <div className="mt-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-muted-foreground">내 조건</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="지역" htmlFor="regionType">
            <div className="flex w-full gap-1 px-1.5 py-1.5">
              {[
                { value: "regulated", label: "조정대상" },
                { value: "metro", label: "비조정 수도권" },
                { value: "non_metro", label: "비수도권" },
              ].map((r) => (
                <label key={r.value} className="flex-1">
                  <input type="radio" value={r.value} className="peer sr-only" {...register("regionType")} />
                  <span className="flex cursor-pointer items-center justify-center rounded-lg py-1.5 text-xs font-medium text-muted-foreground transition-all peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm">
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
          <FormField label="나이" htmlFor="age" suffix="세">
            <Input id="age" type="number" variant="ghost" className="text-right tabular-nums" {...register("age", { valueAsNumber: true })} />
          </FormField>
          <FormField label="가구 특성" htmlFor="tag">
            <Select value={v.tag} onValueChange={(val) => setValue("tag", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반</SelectItem>
                <SelectItem value="youth">청년 (만 19~34세)</SelectItem>
                <SelectItem value="newlywed">신혼부부</SelectItem>
                <SelectItem value="multi_child_2">2자녀</SelectItem>
                <SelectItem value="multi_child_3">3자녀 이상</SelectItem>
                <SelectItem value="single_parent">한부모</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="무주택 여부" htmlFor="isHomeless">
            <ToggleSwitch id="isHomeless" label="무주택자" {...register("isHomeless")} />
          </FormField>
          <FormField label="혼인 기간" htmlFor="marriageYears" suffix="년차">
            <Input id="marriageYears" type="number" variant="ghost" className="text-right tabular-nums" {...register("marriageYears", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 결과 ── */}
      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* 자격 충족 상품 */}
          {eligible.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                ✅ 자격 충족 상품 ({eligible.length}개)
              </h2>
              <div className="space-y-3">
                {eligible.map((r) => {
                  const ps = findSourcesByIds(allSources, r.product.sourceIds);
                  return (
                    <div
                      key={r.product.id}
                      className="rounded-2xl border border-primary/20 bg-primary/5 p-5"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-lg">✅</span>
                        <h3 className="font-semibold">{r.product.name}</h3>
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-3">
                        <ResultCard emoji="🏧" title="예상 최대 대출" value={r.maxLoanAmount} />
                        <ResultCard emoji="💰" title="필요 자기자금" value={r.requiredCash} highlight />
                      </div>
                      {r.product.interestRange && (
                        <p className="mt-3 text-xs text-muted-foreground">
                          📊 금리 {r.product.interestRange.min}% ~ {r.product.interestRange.max}%
                        </p>
                      )}
                      <Collapsible title="상세 내역">
                        <ul className="space-y-1 text-xs text-muted-foreground">
                          {r.reasons.map((reason, i) => (<li key={i}>· {reason}</li>))}
                          {r.product.notes.map((note, i) => (<li key={`n-${i}`} className="text-amber-500">⚠️ {note}</li>))}
                        </ul>
                      </Collapsible>
                      <SourceBadge sources={ps} />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 자격 미충족 */}
          {ineligible.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
                ❌ 미충족 상품 ({ineligible.length}개)
              </h2>
              <div className="space-y-2">
                {ineligible.map((r) => (
                  <div key={r.product.id} className="rounded-xl border border-border bg-muted/30 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground/50">❌</span>
                      <span className="text-sm font-medium text-muted-foreground">{r.product.name}</span>
                    </div>
                    <Collapsible title="미충족 사유">
                      <ul className="space-y-1 text-xs text-muted-foreground">
                        {r.reasons.map((reason, i) => (<li key={i}>· {reason}</li>))}
                      </ul>
                    </Collapsible>
                  </div>
                ))}
              </div>
            </div>
          )}

          <Disclaimer
            messages={[
              "대출 자격·한도는 금융기관 실제 심사 기준에 따라 달라요.",
              "소득·자산 기준은 가구원 수·세부 조건에 따라 상이해요.",
              "청년 전용 상품은 만 19~34세, 신혼부부는 혼인 7년 이내 기준이에요.",
            ]}
          />
        </div>
      )}
    </PageShell>
  );
}
