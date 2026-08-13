import type { CalculationResult } from './types';

export type { CalculationResult } from './types';

export function calculatePercentageOf(x: number, y: number): CalculationResult<number> {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { success: false, error: 'Invalid input values.' };
  }
  return { success: true, value: (x / 100) * y };
}

export function calculateWhatPercentage(x: number, y: number): CalculationResult<number> {
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (y === 0) {
    return { success: false, error: 'Cannot calculate a percentage of zero.' };
  }
  return { success: true, value: (x / y) * 100 };
}

export function calculatePercentageChange(original: number, newValue: number): CalculationResult<number> {
  if (!Number.isFinite(original) || !Number.isFinite(newValue)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (original === 0) {
    return { success: false, error: 'Percentage change is undefined when the original value is zero.' };
  }
  return { success: true, value: ((newValue - original) / Math.abs(original)) * 100 };
}
