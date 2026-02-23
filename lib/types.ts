// ── Data JSON types ──

export interface LastUpdated {
  updatedAt: string;
  note: string;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  publisher: string;
  checkedAt: string;
}

export interface SourcesData {
  sources: Source[];
}

export interface LoanLimit {
  tag: string;
  region: string;
  maxAmount: number;
  ratioMax: number;
}

export interface LoanProduct {
  id: string;
  name: string;
  type: "lease" | "purchase";
  version: string;
  sourceIds: string[];
  eligibility: {
    mustBeHomeless: boolean;
    regions: string[];
    tags: string[];
    incomeMax: number | null;
    assetMax: number | null;
    ageRange: { min: number; max: number } | null;
  };
  limits: LoanLimit[];
  interestRange: { min: number; max: number };
  notes: string[];
}

export interface LoanProductsData {
  products: LoanProduct[];
}

export interface TaxBracket {
  upTo: number | null;
  rate: number;
  deduction: number;
}

export interface TaxRulesData {
  capitalGainsSimple: {
    version: string;
    sourceIds: string[];
    localIncomeTaxRate: number;
    basicDeduction: number;
    brackets: TaxBracket[];
    notes: string[];
  };
}

// ── LTV Rules ──

export interface LtvRegionType {
  id: string;
  label: string;
  examples: string;
}

export interface LtvRule {
  regionType: string;
  housingCount: number;
  isFirstTime: boolean;
  ltv: number;
  note: string;
}

export interface LtvRulesData {
  version: string;
  sourceIds: string[];
  regionTypes: LtvRegionType[];
  rules: LtvRule[];
  notes: string[];
}

// ── Form input types ──

export interface BuyFormInput {
  cash: number;
  monthlySaving: number;
  targetYears: number;
  annualIncome: number;
  monthlyDebtPayment: number;
  ltvRatio: number;
}

export interface BuyResult {
  futureAsset: number;
  maxMonthlyPayment: number;
  estimatedLoan: number;
  estimatedPrice: number;
  assumptions: string[];
}

export interface RentFormInput {
  deposit: number;
  region: "metro" | "non_metro";
  annualIncome: number;
  totalAsset: number;
  isHomeless: boolean;
  tag: string;
}

export interface RentProductResult {
  product: LoanProduct;
  eligible: boolean;
  reasons: string[];
  maxLoanAmount: number;
  requiredCash: number;
}

export interface TaxFormInput {
  acquisitionPrice: number;
  salePrice: number;
  expenses: number;
}

export interface TaxResult {
  gain: number;
  taxableGain: number;
  taxAmount: number;
  localTax: number;
  totalTax: number;
  effectiveRate: number;
  appliedBracket: TaxBracket;
  steps: TaxStep[];
}

export interface TaxStep {
  label: string;
  value: number;
  formula?: string;
}
