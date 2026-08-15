import type { CalculationResult } from './types';

export type Sex = 'male' | 'female';

export function calculateBodyFat(
  sex: Sex, heightCm: number, waistCm: number, neckCm: number, hipCm: number
): CalculationResult<number> {
  if (![heightCm, waistCm, neckCm, hipCm].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (heightCm <= 0 || waistCm <= 0 || neckCm <= 0 || hipCm <= 0) return { success: false, error: 'All measurements must be greater than zero.' };
  
  if (sex === 'male') {
    if (waistCm <= neckCm) return { success: false, error: 'Waist must be larger than neck.' };
    const val = 495 / (1.0324 - 0.19077 * Math.log10(waistCm - neckCm) + 0.15456 * Math.log10(heightCm)) - 450;
    return { success: true, value: val };
  } else {
    if (waistCm + hipCm <= neckCm) return { success: false, error: 'Waist + Hip must be larger than neck.' };
    const val = 495 / (1.29579 - 0.35004 * Math.log10(waistCm + hipCm - neckCm) + 0.22100 * Math.log10(heightCm)) - 450;
    return { success: true, value: val };
  }
}
