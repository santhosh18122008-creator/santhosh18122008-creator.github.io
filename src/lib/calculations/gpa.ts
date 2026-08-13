import type { CalculationResult } from './types';

export const LETTER_GRADES = ['A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'F'] as const;

export type LetterGrade = (typeof LETTER_GRADES)[number];

export const GRADE_POINTS: Record<LetterGrade, number> = {
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export interface GpaEntry {
  grade: LetterGrade;
  credits: number;
}

export interface GpaResult {
  gpa: number;
  totalCredits: number;
}

export function calculateGpa(entries: GpaEntry[]): CalculationResult<GpaResult> {
  if (!Array.isArray(entries) || entries.length === 0) {
    return { success: false, error: 'Add at least one course.' };
  }
  let totalPoints = 0;
  let totalCredits = 0;
  for (const entry of entries) {
    const points = GRADE_POINTS[entry.grade];
    if (points === undefined) {
      return { success: false, error: 'Unknown grade selected.' };
    }
    if (!Number.isFinite(entry.credits) || entry.credits <= 0) {
      return { success: false, error: 'Credits must be a number greater than zero.' };
    }
    totalPoints += points * entry.credits;
    totalCredits += entry.credits;
  }
  return { success: true, value: { gpa: totalPoints / totalCredits, totalCredits } };
}
