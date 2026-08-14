import type { CalculationResult } from './types';

export function calculatePercentile(rank: number, total: number): CalculationResult<number> {
  if (!Number.isFinite(rank) || !Number.isFinite(total)) return { success: false, error: 'Invalid input values.' };
  if (!Number.isInteger(rank) || !Number.isInteger(total)) return { success: false, error: 'Rank and total must be whole numbers.' };
  if (rank < 1) return { success: false, error: 'Rank must be at least 1.' };
  if (total < 1) return { success: false, error: 'Total candidates must be at least 1.' };
  if (rank > total) return { success: false, error: 'Rank cannot be greater than the total candidates.' };
  return { success: true, value: ((total - rank) / total) * 100 };
}
