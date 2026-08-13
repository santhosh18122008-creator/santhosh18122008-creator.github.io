import { describe, it, expect } from 'vitest';
import { calculateAverage } from '../../src/lib/calculations/average';

describe('calculateAverage', () => {
  it('averages [10, 20, 30] = 20', () => {
    expect(calculateAverage([10, 20, 30])).toEqual({
      success: true,
      value: { mean: 20, sum: 60, count: 3 },
    });
  });
  it('averages single number [5] = 5', () => {
    expect(calculateAverage([5])).toEqual({
      success: true,
      value: { mean: 5, sum: 5, count: 1 },
    });
  });
  it('handles decimals [1.5, 2.5] = 2', () => {
    expect(calculateAverage([1.5, 2.5])).toEqual({
      success: true,
      value: { mean: 2, sum: 4, count: 2 },
    });
  });
  it('handles negatives [-10, 10] = 0', () => {
    expect(calculateAverage([-10, 10])).toEqual({
      success: true,
      value: { mean: 0, sum: 0, count: 2 },
    });
  });
  it('blocks empty list', () => {
    expect(calculateAverage([]).success).toBe(false);
  });
  it('blocks NaN in list', () => {
    expect(calculateAverage([1, NaN, 3]).success).toBe(false);
  });
});
