import type { CalculationResult } from './types';

export interface FireResult { years: number; targetNumber: number; }

export function calculateFire(
  currentSavings: number, monthlyContribution: number,
  annualExpenses: number, annualReturnPercent: number
): CalculationResult<FireResult> {
  if (![currentSavings, monthlyContribution, annualExpenses, annualReturnPercent].every(Number.isFinite)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (currentSavings < 0) return { success: false, error: 'Current savings cannot be negative.' };
  if (monthlyContribution < 0) return { success: false, error: 'Monthly contribution cannot be negative.' };
  if (annualExpenses <= 0) return { success: false, error: 'Annual expenses must be greater than zero.' };
  if (annualReturnPercent < 0) return { success: false, error: 'Return cannot be negative.' };

  const target = annualExpenses * 25; // 4% rule
  const monthlyRate = annualReturnPercent / 100 / 12;

  let balance = currentSavings;
  let months = 0;
  const maxMonths = 100 * 12;

  if (balance >= target) return { success: true, value: { years: 0, targetNumber: target } };

  if (monthlyRate === 0) {
    if (monthlyContribution === 0) return { success: false, error: 'Cannot reach FIRE with zero return and zero contributions.' };
    months = Math.ceil((target - balance) / monthlyContribution);
  } else {
    while (balance < target && months < maxMonths) {
      balance = balance * (1 + monthlyRate) + monthlyContribution;
      months++;
    }
  }

  if (months >= maxMonths) {
    return { success: false, error: 'Cannot reach FIRE target within 100 years. Increase savings or reduce expenses.' };
  }
  return { success: true, value: { years: months / 12, targetNumber: target } };
}
