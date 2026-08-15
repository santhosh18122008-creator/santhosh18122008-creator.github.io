import type { CalculationResult } from './types';

export type Sex = 'male' | 'female';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very-active';

export interface BmrResult { bmr: number; tdee: number; }

const ACTIVITY_FACTORS: Record<ActivityLevel, number> = {
  'sedentary': 1.2, 'light': 1.375, 'moderate': 1.55, 'active': 1.725, 'very-active': 1.9,
};

export function calculateBmr(
  weightKg: number, heightCm: number, age: number, sex: Sex, activity: ActivityLevel
): CalculationResult<BmrResult> {
  if (![weightKg, heightCm, age].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (weightKg <= 0) return { success: false, error: 'Weight must be greater than zero.' };
  if (heightCm <= 0) return { success: false, error: 'Height must be greater than zero.' };
  if (age <= 0 || age > 120) return { success: false, error: 'Age must be between 1 and 120.' };

  const bmr = sex === 'male'
    ? 10 * weightKg + 6.25 * heightCm - 5 * age + 5
    : 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  const tdee = bmr * ACTIVITY_FACTORS[activity];

  return { success: true, value: { bmr, tdee } };
}
