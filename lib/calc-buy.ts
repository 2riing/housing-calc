import type { BuyFormInput, BuyResult } from "./types";

/**
 * "집을 살 수 있을까?" 계산기
 *
 * 단순 모델:
 * 1. 미래 자산 = 현금 + (월저축 × 12 × 목표연수)
 * 2. 월상환 가능액 = (연소득 / 12) × 0.4 - 기존월상환액  (DSR 40% 가정)
 * 3. 대출 추정 = 월상환가능액으로 30년 원리금균등 상환 시 가능 원금 (금리 4% 가정)
 * 4. 매수가능가 = 미래자산 + 대출 (LTV 역산)
 */
export function calculateBuy(input: BuyFormInput): BuyResult {
  const {
    cash,
    monthlySaving,
    targetYears,
    annualIncome,
    monthlyDebtPayment,
    ltvRatio,
  } = input;

  const assumptions: string[] = [];

  // 1. 미래 자산
  const futureAsset = cash + monthlySaving * 12 * targetYears;
  assumptions.push(
    `미래자산 = 보유현금(${cash.toLocaleString()}) + 월저축(${monthlySaving.toLocaleString()}) × 12 × ${targetYears}년`
  );

  // 2. 월상환 가능액 (DSR 40% 기준)
  const dsrRatio = 0.4;
  const monthlyIncome = annualIncome / 12;
  const maxMonthlyPayment = Math.max(
    0,
    monthlyIncome * dsrRatio - monthlyDebtPayment
  );
  assumptions.push(
    `월상환가능 = 월소득(${Math.round(monthlyIncome).toLocaleString()}) × DSR(40%) - 기존상환(${monthlyDebtPayment.toLocaleString()})`
  );

  // 3. 대출 추정 (30년 원리금균등, 4% 가정)
  const annualRate = 0.04;
  const monthlyRate = annualRate / 12;
  const months = 30 * 12;

  let estimatedLoan = 0;
  if (maxMonthlyPayment > 0 && monthlyRate > 0) {
    // PV = PMT × [(1 - (1+r)^-n) / r]
    const pvFactor = (1 - Math.pow(1 + monthlyRate, -months)) / monthlyRate;
    estimatedLoan = Math.floor(maxMonthlyPayment * pvFactor);
  }
  assumptions.push(
    `추정대출 = 원리금균등(금리 ${(annualRate * 100).toFixed(1)}%, 30년) 기준`
  );

  // 4. 매수 가능 가격
  // 자기자금 + 대출 = 매수가 × (1-LTV) + 매수가 × LTV 가 아니라,
  // 자기자금(=futureAsset)이 매수가의 (1-LTV) 이상이어야 함
  // 또한 대출은 매수가 × LTV 이하여야 함
  // → 매수가 = min(futureAsset / (1-LTV), (futureAsset + estimatedLoan))
  const maxPriceByEquity =
    ltvRatio < 1 ? Math.floor(futureAsset / (1 - ltvRatio)) : Infinity;
  const maxPriceByTotal = futureAsset + estimatedLoan;
  const estimatedPrice = Math.min(maxPriceByEquity, maxPriceByTotal);
  assumptions.push(
    `매수가능 = min(자기자금÷(1-LTV${(ltvRatio * 100).toFixed(0)}%), 자기자금+대출)`
  );

  return {
    futureAsset,
    maxMonthlyPayment: Math.floor(maxMonthlyPayment),
    estimatedLoan,
    estimatedPrice,
    assumptions,
  };
}
