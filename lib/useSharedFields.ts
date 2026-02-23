"use client";

import { useState, useCallback } from "react";

export interface SharedFields {
  annualIncome: number;
  totalAsset: number;
  regionType: string;
  tag: string;
}

const STORAGE_KEY = "housing-calc-shared";

const DEFAULTS: SharedFields = {
  annualIncome: 5000,
  totalAsset: 30000,
  regionType: "metro",
  tag: "general",
};

function readStorage(): SharedFields {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULTS, ...parsed };
  } catch {
    return DEFAULTS;
  }
}

export function useSharedFields() {
  const [shared, setShared] = useState<SharedFields>(readStorage);

  const save = useCallback((next: SharedFields) => {
    setShared(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // quota exceeded — ignore
    }
  }, []);

  return { shared, save };
}
