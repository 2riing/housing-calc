import { z } from "zod";

const positiveNumber = z
  .number({ invalid_type_error: "숫자를 입력해주세요" })
  .min(0, "0 이상의 숫자를 입력해주세요");

const positiveRequired = z
  .number({ invalid_type_error: "숫자를 입력해주세요" })
  .positive("0보다 큰 숫자를 입력해주세요");

export const buySchema = z.object({
  cash: positiveNumber,
  monthlySaving: positiveNumber,
  targetYears: z
    .number({ invalid_type_error: "숫자를 입력해주세요" })
    .int("정수를 입력해주세요")
    .min(1, "1년 이상 입력해주세요")
    .max(30, "30년 이하로 입력해주세요"),
  annualIncome: positiveRequired,
  monthlyDebtPayment: positiveNumber,
  ltvRatio: z
    .number()
    .min(0.1, "10% 이상으로 설정해주세요")
    .max(0.9, "90% 이하로 설정해주세요"),
});

export const rentSchema = z.object({
  deposit: positiveRequired,
  region: z.enum(["metro", "non_metro"]),
  annualIncome: positiveRequired,
  totalAsset: positiveNumber,
  isHomeless: z.boolean(),
  tag: z.string().min(1),
});

export const taxSchema = z.object({
  acquisitionPrice: positiveRequired,
  salePrice: positiveRequired,
  expenses: positiveNumber,
});

export type BuySchemaType = z.infer<typeof buySchema>;
export type RentSchemaType = z.infer<typeof rentSchema>;
export type TaxSchemaType = z.infer<typeof taxSchema>;
