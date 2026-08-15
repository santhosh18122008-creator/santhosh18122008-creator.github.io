import type { CalculationResult } from './types';

export interface WhrResult { ratio: number; risk: string; }

export function calculateWHR(waistCm: number, hipCm: number, sex: 'male' | 'female'): CalculationResult<WhrResult> {
  if (![waistCm, hipCm].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (waistCm <= 0 || hipCm <= 0) return { success: false, error: 'Measurements must be greater than zero.' };
  
  const ratio = waistCm / hipCm;
  let risk = 'Low';
  if (sex === 'male') {
    if (ratio >= 1.0) risk = 'High';
    else if (ratio >= 0.9) risk = 'Moderate';
  } else {
    if (ratio >= 0.85) risk = 'High';
    else if (ratio >= 0.8) risk = 'Moderate';
  }
  return { success: true, value: { ratio, risk } };
}
