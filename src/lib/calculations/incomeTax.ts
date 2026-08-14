import type { CalculationResult } from './types';

export type TaxRegime = 'new' | 'old';

export interface TaxResult {
  taxableIncome: number;
  tax: number;
  cess: number;
  totalTax: number;
  inHand: number;
}

const NEW_SLABS = [
  { limit: 300000, rate: 0 },
  { limit: 700000, rate: 0.05 },
  { limit: 1000000, rate: 0.10 },
  { limit: 1200000, rate: 0.15 },
  { limit: 1500000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

const OLD_SLABS = [
  { limit: 250000, rate: 0 },
  { limit: 500000, rate: 0.05 },
  { limit: 1000000, rate: 0.20 },
  { limit: Infinity, rate: 0.30 },
];

function computeTax(income: number, slabs: { limit: number; rate: number }[]): number {
  let tax = 0;
  let prev = 0;
  for (const slab of slabs) {
    if (income <= prev) break;
    const taxable = Math.min(income, slab.limit) - prev;
    tax += taxable * slab.rate;
    prev = slab.limit;
  }
  return tax;
}

export function calculateIncomeTax(
  grossIncome: number,
  regime: TaxRegime,
  deductions: number
): CalculationResult<TaxResult> {
  if (![grossIncome, deductions].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (grossIncome < 0) return { success: false, error: 'Income cannot be negative.' };
  if (deductions < 0) return { success: false, error: 'Deductions cannot be negative.' };

  const stdDeduction = regime === 'new' ? 75000 : 50000;
  const taxableIncome = Math.max(0, grossIncome - stdDeduction - deductions);
  const slabs = regime === 'new' ? NEW_SLABS : OLD_SLABS;
  let tax = computeTax(taxableIncome, slabs);

  // New regime rebate under 87A: tax is zero if total income <= 7,00,000
  if (regime === 'new' && grossIncome <= 700000) {
    tax = 0;
  }
  // Old regime rebate: tax is zero if total income <= 5,00,000
  if (regime === 'old' && grossIncome <= 500000) {
    tax = 0;
  }

  const cess = tax * 0.04;
  const totalTax = tax + cess;

  return {
    success: true,
    value: {
      taxableIncome,
      tax,
      cess,
      totalTax,
      inHand: grossIncome - totalTax,
    },
  };
}
