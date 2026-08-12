import { describe, it, expect } from 'vitest';
import {
  calculatePercentageOf,
  calculateWhatPercentage,
  calculatePercentageChange,
} from '../../src/lib/calculations/percentage';

describe('calculatePercentageOf', () => {
  it('calculates 25% of 200 = 50', () => {
    expect(calculatePercentageOf(25, 200)).toEqual({ success: true, value: 50 });
  });
  it('calculates 0% of 200 = 0', () => {
    expect(calculatePercentageOf(0, 200)).toEqual({ success: true, value: 0 });
  });
  it('calculates 100% of 200 = 200', () => {
    expect(calculatePercentageOf(100, 200)).toEqual({ success: true, value: 200 });
  });
  it('handles decimals', () => {
    expect(calculatePercentageOf(12.5, 80)).toEqual({ success: true, value: 10 });
  });
  it('rejects non-finite input', () => {
    expect(calculatePercentageOf(Number.NaN, 10).success).toBe(false);
  });
});

describe('calculateWhatPercentage', () => {
  it('calculates 50 of 200 = 25%', () => {
    expect(calculateWhatPercentage(50, 200)).toEqual({ success: true, value: 25 });
  });
  it('calculates 0 of 200 = 0%', () => {
    expect(calculateWhatPercentage(0, 200)).toEqual({ success: true, value: 0 });
  });
  it('blocks division by zero', () => {
    expect(calculateWhatPercentage(50, 0).success).toBe(false);
  });
});

describe('calculatePercentageChange', () => {
  it('calculates 100 to 120 = +20%', () => {
    expect(calculatePercentageChange(100, 120)).toEqual({ success: true, value: 20 });
  });
  it('calculates 120 to 100 ≈ -16.6667%', () => {
    const res = calculatePercentageChange(120, 100);
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(-16.6667, 4);
  });
  it('blocks zero original value', () => {
    expect(calculatePercentageChange(0, 50).success).toBe(false);
  });
  it('handles negative original values', () => {
    const res = calculatePercentageChange(-50, -25);
    expect(res.success).toBe(true);
    expect(res.value).toBeCloseTo(50, 4);
  });
  it('rejects Infinity', () => {
    expect(calculatePercentageChange(Infinity, 10).success).toBe(false);
  });
});
