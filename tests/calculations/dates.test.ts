import { describe, it, expect } from 'vitest';
import { calculateAge, calculateDateDifference, parseIsoDate, daysInMonth } from '../../src/lib/calculations/dates';

describe('parseIsoDate', () => {
  it('parses valid date', () => {
    expect(parseIsoDate('2000-05-15')).toEqual({ year: 2000, month: 5, day: 15 });
  });
  it('rejects Feb 30', () => {
    expect(parseIsoDate('2023-02-30')).toBeNull();
  });
  it('accepts Feb 29 in leap year', () => {
    expect(parseIsoDate('2024-02-29')).toEqual({ year: 2024, month: 2, day: 29 });
  });
  it('rejects garbage', () => {
    expect(parseIsoDate('not-a-date')).toBeNull();
  });
});

describe('daysInMonth', () => {
  it('Feb leap vs non-leap', () => {
    expect(daysInMonth(2024, 2)).toBe(29);
    expect(daysInMonth(2023, 2)).toBe(28);
    expect(daysInMonth(1900, 2)).toBe(28);
    expect(daysInMonth(2000, 2)).toBe(29);
  });
});

describe('calculateAge', () => {
  it('exact birthday: 1990-05-15 to 2025-05-15 = 35y', () => {
    const res = calculateAge({ year: 1990, month: 5, day: 15 }, { year: 2025, month: 5, day: 15 });
    expect(res.value).toMatchObject({ years: 35, months: 0, days: 0 });
  });
  it('after birthday: 1990-05-15 to 2025-06-20 = 35y 1m 5d', () => {
    const res = calculateAge({ year: 1990, month: 5, day: 15 }, { year: 2025, month: 6, day: 20 });
    expect(res.value).toMatchObject({ years: 35, months: 1, days: 5 });
  });
  it('before birthday: 1990-05-15 to 2025-04-10 = 34y 10m 26d', () => {
    const res = calculateAge({ year: 1990, month: 5, day: 15 }, { year: 2025, month: 4, day: 10 });
    expect(res.value).toMatchObject({ years: 34, months: 10, days: 26 });
  });
  it('total days for one non-leap year = 365', () => {
    const res = calculateAge({ year: 2001, month: 1, day: 1 }, { year: 2002, month: 1, day: 1 });
    expect(res.value?.totalDays).toBe(365);
  });
  it('days until next birthday from birthday = 365', () => {
    const res = calculateAge({ year: 1990, month: 5, day: 15 }, { year: 2025, month: 5, day: 15 });
    expect(res.value?.daysUntilNextBirthday).toBe(365);
  });
  it('blocks asOf before birth', () => {
    expect(calculateAge({ year: 2000, month: 1, day: 1 }, { year: 1999, month: 1, day: 1 }).success).toBe(false);
  });
});

describe('calculateDateDifference', () => {
  it('same date = 0 days', () => {
    const res = calculateDateDifference({ year: 2025, month: 1, day: 1 }, { year: 2025, month: 1, day: 1 });
    expect(res.value?.totalDays).toBe(0);
  });
  it('10 days = 1 week 3 days', () => {
    const res = calculateDateDifference({ year: 2025, month: 1, day: 1 }, { year: 2025, month: 1, day: 11 });
    expect(res.value).toMatchObject({ totalDays: 10, weeks: 1, remainingDays: 3 });
  });
  it('works regardless of order', () => {
    const a = calculateDateDifference({ year: 2025, month: 1, day: 11 }, { year: 2025, month: 1, day: 1 });
    expect(a.value?.totalDays).toBe(10);
  });
  it('one year breakdown', () => {
    const res = calculateDateDifference({ year: 2024, month: 1, day: 1 }, { year: 2025, month: 1, day: 1 });
    expect(res.value).toMatchObject({ years: 1, months: 0, days: 0, totalDays: 366 });
  });
});
