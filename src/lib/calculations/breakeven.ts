import type { CalculationResult } from './types';

export interface BreakEvenResult {
  units: number;
  revenue: number;
}

export function calculateBreakEven(
  fixedCosts: number,
  pricePerUnit: number,
  variableCostPerUnit: number
): CalculationResult<BreakEvenResult> {
  if (![fixedCosts, pricePerUnit, variableCostPerUnit].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (fixedCosts < 0) return { success: false, error: 'Fixed costs cannot be negative.' };
  if (pricePerUnit <= 0) return { success: false, error: 'Price per unit must be greater than zero.' };
  if (variableCostPerUnit < 0) return { success: false, error: 'Variable cost cannot be negative.' };
  if (pricePerUnit <= variableCostPerUnit) {
    return { success: false, error: 'Price must be higher than the variable cost per unit.' };
  }

  const contributionMargin = pricePerUnit - variableCostPerUnit;
  const units = fixedCosts / contributionMargin;

  return { success: true, value: { units, revenue: units * pricePerUnit } };
}
