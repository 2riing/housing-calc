"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageShell from "@/components/PageShell";
import ResultCard from "@/components/ResultCard";
import FormField from "@/components/FormField";
import Collapsible from "@/components/Collapsible";
import Disclaimer from "@/components/Disclaimer";
import SourceBadge from "@/components/SourceBadge";
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

  useEffect(() => {
    getSources().then((d) => setAllSources(d.sources));
    getLoanProducts().then((d) =>
      setProducts(d.products.filter((p) => p.type === "lease"))
    );
  }, []);

  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      deposit: 20000,
      regionType: "metro",
      annualIncome: 4000,
      totalAsset: 20000,
      isHomeless: true,
      tag: "general",
      age: 30,
      marriageYears: 0,
    },
  });

  const v = watch();

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
        },
        p
      )
    );
  }, [v, products]);

  const eligible = results.filter((r) => r.eligible);
  const ineligible = results.filter((r) => !r.eligible);

  const ic =
    "w-full bg-transparent py-2 pl-3 pr-2 text-right text-sm tabular-nums outline-none";
  const sc =
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-3 pr-2 text-sm outline-none transition focus:border-green-400 focus:bg-white focus:ring-2 focus:ring-green-100";

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">🔑 전세를 얻을 수 있을까?</h1>
      <p className="mb-6 text-sm text-gray-400">
        전세보증금 대출 자격과 예상 한도를 확인해요
      </p>

      {/* ── 기본 정보 ── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-gray-400">💰 자산 · 소득</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="전세보증금" htmlFor="deposit" suffix="만원">
            <input id="deposit" type="number" className={ic} {...register("deposit", { valueAsNumber: true })} />
          </FormField>
          <FormField label="연 소득" htmlFor="annualIncome" suffix="만원">
            <input id="annualIncome" type="number" className={ic} {...register("annualIncome", { valueAsNumber: true })} />
          </FormField>
          <FormField label="총 자산" htmlFor="totalAsset" suffix="만원">
            <input id="totalAsset" type="number" className={ic} {...register("totalAsset", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 조건 ── */}
      <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-gray-400">🏷️ 내 조건</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="지역" htmlFor="regionType">
            <select id="regionType" className={sc} {...register("regionType")}>
              <option value="regulated">조정대상지역</option>
              <option value="metro">비조정 수도권</option>
              <option value="non_metro">비수도권</option>
            </select>
          </FormField>
          <FormField label="나이" htmlFor="age" suffix="세">
            <input id="age" type="number" className={ic} {...register("age", { valueAsNumber: true })} />
          </FormField>
          <FormField label="가구 특성" htmlFor="tag">
            <select id="tag" className={sc} {...register("tag")}>
              <option value="general">일반</option>
              <option value="youth">🧑 청년 (만 19~34세)</option>
              <option value="newlywed">🤵 신혼부부</option>
              <option value="multi_child_2">👶👶 2자녀</option>
              <option value="multi_child_3">👶👶👶 3자녀 이상</option>
              <option value="single_parent">👨‍👧 한부모</option>
            </select>
          </FormField>
          <FormField label="무주택 여부" htmlFor="isHomeless">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input id="isHomeless" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-green-500 focus:ring-green-400" {...register("isHomeless")} />
              <span className="text-gray-600">무주택자</span>
            </label>
          </FormField>
          <FormField label="혼인 기간" htmlFor="marriageYears" suffix="년차">
            <input id="marriageYears" type="number" className={ic} {...register("marriageYears", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 결과 ── */}
      {results.length > 0 && (
        <div className="mt-8 space-y-6">
          {/* 자격 충족 상품 */}
          {eligible.length > 0 && (
            <div>
              <h2 className="mb-3 text-sm font-semibold text-gray-500">
                ✅ 자격 충족 상품 ({eligible.length}개)
              </h2>
              <div className="space-y-3">
                {eligible.map((r) => {
                  const ps = findSourcesByIds(allSources, r.product.sourceIds);
                  return (
                    <div
                      key={r.product.id}
                      className="rounded-2xl border border-green-100 bg-gradient-to-br from-green-50/60 to-emerald-50/60 p-5"
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
                        <p className="mt-3 text-xs text-gray-400">
                          📊 금리 {r.product.interestRange.min}% ~ {r.product.interestRange.max}%
                        </p>
                      )}
                      <Collapsible title="상세 내역">
                        <ul className="space-y-1 text-xs text-gray-500">
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
              <h2 className="mb-3 text-sm font-semibold text-gray-500">
                ❌ 미충족 상품 ({ineligible.length}개)
              </h2>
              <div className="space-y-2">
                {ineligible.map((r) => (
                  <div key={r.product.id} className="rounded-xl border border-gray-100 bg-gray-50/30 px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-300">❌</span>
                      <span className="text-sm font-medium text-gray-400">{r.product.name}</span>
                    </div>
                    <Collapsible title="미충족 사유">
                      <ul className="space-y-1 text-xs text-gray-400">
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
