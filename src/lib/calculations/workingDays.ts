import type { CalculationResult } from './types';
import { parseIsoDate } from './dates';

export function calculateWorkingDays(startStr: string, endStr: string): CalculationResult<number> {
  const start = parseIsoDate(startStr);
  const end = parseIsoDate(endStr);
  if (!start || !end) return { success: false, error: 'Please choose valid dates.' };

  const startMs = Date.UTC(start.year, start.month - 1, start.day);
  const endMs = Date.UTC(end.year, end.month - 1, end.day);

  const [earlierMs, laterMs] = startMs <= endMs ? [startMs, endMs] : [endMs, startMs];

  let count = 0;
  let current = earlierMs;
  while (current <= laterMs) {
    const dayOfWeek = new Date(current).getUTCDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    current += 86400000;
  }
  return { success: true, value: count };
}
