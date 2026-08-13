import type { CalculationResult } from './types';

export interface GradeResult {
  percentage: number;
  grade: string;
}

export function gradeFromPercentage(percentage: number): string {
  if (!Number.isFinite(percentage)) return 'F';
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  if (percentage >= 50) return 'D';
  return 'F';
}

export function calculateGrade(obtained: number, total: number): CalculationResult<GradeResult> {
  if (!Number.isFinite(obtained) || !Number.isFinite(total)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (obtained < 0) {
    return { success: false, error: 'Marks obtained cannot be negative.' };
  }
  if (total <= 0) {
    return { success: false, error: 'Maximum marks must be greater than zero.' };
  }
  if (obtained > total) {
    return { success: false, error: 'Marks obtained cannot exceed the maximum marks.' };
  }
  const percentage = (obtained / total) * 100;
  return { success: true, value: { percentage, grade: gradeFromPercentage(percentage) } };
}
