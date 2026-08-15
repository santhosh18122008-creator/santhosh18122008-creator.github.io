import type { CalculationResult } from './types';

export function calculateWaterIntake(weightKg: number, exerciseMinutes: number): CalculationResult<number> {
  if (![weightKg, exerciseMinutes].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (weightKg <= 0) return { success: false, error: 'Weight must be greater than zero.' };
  if (exerciseMinutes < 0) return { success: false, error: 'Exercise time cannot be negative.' };
  const base = weightKg * 35;
  const exerciseBonus = (exerciseMinutes / 30) * 500;
  return { success: true, value: base + exerciseBonus };
}
