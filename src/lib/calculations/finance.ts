import type { CalculationResult } from './types';

export interface DiscountResult {
  saved: number;
  finalPrice: number;
}

export function calculateDiscount(originalPrice: number, discountPercent: number): CalculationResult<DiscountResult> {
  if (!Number.isFinite(originalPrice) || !Number.isFinite(discountPercent)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (originalPrice < 0) return { success: false, error: 'Price cannot be negative.' };
  if (discountPercent < 0 || discountPercent > 100) {
    return { success: false, error: 'Discount must be between 0 and 100.' };
  }
  const saved = originalPrice * (discountPercent / 100);
  return { success: true, value: { saved, finalPrice: originalPrice - saved } };
}

export interface SimpleInterestResult {
  interest: number;
  total: number;
}

export function calculateSimpleInterest(
  principal: number,
  annualRatePercent: number,
  years: number
): CalculationResult<SimpleInterestResult> {
  if (!Number.isFinite(principal) || !Number.isFinite(annualRatePercent) || !Number.isFinite(years)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (principal < 0) return { success: false, error: 'Principal cannot be negative.' };
  if (annualRatePercent < 0) return { success: false, error: 'Rate cannot be negative.' };
  if (years < 0) return { success: false, error: 'Time cannot be negative.' };
  const interest = (principal * annualRatePercent * years) / 100;
  return { success: true, value: { interest, total: principal + interest } };
}
