import type { CalculationResult } from './types';

export interface SgpaEntry { credits: number; gradePoints: number; }
export interface SgpaResult { sgpa: number; totalCredits: number; }

export function calculateSgpa(entries: SgpaEntry[]): CalculationResult<SgpaResult> {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { success: false, error: 'Add at least one subject.' };
  }
  let totalCredits = 0;
  let totalPoints = 0;
  for (const e of entries) {
    if (!Number.isFinite(e.credits) || !Number.isFinite(e.gradePoints)) {
      return { success: false, error: 'All credits and grade points must be valid numbers.' };
    }
    if (e.credits <= 0) return { success: false, error: 'Credits must be greater than zero.' };
    if (e.gradePoints < 0 || e.gradePoints > 10) return { success: false, error: 'Grade points must be between 0 and 10.' };
    totalCredits += e.credits;
    totalPoints += e.credits * e.gradePoints;
  }
  return { success: true, value: { sgpa: totalPoints / totalCredits, totalCredits } };
}
