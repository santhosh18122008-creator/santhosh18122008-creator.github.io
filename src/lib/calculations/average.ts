import type { CalculationResult } from './types';

export interface AverageResult {
  mean: number;
  sum: number;
  count: number;
}

export function calculateAverage(numbers: number[]): CalculationResult<AverageResult> {
  if (!Array.isArray(numbers) || numbers.length === 0) {
    return { success: false, error: 'Add at least one number.' };
  }
  let sum = 0;
  let count = 0;
  for (const num of numbers) {
    if (!Number.isFinite(num)) {
      return { success: false, error: 'All values must be valid numbers.' };
    }
    sum += num;
    count += 1;
  }
  if (count === 0) {
    return { success: false, error: 'Add at least one number.' };
  }
  return { success: true, value: { mean: sum / count, sum, count } };
}
