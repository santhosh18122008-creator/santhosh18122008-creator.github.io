import type { CalculationResult } from './types';

export interface DateParts {
  year: number;
  month: number;
  day: number;
}

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  switch (month) {
    case 1: case 3: case 5: case 7: case 8: case 10: case 12: return 31;
    case 4: case 6: case 9: case 11: return 30;
    case 2: return isLeapYear(year) ? 29 : 28;
    default: return NaN;
  }
}

export function parseIsoDate(value: string): DateParts | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > daysInMonth(year, month)) return null;
  return { year, month, day };
}

function toUtcMillis(p: DateParts): number {
  return Date.UTC(p.year, p.month - 1, p.day);
}

export interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  daysUntilNextBirthday: number;
}

export function calculateAge(birth: DateParts, asOf: DateParts): CalculationResult<AgeResult> {
  const birthMs = toUtcMillis(birth);
  const asOfMs = toUtcMillis(asOf);
  if (asOfMs < birthMs) {
    return { success: false, error: 'The "as of" date cannot be before the birth date.' };
  }

  let years = asOf.year - birth.year;
  let months = asOf.month - birth.month;
  let days = asOf.day - birth.day;

  if (days < 0) {
    months -= 1;
    const prevMonth = asOf.month === 1 ? 12 : asOf.month - 1;
    days += daysInMonth(asOf.year, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }

  const totalDays = Math.round((asOfMs - birthMs) / 86400000);

  let nextBirthdayMs = Date.UTC(asOf.year, birth.month - 1, birth.day);
  if (nextBirthdayMs <= asOfMs) {
    nextBirthdayMs = Date.UTC(asOf.year + 1, birth.month - 1, birth.day);
  }
  const daysUntilNextBirthday = Math.round((nextBirthdayMs - asOfMs) / 86400000);

  return {
    success: true,
    value: { years, months, days, totalDays, daysUntilNextBirthday },
  };
}

export interface DateDifferenceResult {
  totalDays: number;
  weeks: number;
  remainingDays: number;
  years: number;
  months: number;
  days: number;
}

export function calculateDateDifference(a: DateParts, b: DateParts): CalculationResult<DateDifferenceResult> {
  const aMs = toUtcMillis(a);
  const bMs = toUtcMillis(b);

  const [earlierMs, laterMs] = aMs <= bMs ? [aMs, bMs] : [bMs, aMs];
  const [earlier, later] = aMs <= bMs ? [a, b] : [b, a];

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

  const totalDays = Math.round((laterMs - earlierMs) / 86400000);

  return {
    success: true,
    value: {
      totalDays,
      weeks: Math.floor(totalDays / 7),
      remainingDays: totalDays % 7,
      years,
      months,
      days,
    },
  };
}
