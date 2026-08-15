import type { CalculationResult } from './types';
import { parseIsoDate } from './dates';

export function calculateDueDate(lmpStr: string): CalculationResult<string> {
  const lmp = parseIsoDate(lmpStr);
  if (!lmp) return { success: false, error: 'Please enter a valid LMP date.' };
  const lmpMs = Date.UTC(lmp.year, lmp.month - 1, lmp.day);
  const dueMs = lmpMs + 280 * 86400000;
  const due = new Date(dueMs);
  const yyyy = due.getUTCFullYear();
  const mm = String(due.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(due.getUTCDate()).padStart(2, '0');
  return { success: true, value: `${yyyy}-${mm}-${dd}` };
}
