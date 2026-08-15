import { describe, it, expect } from 'vitest';
import { getCountdown } from '../../src/lib/calculations/countdown';
import { calculateWorkingDays } from '../../src/lib/calculations/workingDays';
import { calculateSleepTimes } from '../../src/lib/calculations/sleep';
import { calculateAgeGap } from '../../src/lib/calculations/ageGap';
import { addTime } from '../../src/lib/calculations/timeMath';

describe('getCountdown', () => {
  it('calculates 1 day exactly', () => {
    const r = getCountdown(86400000, 0);
    expect(r.days).toBe(1);
    expect(r.isPast).toBe(false);
  });
  it('flags past dates', () => { expect(getCountdown(0, 1000).isPast).toBe(true); });
});

describe('calculateWorkingDays', () => {
  it('Mon to Fri = 5 days', () => {
    // 2024-01-01 is a Monday, 2024-01-05 is a Friday
    expect(calculateWorkingDays('2024-01-01', '2024-01-05').value).toBe(5);
  });
  it('Mon to Mon = 6 days (includes both Mondays)', () => {
    expect(calculateWorkingDays('2024-01-01', '2024-01-08').value).toBe(6);
  });
  it('works regardless of order', () => {
    expect(calculateWorkingDays('2024-01-05', '2024-01-01').value).toBe(5);
  });
});

describe('calculateSleepTimes', () => {
  it('returns 6 times for wake mode', () => {
    expect(calculateSleepTimes('07:00', 'wake').length).toBe(6);
  });
  it('adds 15 mins to sleep mode base', () => {
    // If I sleep at 23:00, +15 mins = 23:15. Cycle 1 (90m) = 00:45
    const times = calculateSleepTimes('23:00', 'sleep');
    expect(times[0]).toBe('00:45');
  });
  it('rejects invalid time', () => { expect(calculateSleepTimes('25:00', 'wake').length).toBe(0); });
});

describe('calculateAgeGap', () => {
  it('calculates 1y 1m 1d correctly', () => {
    const r = calculateAgeGap('2020-01-01', '2021-02-02');
    expect(r.value).toEqual({ years: 1, months: 1, days: 1 });
  });
  it('handles borrowing days across months', () => {
    // March 10 to April 5 -> 0y 0m 26d (borrowing from March's 31 days)
    const r = calculateAgeGap('2024-03-10', '2024-04-05');
    expect(r.value?.days).toBe(26);
  });
});

describe('addTime', () => {
  it('adds 2h 30m to 14:00 = 16:30', () => {
    expect(addTime('14:00', 2, 30, 'add').value).toBe('16:30');
  });
  it('subtracts across midnight', () => {
    expect(addTime('01:00', 2, 0, 'subtract').value).toBe('23:00');
  });
  it('rejects invalid time format', () => {
    expect(addTime('25:00', 1, 0, 'add').success).toBe(false);
  });
});
