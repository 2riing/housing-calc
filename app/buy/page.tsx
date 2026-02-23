"use client";

import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PageShell from "@/components/PageShell";
import ResultCard from "@/components/ResultCard";
import FormField from "@/components/FormField";
import Collapsible from "@/components/Collapsible";
import Disclaimer from "@/components/Disclaimer";
import SourceBadge from "@/components/SourceBadge";
import { calculateBuy } from "@/lib/calc-buy";
import { evaluateRentProduct } from "@/lib/calc-rent";
import { calcLtv } from "@/lib/calc-ltv";
import {
  getSources,
  getLoanProducts,
  getLtvRules,
  findSourcesByIds,
} from "@/lib/data";
import type {
  Source,
  LoanProduct,
  LtvRulesData,
  LtvRegionType,
} from "@/lib/types";
import { manwonToWon, formatKRW, formatPercent } from "@/lib/format";

interface FormValues {
  cash: number;
  monthlySaving: number;
  targetYears: number;
  annualIncome: number;
  monthlyDebtPayment: number;
  regionType: string;
  housingCount: number;
  isFirstTime: boolean;
  tag: string;
  totalAsset: number;
}

export default function BuyPage() {
  const [allSources, setAllSources] = useState<Source[]>([]);
  const [products, setProducts] = useState<LoanProduct[]>([]);
  const [ltvData, setLtvData] = useState<LtvRulesData | null>(null);
  const [regionTypes, setRegionTypes] = useState<LtvRegionType[]>([]);

  useEffect(() => {
    getSources().then((d) => setAllSources(d.sources));
    getLoanProducts().then((d) =>
      setProducts(d.products.filter((p) => p.type === "purchase"))
    );
    getLtvRules().then((d) => {
      setLtvData(d);
      setRegionTypes(d.regionTypes);
    });
  }, []);

  const { register, watch } = useForm<FormValues>({
    defaultValues: {
      cash: 5000,
      monthlySaving: 200,
      targetYears: 5,
      annualIncome: 5000,
      monthlyDebtPayment: 0,
      regionType: "metro",
      housingCount: 0,
      isFirstTime: false,
      tag: "general",
      totalAsset: 30000,
    },
  });

  const v = watch();

  // LTV 자동 계산
  const ltvResult = useMemo(() => {
    if (!ltvData) return { ltv: 0.7, note: "데이터 로딩 중..." };
    return calcLtv(
      {
        regionType: v.regionType,
        housingCount: Number(v.housingCount),
        isFirstTime: v.isFirstTime,
      },
      ltvData.rules
    );
  }, [v.regionType, v.housingCount, v.isFirstTime, ltvData]);

  // 전세용 region 매핑 (regulated → metro로 간주)
  const loanRegion = v.regionType === "non_metro" ? "non_metro" : "metro";

  // 기본 매수 가능가 계산
  const result = useMemo(() => {
    return calculateBuy({
      cash: manwonToWon(Number(v.cash) || 0),
      monthlySaving: manwonToWon(Number(v.monthlySaving) || 0),
      targetYears: Number(v.targetYears) || 1,
      annualIncome: manwonToWon(Number(v.annualIncome) || 0),
      monthlyDebtPayment: manwonToWon(Number(v.monthlyDebtPayment) || 0),
      ltvRatio: ltvResult.ltv,
    });
  }, [v.cash, v.monthlySaving, v.targetYears, v.annualIncome, v.monthlyDebtPayment, ltvResult.ltv]);

  // 정책상품 매칭
  const productResults = useMemo(() => {
    if (products.length === 0) return [];
    const effectiveTag = v.isFirstTime ? "first_time" : v.tag;
    return products.map((p) =>
      evaluateRentProduct(
        {
          deposit: 0,
          region: loanRegion,
          annualIncome: manwonToWon(Number(v.annualIncome) || 0),
          totalAsset: manwonToWon(Number(v.totalAsset) || 0),
          isHomeless: Number(v.housingCount) === 0,
          tag: effectiveTag,
        },
        p
      )
    );
  }, [v.annualIncome, v.totalAsset, v.housingCount, v.isFirstTime, v.tag, loanRegion, products]);

  // suffix 있는 input: border는 FormField 래퍼가 담당
  const ic =
    "w-full bg-transparent py-2 pl-3 pr-2 text-right text-sm tabular-nums outline-none";
  // suffix 없는 select/checkbox: 자체 border
  const sc =
    "w-full rounded-lg border border-gray-200 bg-gray-50/50 py-2 pl-3 pr-2 text-sm outline-none transition focus:border-blue-400 focus:bg-white focus:ring-2 focus:ring-blue-100";

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">🏡 내가 집을 살 수 있을까?</h1>
      <p className="mb-6 text-sm text-gray-400">
        현재 자산과 소득으로 매수 가능한 가격을 추정해요
      </p>

      {/* ── 자산 · 소득 ── */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-gray-400">💰 자산 · 소득</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="보유 현금" htmlFor="cash" suffix="만원">
            <input id="cash" type="number" className={ic} {...register("cash", { valueAsNumber: true })} />
          </FormField>
          <FormField label="월 저축액" htmlFor="monthlySaving" suffix="만원">
            <input id="monthlySaving" type="number" className={ic} {...register("monthlySaving", { valueAsNumber: true })} />
          </FormField>
          <FormField label="목표 기간" htmlFor="targetYears" suffix="년">
            <input id="targetYears" type="number" className={ic} {...register("targetYears", { valueAsNumber: true })} />
          </FormField>
          <FormField label="연 소득" htmlFor="annualIncome" suffix="만원">
            <input id="annualIncome" type="number" className={ic} {...register("annualIncome", { valueAsNumber: true })} />
          </FormField>
          <FormField label="총 자산" htmlFor="totalAsset" suffix="만원">
            <input id="totalAsset" type="number" className={ic} {...register("totalAsset", { valueAsNumber: true })} />
          </FormField>
          <FormField label="월 부채상환" htmlFor="monthlyDebtPayment" suffix="만원">
            <input id="monthlyDebtPayment" type="number" className={ic} {...register("monthlyDebtPayment", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 내 조건 ── */}
      <div className="mt-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-gray-400">🏷️ 내 조건</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="지역" htmlFor="regionType">
            <select id="regionType" className={sc} {...register("regionType")}>
              {regionTypes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.label}
                </option>
              ))}
              {regionTypes.length === 0 && (
                <>
                  <option value="regulated">조정대상지역</option>
                  <option value="metro">비조정 수도권</option>
                  <option value="non_metro">비수도권</option>
                </>
              )}
            </select>
          </FormField>
          <FormField label="보유 주택 수" htmlFor="housingCount">
            <select id="housingCount" className={sc} {...register("housingCount", { valueAsNumber: true })}>
              <option value={0}>무주택</option>
              <option value={1}>1주택</option>
              <option value={2}>2주택 이상</option>
            </select>
          </FormField>
          <FormField label="가구 특성" htmlFor="tag">
            <select id="tag" className={sc} {...register("tag")}>
              <option value="general">일반</option>
              <option value="youth">🧑 청년 (만 19~39세)</option>
              <option value="newlywed">🤵 신혼부부</option>
              <option value="multi_child_2">👶👶 2자녀</option>
              <option value="multi_child_3">👶👶👶 3자녀 이상</option>
              <option value="single_parent">👨‍👧 한부모</option>
              <option value="newborn">🍼 신생아 (2년 내 출산)</option>
            </select>
          </FormField>
          <FormField label="생애최초" htmlFor="isFirstTime">
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input id="isFirstTime" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-blue-500" {...register("isFirstTime")} />
              <span className="text-gray-600">생애최초 구입</span>
            </label>
          </FormField>
        </div>
      </div>

      {/* ── LTV 자동 계산 결과 ── */}
      <div className={`mt-3 flex items-center justify-between rounded-2xl px-5 py-3 ${
        ltvResult.ltv > 0
          ? "border border-blue-100 bg-blue-50/50"
          : "border border-red-100 bg-red-50/50"
      }`}>
        <div>
          <p className="text-xs text-gray-500">📊 적용 LTV</p>
          <p className="text-lg font-bold">
            {ltvResult.ltv > 0
              ? formatPercent(ltvResult.ltv, 0)
              : "대출 불가"}
          </p>
        </div>
        <p className="text-xs text-gray-400">{ltvResult.note}</p>
      </div>

      {/* ── 기본 계산 결과 ── */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-gray-500">📋 매수 가능가 추정</h2>

        {ltvResult.ltv === 0 ? (
          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-6 text-center">
            <p className="text-2xl">🚫</p>
            <p className="mt-2 font-semibold text-red-600">주담대 원칙적 불가 조건</p>
            <p className="mt-1 text-sm text-red-400">
              현재 조건에서는 주택담보대출이 제한되어, 자기자금으로만 매수 가능해요.
            </p>
            <p className="mt-3 text-xl font-bold">{formatKRW(result.futureAsset)}</p>
            <p className="text-xs text-gray-400">{v.targetYears}년 후 예상 자기자금</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ResultCard emoji="🏦" title="예상 자산" value={result.futureAsset} description={`${v.targetYears}년 후 현금 + 저축`} />
            <ResultCard emoji="💸" title="월 상환 가능" value={result.maxMonthlyPayment} description="DSR 40% 기준" />
            <ResultCard emoji="🏧" title="추정 대출액" value={result.estimatedLoan} description={`30년 · 금리 4% · LTV ${formatPercent(ltvResult.ltv, 0)}`} />
            <ResultCard emoji="🏡" title="매수 가능가" value={result.estimatedPrice} description="자기자금 + 대출" highlight />
          </div>
        )}

        <Collapsible title="계산식 자세히 보기">
          <ul className="space-y-1 text-xs text-gray-500">
            <li>· 적용 LTV: {formatPercent(ltvResult.ltv, 0)} — {ltvResult.note}</li>
            {result.assumptions.map((a, i) => (
              <li key={i}>· {a}</li>
            ))}
          </ul>
        </Collapsible>
      </div>

      {/* ── 정책상품 매칭 ── */}
      {productResults.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-gray-500">🏛️ 정책 대출상품 매칭</h2>
          <div className="space-y-3">
            {productResults.map((r) => {
              const ps = findSourcesByIds(allSources, r.product.sourceIds);
              return (
                <div
                  key={r.product.id}
                  className={`rounded-2xl border p-4 ${
                    r.eligible
                      ? "border-blue-100 bg-blue-50/40"
                      : "border-gray-100 bg-gray-50/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{r.eligible ? "✅" : "❌"}</span>
                    <span className="text-sm font-semibold">{r.product.name}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      r.eligible ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-500"
                    }`}>
                      {r.eligible ? "자격 충족" : "미충족"}
                    </span>
                  </div>
                  {r.eligible && r.product.interestRange && (
                    <p className="mt-2 text-xs text-gray-400">
                      📊 금리 {r.product.interestRange.min}% ~ {r.product.interestRange.max}% · 최대 {formatKRW(r.maxLoanAmount)}
                    </p>
                  )}
                  <Collapsible title="상세">
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

      <SourceBadge sources={findSourcesByIds(allSources, ["fss_dsr", "gov_ltv"])} />
      <Disclaimer
        messages={[
          "LTV는 지역·주택수·생애최초 여부에 따라 자동 적용돼요.",
          "조정대상지역 목록은 정부 고시에 따라 수시 변경됩니다.",
          "DSR 40% · 금리 4% · 30년 원리금균등 기준 추정치예요.",
          "정확한 대출 심사는 해당 금융기관에 문의하세요.",
        ]}
      />
    </PageShell>
  );
}
