import type { CalculationResult } from './types';

export type Sex = 'male' | 'female';

export function calculateIdealWeight(heightCm: number, sex: Sex): CalculationResult<number> {
  if (!Number.isFinite(heightCm)) return { success: false, error: 'Invalid height.' };
  if (heightCm <= 0) return { success: false, error: 'Height must be greater than zero.' };
  const inches = heightCm / 2.54;
  const inchesOver60 = Math.max(0, inches - 60);
  const idealKg = sex === 'male'
    ? 50 + 2.3 * inchesOver60
    : 45.5 + 2.3 * inchesOver60;
  return { success: true, value: idealKg };
}
