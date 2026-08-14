import type { CalculationResult } from './types';

export interface RandomResult { numbers: number[]; }

export function generateRandomInts(
  min: number,
  max: number,
  count: number,
  randomInt: (max: number) => number
): CalculationResult<RandomResult> {
  if (!Number.isFinite(min) || !Number.isFinite(max) || !Number.isFinite(count)) return { success: false, error: 'Invalid input values.' };
  if (!Number.isInteger(min) || !Number.isInteger(max) || !Number.isInteger(count)) return { success: false, error: 'Use whole numbers only.' };
  if (min > max) return { success: false, error: 'Minimum cannot be greater than maximum.' };
  if (count < 1 || count > 100) return { success: false, error: 'Count must be between 1 and 100.' };
  const span = max - min + 1;
  const numbers = Array.from({ length: count }, () => min + randomInt(span));
  return { success: true, value: { numbers } };
}
