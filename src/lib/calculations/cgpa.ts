import type { CalculationResult } from './types';

export interface CgpaResult { percentage: number; }

export function cgpaToPercentage(cgpa: number, multiplier: number): CalculationResult<CgpaResult> {
  if (!Number.isFinite(cgpa) || !Number.isFinite(multiplier)) return { success: false, error: 'Invalid input values.' };
  if (cgpa < 0 || cgpa > 10) return { success: false, error: 'Enter a CGPA between 0 and 10.' };
  if (multiplier <= 0 || multiplier > 100) return { success: false, error: 'Multiplier must be between 1 and 100.' };
  return { success: true, value: { percentage: cgpa * multiplier } };
}
