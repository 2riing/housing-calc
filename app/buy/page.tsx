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
  const { shared, save } = useSharedFields();

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

  const { register, watch, setValue } = useForm<FormValues>({
    defaultValues: {
      cash: 5000,
      monthlySaving: 200,
      targetYears: 0,
      annualIncome: shared.annualIncome,
      monthlyDebtPayment: 0,
      regionType: shared.regionType,
      housingCount: 0,
      isFirstTime: false,
      tag: shared.tag,
      totalAsset: shared.totalAsset,
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

  // LTV 자동 계산
  const ltvResult = useMemo(() => {
    if (!ltvData) return { ltv: 0.7, note: "데이터 로딩 중..." };
    return calcLtv(
      {
        regionType: v.regionType,
        housingCount: Number(v.housingCount),
        isFirstTime: v.isFirstTime,
        tag: v.tag,
      },
      ltvData.rules
    );
  }, [v.regionType, v.housingCount, v.isFirstTime, v.tag, ltvData]);

  // 전세용 region 매핑 (regulated → metro로 간주)
  const loanRegion = v.regionType === "non_metro" ? "non_metro" : "metro";

  // 기본 매수 가능가 계산
  const result = useMemo(() => {
    return calculateBuy({
      cash: manwonToWon(Number(v.cash) || 0),
      monthlySaving: manwonToWon(Number(v.monthlySaving) || 0),
      targetYears: Number(v.targetYears) ?? 0,
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

  // 지역 옵션 (라디오 버튼용 짧은 라벨)
  const shortLabel: Record<string, string> = { regulated: "조정", metro: "비조정", non_metro: "비수도권" };
  const regionOptions = regionTypes.length > 0
    ? regionTypes.map((r) => ({ value: r.id, label: shortLabel[r.id] ?? r.label }))
    : [
        { value: "regulated", label: "조정" },
        { value: "metro", label: "비조정" },
        { value: "non_metro", label: "비수도권" },
      ];

  return (
    <PageShell>
      <h1 className="mb-1 text-xl font-bold">내가 집을 살 수 있을까?</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        현재 자산과 소득으로 매수 가능한 가격을 추정해요
      </p>

      {/* ── 자산 · 소득 ── */}
      <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-muted-foreground">자산 · 소득</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="보유 현금" htmlFor="cash" suffix="만원">
            <Input id="cash" type="number" variant="ghost" className="text-right tabular-nums" {...register("cash", { valueAsNumber: true })} />
          </FormField>
          <FormField label="월 저축액" htmlFor="monthlySaving" suffix="만원">
            <Input id="monthlySaving" type="number" variant="ghost" className="text-right tabular-nums" {...register("monthlySaving", { valueAsNumber: true })} />
          </FormField>
          <FormField label="목표 기간" htmlFor="targetYears">
            <div className="flex w-full gap-1 px-1.5 py-1.5">
              {[0, 1, 3, 5].map((y) => (
                <label key={y} className="flex-1">
                  <input type="radio" value={y} className="peer sr-only" {...register("targetYears", { valueAsNumber: true })} />
                  <span className="flex cursor-pointer items-center justify-center rounded-lg py-1.5 text-sm font-medium text-muted-foreground transition-all peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm">
                    {y === 0 ? "당장" : `${y}년`}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
          <FormField label="연 소득" htmlFor="annualIncome" suffix="만원">
            <Input id="annualIncome" type="number" variant="ghost" className="text-right tabular-nums" {...register("annualIncome", { valueAsNumber: true })} />
          </FormField>
          <FormField label="총 자산" htmlFor="totalAsset" suffix="만원">
            <Input id="totalAsset" type="number" variant="ghost" className="text-right tabular-nums" {...register("totalAsset", { valueAsNumber: true })} />
          </FormField>
          <FormField label="월 부채상환" htmlFor="monthlyDebtPayment" suffix="만원">
            <Input id="monthlyDebtPayment" type="number" variant="ghost" className="text-right tabular-nums" {...register("monthlyDebtPayment", { valueAsNumber: true })} />
          </FormField>
        </div>
      </div>

      {/* ── 내 조건 ── */}
      <div className="mt-3 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <p className="mb-4 text-xs font-semibold text-muted-foreground">내 조건</p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
          <FormField label="지역" htmlFor="regionType">
            <div className="flex w-full gap-1 px-1.5 py-1.5">
              {regionOptions.map((r) => (
                <label key={r.value} className="flex-1">
                  <input type="radio" value={r.value} className="peer sr-only" {...register("regionType")} />
                  <span className="flex cursor-pointer items-center justify-center rounded-lg py-1.5 text-xs font-medium text-muted-foreground transition-all peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm">
                    {r.label}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
          <FormField label="보유 주택 수" htmlFor="housingCount">
            <div className="flex w-full gap-1 px-1.5 py-1.5">
              {[
                { value: 0, label: "무주택" },
                { value: 1, label: "1주택" },
                { value: 2, label: "2주택+" },
              ].map((h) => (
                <label key={h.value} className="flex-1">
                  <input type="radio" value={h.value} className="peer sr-only" {...register("housingCount", { valueAsNumber: true })} />
                  <span className="flex cursor-pointer items-center justify-center rounded-lg py-1.5 text-sm font-medium text-muted-foreground transition-all peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm">
                    {h.label}
                  </span>
                </label>
              ))}
            </div>
          </FormField>
          <FormField label="가구 특성" htmlFor="tag">
            <Select value={v.tag} onValueChange={(val) => setValue("tag", val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">일반</SelectItem>
                <SelectItem value="youth">청년 (만 19~39세)</SelectItem>
                <SelectItem value="newlywed">신혼부부</SelectItem>
                <SelectItem value="multi_child_2">2자녀</SelectItem>
                <SelectItem value="multi_child_3">3자녀 이상</SelectItem>
                <SelectItem value="single_parent">한부모</SelectItem>
                <SelectItem value="newborn">신생아 (2년 내 출산)</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
          <FormField label="생애최초" htmlFor="isFirstTime">
            <ToggleSwitch id="isFirstTime" label="생애최초 구입" {...register("isFirstTime")} />
          </FormField>
        </div>
      </div>

      {/* ── LTV 자동 계산 결과 ── */}
      <div className={`mt-3 flex items-center justify-between rounded-2xl px-5 py-3 ${
        ltvResult.ltv > 0
          ? "border border-primary/20 bg-primary/5"
          : "border border-destructive/20 bg-destructive/5"
      }`}>
        <div>
          <p className="text-xs text-muted-foreground">📊 적용 LTV</p>
          <p className="text-lg font-bold">
            {ltvResult.ltv > 0
              ? formatPercent(ltvResult.ltv, 0)
              : "대출 불가"}
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{ltvResult.note}</p>
      </div>

      {/* ── 기본 계산 결과 ── */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">📋 매수 가능가 추정</h2>

        {ltvResult.ltv === 0 ? (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 text-center">
            <p className="text-2xl">🚫</p>
            <p className="mt-2 font-semibold text-destructive">주담대 원칙적 불가 조건</p>
            <p className="mt-1 text-sm text-destructive/70">
              현재 조건에서는 주택담보대출이 제한되어, 자기자금으로만 매수 가능해요.
            </p>
            <p className="mt-3 text-xl font-bold">{formatKRW(result.futureAsset)}</p>
            <p className="text-xs text-muted-foreground">{Number(v.targetYears) === 0 ? "현재 자기자금" : `${v.targetYears}년 후 예상 자기자금`}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            <ResultCard emoji="🏦" title="예상 자산" value={result.futureAsset} description={Number(v.targetYears) === 0 ? "현재 보유 현금" : `${v.targetYears}년 후 현금 + 저축`} />
            <ResultCard emoji="💸" title="월 상환 가능" value={result.maxMonthlyPayment} description="DSR 40% 기준" />
            <ResultCard emoji="🏧" title="추정 대출액" value={result.estimatedLoan} description={`30년 · 금리 4% · LTV ${formatPercent(ltvResult.ltv, 0)}`} />
            <ResultCard emoji="🏡" title="매수 가능가" value={result.estimatedPrice} description="자기자금 + 대출" highlight />
          </div>
        )}

        <Collapsible title="계산식 자세히 보기">
          <ul className="space-y-1 text-xs text-muted-foreground">
            <li>· 적용 LTV: {formatPercent(ltvResult.ltv, 0)} — {ltvResult.note}</li>
            {result.assumptions.map((a, i) => (
              <li key={i}>· {a}</li>
            ))}
          </ul>
        </Collapsible>
      </div>

      {/* ── 대출 용어 가이드 ── */}
      <div className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground">대출 규제 한눈에 보기</h2>
        <div className="space-y-2">
          <Collapsible title="LTV · DTI · DSR 이게 뭐야?">
            <div className="space-y-3">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-border text-left text-muted-foreground">
                      <th className="pb-2 pr-3">용어</th>
                      <th className="pb-2 pr-3">쉬운 뜻</th>
                      <th className="pb-2">계산</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="py-1.5 pr-3 font-medium">LTV</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">집값의 몇 %까지 빌려줄래?</td>
                      <td className="py-1.5 text-muted-foreground">대출잔액 / 주택가격 × 100</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-3 font-medium">DTI</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">연봉 대비 주담대 상환 비율</td>
                      <td className="py-1.5 text-muted-foreground">(주담대 원리금 + 기타 이자) / 연소득</td>
                    </tr>
                    <tr>
                      <td className="py-1.5 pr-3 font-medium">DSR</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">네 월급으로 모든 빚 갚을 수 있어?</td>
                      <td className="py-1.5 text-muted-foreground">모든 대출 원리금 / 연소득</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-[11px] text-muted-foreground">
                LTV는 담보 기준, DSR은 소득 기준이에요. 둘 다 통과해야 대출이 나와요.
              </p>
            </div>
          </Collapsible>

          <Collapsible title="DSR 규제 — 내 월급으로 감당 가능한지 체크">
            <div className="space-y-2">
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>· 은행권 DSR <strong className="text-foreground">40%</strong> / 비은행권 <strong className="text-foreground">50%</strong></li>
                <li>· 총 대출 1억원 초과 시 적용</li>
                <li>· 카드론, 학자금, 자동차 할부 등 기존 빚 전부 포함</li>
              </ul>
              <p className="text-[11px] text-muted-foreground">
                주담대 받기 전에 기존 대출을 정리하면 한도가 올라갈 수 있어요.
              </p>
            </div>
          </Collapsible>

          <Collapsible title="스트레스 금리 — 대출 한도가 줄어드는 이유">
            <div className="space-y-2">
              <ul className="space-y-1 text-xs text-muted-foreground">
                <li>· 변동/혼합금리 대출 시 <strong className="text-foreground">스트레스 금리 1.5%p</strong> 가산하여 DSR 산정</li>
                <li>· 실제 금리가 4%여도, DSR 계산은 5.5%로 적용</li>
                <li>· 결과적으로 대출 가능 금액이 줄어드는 효과</li>
              </ul>
              <p className="text-[11px] text-muted-foreground">
                금리가 오를 때를 대비한 안전장치예요. 고정금리를 선택하면 스트레스 금리가 적용되지 않아요.
              </p>
            </div>
          </Collapsible>
        </div>
      </div>

      {/* ── 정책상품 매칭 ── */}
      {productResults.length > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-sm font-semibold text-muted-foreground">🏛️ 정책 대출상품 매칭</h2>
          <div className="space-y-3">
            {productResults.map((r) => {
              const ps = findSourcesByIds(allSources, r.product.sourceIds);
              return (
                <div
                  key={r.product.id}
                  className={`rounded-2xl border p-4 ${
                    r.eligible
                      ? "border-primary/20 bg-primary/5"
                      : "border-border bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{r.eligible ? "✅" : "❌"}</span>
                    <span className="text-sm font-semibold">{r.product.name}</span>
                    <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] font-medium ${
                      r.eligible ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"
                    }`}>
                      {r.eligible ? "자격 충족" : "미충족"}
                    </span>
                  </div>
                  {r.eligible && r.product.interestRange && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      📊 금리 {r.product.interestRange.min}% ~ {r.product.interestRange.max}% · 최대 {formatKRW(r.maxLoanAmount)}
                    </p>
                  )}
                  <Collapsible title="상세">
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
