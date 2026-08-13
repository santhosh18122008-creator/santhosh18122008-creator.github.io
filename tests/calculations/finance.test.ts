import { describe, it, expect } from 'vitest';
import { calculateDiscount, calculateSimpleInterest } from '../../src/lib/calculations/finance';

describe('calculateDiscount', () => {
  it('20% off 50 = save 10, pay 40', () => {
    expect(calculateDiscount(50, 20)).toEqual({ success: true, value: { saved: 10, finalPrice: 40 } });
  });
  it('0% discount = same price', () => {
    expect(calculateDiscount(99.99, 0).value?.finalPrice).toBeCloseTo(99.99, 5);
  });
  it('100% discount = free', () => {
    expect(calculateDiscount(50, 100).value?.finalPrice).toBe(0);
  });
  it('blocks discount above 100', () => {
    expect(calculateDiscount(50, 101).success).toBe(false);
  });
  it('blocks negative price', () => {
    expect(calculateDiscount(-5, 10).success).toBe(false);
  });
});

describe('calculateSimpleInterest', () => {
  it('1000 at 5% for 3 years = 150 interest, 1150 total', () => {
    expect(calculateSimpleInterest(1000, 5, 3)).toEqual({ success: true, value: { interest: 150, total: 1150 } });
  });
  it('supports decimal years', () => {
    expect(calculateSimpleInterest(1000, 10, 0.5).value?.interest).toBe(50);
  });
  it('zero rate = zero interest', () => {
    expect(calculateSimpleInterest(500, 0, 5).value?.interest).toBe(0);
  });
  it('blocks negative principal', () => {
    expect(calculateSimpleInterest(-100, 5, 1).success).toBe(false);
  });
  it('blocks negative time', () => {
    expect(calculateSimpleInterest(100, 5, -1).success).toBe(false);
  });
});
