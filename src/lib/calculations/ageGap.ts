import type { CalculationResult } from './types';
import { parseIsoDate, daysInMonth } from './dates';

export function calculateAgeGap(d1Str: string, d2Str: string): CalculationResult<{years: number, months: number, days: number}> {
  const d1 = parseIsoDate(d1Str);
  const d2 = parseIsoDate(d2Str);
  if (!d1 || !d2) return { success: false, error: 'Please choose valid dates.' };

  const d1Ms = Date.UTC(d1.year, d1.month - 1, d1.day);
  const d2Ms = Date.UTC(d2.year, d2.month - 1, d2.day);

  const [earlier, later] = d1Ms <= d2Ms ? [d1, d2] : [d2, d1];

  let years = later.year - earlier.year;
  let months = later.month - earlier.month;
  let days = later.day - earlier.day;

  if (days < 0) {
    months -= 1;
    const prevMonth = later.month === 1 ? 12 : later.month - 1;
    days += daysInMonth(later.year, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  return { success: true, value: { years, months, days } };
}
