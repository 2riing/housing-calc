import type {
  TaxFormInput,
  TaxResult,
  TaxStep,
  TaxBracket,
  TaxRulesData,
} from "./types";

/**
 * 양도소득세(단순) 계산기
 *
 * 양도차익 = 양도가 - 취득가 - 필요경비
 * 과세표준 = 양도차익 - 기본공제(250만원)
 * 세액 = 과세표준 × 세율 - 누진공제
 * 총 세금 = 세액 + 지방소득세(세액 × 10%)
 */
export function calculateCapitalGainsTax(
  input: TaxFormInput,
  rules: TaxRulesData["capitalGainsSimple"]
): TaxResult {
  const { acquisitionPrice, salePrice, expenses } = input;
  const steps: TaxStep[] = [];

  // 1. 양도차익
  const gain = salePrice - acquisitionPrice - expenses;
  steps.push({
    label: "양도차익",
    value: gain,
    formula: `양도가(${salePrice.toLocaleString()}) - 취득가(${acquisitionPrice.toLocaleString()}) - 필요경비(${expenses.toLocaleString()})`,
  });

  if (gain <= 0) {
    return {
      gain,
      taxableGain: 0,
      taxAmount: 0,
      localTax: 0,
      totalTax: 0,
      effectiveRate: 0,
      appliedBracket: rules.brackets[0],
      steps,
    };
  }

  // 2. 과세표준
  const taxableGain = Math.max(0, gain - rules.basicDeduction);
  steps.push({
    label: "과세표준",
    value: taxableGain,
    formula: `양도차익(${gain.toLocaleString()}) - 기본공제(${rules.basicDeduction.toLocaleString()})`,
  });

  // 3. 세율 적용
  let appliedBracket: TaxBracket = rules.brackets[0];
  for (const bracket of rules.brackets) {
    if (bracket.upTo === null || taxableGain <= bracket.upTo) {
      appliedBracket = bracket;
      break;
    }
  }

  const taxAmount = Math.max(
    0,
    Math.floor(taxableGain * appliedBracket.rate - appliedBracket.deduction)
  );
  steps.push({
    label: "산출세액",
    value: taxAmount,
    formula: `과세표준(${taxableGain.toLocaleString()}) × ${(appliedBracket.rate * 100).toFixed(0)}% - 누진공제(${appliedBracket.deduction.toLocaleString()})`,
  });

  // 4. 지방소득세
  const localTax = Math.floor(taxAmount * rules.localIncomeTaxRate);
  steps.push({
    label: "지방소득세",
    value: localTax,
    formula: `산출세액(${taxAmount.toLocaleString()}) × ${(rules.localIncomeTaxRate * 100).toFixed(0)}%`,
  });

  // 5. 총 세금
  const totalTax = taxAmount + localTax;
  steps.push({
    label: "총 납부세액",
    value: totalTax,
    formula: `산출세액 + 지방소득세`,
  });

  const effectiveRate = gain > 0 ? totalTax / gain : 0;

  return {
    gain,
    taxableGain,
    taxAmount,
    localTax,
    totalTax,
    effectiveRate,
    appliedBracket,
    steps,
  };
}
