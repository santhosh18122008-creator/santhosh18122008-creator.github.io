import type { CalculationResult } from './types';

export function calculateOneRepMax(weight: number, reps: number): CalculationResult<number> {
  if (![weight, reps].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (weight <= 0) return { success: false, error: 'Weight must be greater than zero.' };
  if (!Number.isInteger(reps) || reps < 1) return { success: false, error: 'Reps must be a whole number of at least 1.' };
  if (reps > 30) return { success: false, error: 'The Epley formula is only accurate for up to 30 reps.' };
  
  if (reps === 1) return { success: true, value: weight };
  return { success: true, value: weight * (1 + reps / 30) };
}
