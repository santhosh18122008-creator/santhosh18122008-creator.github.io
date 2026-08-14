import type { CalculationResult } from './types';

export interface FreelanceResult {
  hourlyRate: number;
  dailyRate: number;
  monthlyRevenue: number;
}

export function calculateFreelanceRate(
  targetMonthly: number,
  monthlyExpenses: number,
  taxPercent: number,
  billableHoursPerMonth: number
): CalculationResult<FreelanceResult> {
  if (![targetMonthly, monthlyExpenses, taxPercent, billableHoursPerMonth].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (targetMonthly < 0) return { success: false, error: 'Target income cannot be negative.' };
  if (monthlyExpenses < 0) return { success: false, error: 'Expenses cannot be negative.' };
  if (taxPercent < 0 || taxPercent >= 100) return { success: false, error: 'Tax rate must be between 0 and 99.' };
  if (billableHoursPerMonth <= 0) return { success: false, error: 'Billable hours must be greater than zero.' };

  const preTaxTarget = targetMonthly / (1 - taxPercent / 100);
  const totalNeeded = preTaxTarget + monthlyExpenses;
  const hourlyRate = totalNeeded / billableHoursPerMonth;

  return {
    success: true,
    value: {
      hourlyRate,
      dailyRate: hourlyRate * 8,
      monthlyRevenue: totalNeeded,
    },
  };
}
