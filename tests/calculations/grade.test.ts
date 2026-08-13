import { describe, it, expect } from 'vitest';
import { calculateGrade, gradeFromPercentage } from '../../src/lib/calculations/grade';

describe('calculateGrade', () => {
  it('calculates 85 of 100 = 85% (A)', () => {
    expect(calculateGrade(85, 100)).toEqual({ success: true, value: { percentage: 85, grade: 'A' } });
  });
  it('calculates 95 of 100 = A+', () => {
    expect(calculateGrade(95, 100).value?.grade).toBe('A+');
  });
  it('handles boundary 80 = A', () => {
    expect(gradeFromPercentage(80)).toBe('A');
  });
  it('handles boundary 89.99 = A', () => {
    expect(gradeFromPercentage(89.99)).toBe('A');
  });
  it('handles decimals: 62 of 80 = 77.5% (B)', () => {
    const res = calculateGrade(62, 80);
    expect(res.success).toBe(true);
    expect(res.value?.percentage).toBeCloseTo(77.5, 6);
    expect(res.value?.grade).toBe('B');
  });
  it('calculates 0 of 100 = 0% (F)', () => {
    expect(calculateGrade(0, 100)).toEqual({ success: true, value: { percentage: 0, grade: 'F' } });
  });
  it('blocks total = 0', () => {
    expect(calculateGrade(50, 0).success).toBe(false);
  });
  it('blocks negative total', () => {
    expect(calculateGrade(50, -100).success).toBe(false);
  });
  it('blocks negative obtained', () => {
    expect(calculateGrade(-5, 100).success).toBe(false);
  });
  it('blocks obtained > total', () => {
    expect(calculateGrade(120, 100).success).toBe(false);
  });
  it('rejects NaN', () => {
    expect(calculateGrade(Number.NaN, 100).success).toBe(false);
  });
});
