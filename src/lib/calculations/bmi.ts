import type { CalculationResult } from './types';

export interface BmiResult { bmi: number; category: string; }

export function calculateBmi(weightKg: number, heightCm: number): CalculationResult<BmiResult> {
  if (!Number.isFinite(weightKg) || !Number.isFinite(heightCm)) return { success: false, error: 'Invalid input values.' };
  if (weightKg <= 0) return { success: false, error: 'Enter a weight greater than zero.' };
  if (heightCm <= 0) return { success: false, error: 'Enter a height greater than zero.' };
  const h = heightCm / 100;
  const bmi = weightKg / (h * h);
  let category = 'Normal';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi >= 30) category = 'Obese';
  else if (bmi >= 25) category = 'Overweight';
  return { success: true, value: { bmi, category } };
}
