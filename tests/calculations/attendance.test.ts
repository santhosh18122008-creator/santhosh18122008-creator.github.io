import { describe, it, expect } from 'vitest';
import { calculateAttendance } from '../../src/lib/calculations/attendance';

describe('calculateAttendance', () => {
  it('calculates 75 of 100 at 75% target = met', () => {
    const res = calculateAttendance(75, 100, 75);
    expect(res.value?.status).toBe('met');
    expect(res.value?.currentPercentage).toBe(75);
  });
  it('calculates classes needed: 70 of 100 at 75% target = 20 classes', () => {
    const res = calculateAttendance(70, 100, 75);
    expect(res.value?.status).toBe('below');
    expect(res.value?.classesNeeded).toBe(20);
  });
  it('calculates classes skippable: 80 of 100 at 75% target = 6 classes', () => {
    const res = calculateAttendance(80, 100, 75);
    expect(res.value?.status).toBe('above');
    expect(res.value?.classesSkippable).toBe(6);
  });
  it('blocks attended > total', () => {
    expect(calculateAttendance(110, 100, 75).success).toBe(false);
  });
  it('blocks total = 0', () => {
    expect(calculateAttendance(0, 0, 75).success).toBe(false);
  });
  it('blocks negative attended', () => {
    expect(calculateAttendance(-5, 100, 75).success).toBe(false);
  });
  it('blocks target outside 1-100', () => {
    expect(calculateAttendance(50, 100, 0).success).toBe(false);
    expect(calculateAttendance(50, 100, 101).success).toBe(false);
  });
});
