import type { CalculationResult } from './types';

export interface SipResult {
  invested: number;
  estimatedReturns: number;
  totalValue: number;
}

export function calculateSip(
  monthlyAmount: number,
  annualReturnPercent: number,
  years: number
): CalculationResult<SipResult> {
  if (![monthlyAmount, annualReturnPercent, years].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (monthlyAmount <= 0) return { success: false, error: 'Monthly investment must be greater than zero.' };
  if (annualReturnPercent < 0) return { success: false, error: 'Expected return cannot be negative.' };
  if (years <= 0) return { success: false, error: 'Time period must be greater than zero.' };

  const n = years * 12;
  const r = annualReturnPercent / 100 / 12;
  const invested = monthlyAmount * n;

  let totalValue: number;
  if (r === 0) {
    totalValue = invested;
  } else {
    totalValue = monthlyAmount * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  }

  return {
    success: true,
    value: {
      invested,
      estimatedReturns: totalValue - invested,
      totalValue,
    },
  };
}
