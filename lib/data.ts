import type {
  LastUpdated,
  SourcesData,
  LoanProductsData,
  TaxRulesData,
  LtvRulesData,
  Source,
} from "./types";

const BASE = "/data";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/${path}`);
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.statusText}`);
  return res.json() as Promise<T>;
}

export async function getLastUpdated(): Promise<LastUpdated> {
  return fetchJson<LastUpdated>("last_updated.json");
}

export async function getSources(): Promise<SourcesData> {
  return fetchJson<SourcesData>("sources.json");
}

export async function getLoanProducts(): Promise<LoanProductsData> {
  return fetchJson<LoanProductsData>("loan_products.json");
}

export async function getTaxRules(): Promise<TaxRulesData> {
  return fetchJson<TaxRulesData>("tax_rules.json");
}

export async function getLtvRules(): Promise<LtvRulesData> {
  return fetchJson<LtvRulesData>("ltv_rules.json");
}

export function findSourcesByIds(
  sources: Source[],
  ids: string[]
): Source[] {
  return sources.filter((s) => ids.includes(s.id));
}
