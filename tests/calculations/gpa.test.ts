import { describe, it, expect } from 'vitest';
import { calculateGpa } from '../../src/lib/calculations/gpa';

describe('calculateGpa', () => {
  it('single A with 3 credits = 4.0', () => {
    expect(calculateGpa([{ grade: 'A', credits: 3 }])).toEqual({
      success: true,
      value: { gpa: 4, totalCredits: 3 },
    });
  });
  it('A and B with equal credits = 3.5', () => {
    const res = calculateGpa([
      { grade: 'A', credits: 3 },
      { grade: 'B', credits: 3 },
    ]);
    expect(res.value?.gpa).toBeCloseTo(3.5, 6);
  });
  it('weights by credits: A(4cr) + F(1cr) = 3.2', () => {
    const res = calculateGpa([
      { grade: 'A', credits: 4 },
      { grade: 'F', credits: 1 },
    ]);
    expect(res.value?.gpa).toBeCloseTo(3.2, 6);
  });
  it('F only = 0', () => {
    expect(calculateGpa([{ grade: 'F', credits: 3 }]).value?.gpa).toBe(0);
  });
  it('supports decimal credits', () => {
    const res = calculateGpa([
      { grade: 'A-', credits: 1.5 },
      { grade: 'B+', credits: 1.5 },
    ]);
    expect(res.value?.gpa).toBeCloseTo(3.5, 6);
  });
  it('blocks empty list', () => {
    expect(calculateGpa([]).success).toBe(false);
  });
  it('blocks zero credits', () => {
    expect(calculateGpa([{ grade: 'A', credits: 0 }]).success).toBe(false);
  });
  it('blocks negative credits', () => {
    expect(calculateGpa([{ grade: 'A', credits: -3 }]).success).toBe(false);
  });
  it('blocks non-finite credits', () => {
    expect(calculateGpa([{ grade: 'A', credits: Infinity }]).success).toBe(false);
  });
});
