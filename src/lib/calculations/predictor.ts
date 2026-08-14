import type { CalculationResult } from './types';

export interface PredictorResult { needed: number; possible: boolean; }

export function calculateNeededScore(
  target: number, current: number, completedWeight: number, remainingWeight: number
): CalculationResult<PredictorResult> {
  if (![target, current, completedWeight, remainingWeight].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (completedWeight < 0 || remainingWeight < 0 || completedWeight + remainingWeight <= 0) {
    return { success: false, error: 'Weights must be positive and add up to more than zero.' };
  }
  if (completedWeight + remainingWeight > 100.01) {
    return { success: false, error: 'Total weight cannot exceed 100%.' };
  }
  const needed = (target - (current * (completedWeight / 100))) / (remainingWeight / 100);
  return { success: true, value: { needed, possible: needed <= 100 } };
}
