import { describe, it, expect } from 'vitest';
import {
  calculateDiscount, calculateSimpleInterest, calculateCompoundInterest,
  calculateEmi, calculateTip, calculateTax,
} from '../../src/lib/calculations/finance';

describe('calculateDiscount', () => {
  it('20% off 50 = save 10, pay 40', () => {
    expect(calculateDiscount(50, 20)).toEqual({ success: true, value: { saved: 10, finalPrice: 40 } });
  });
  it('blocks discount above 100', () => expect(calculateDiscount(50, 101).success).toBe(false));
});

describe('calculateSimpleInterest', () => {
  it('1000 at 5% for 3 years = 150 interest', () => {
    expect(calculateSimpleInterest(1000, 5, 3)).toEqual({ success: true, value: { interest: 150, total: 1150 } });
  });
});

describe('calculateCompoundInterest', () => {
  it('1000 at 10% for 1 year, yearly = 1100', () => {
    const res = calculateCompoundInterest(1000, 10, 1, 1);
    expect(res.value?.amount).toBeCloseTo(1100, 6);
    expect(res.value?.interest).toBeCloseTo(100, 6);
  });
  it('monthly compounding grows more', () => {
    const res = calculateCompoundInterest(1000, 10, 1, 12);
    expect(res.value?.amount).toBeCloseTo(1104.71, 1);
  });
  it('0 years returns principal', () => {
    expect(calculateCompoundInterest(500, 8, 0, 12).value?.amount).toBeCloseTo(500, 6);
  });
  it('blocks 0 compounds per year', () => {
    expect(calculateCompoundInterest(1000, 10, 1, 0).success).toBe(false);
  });
});

describe('calculateEmi', () => {
  it('0% rate splits evenly', () => {
    const res = calculateEmi(100000, 0, 10);
    expect(res.value?.emi).toBeCloseTo(10000, 6);
  });
  it('120000 at 12% for 12 months ≈ 10662.09', () => {
    const res = calculateEmi(120000, 12, 12);
    expect(res.value?.emi).toBeCloseTo(10661.85, 1);
    expect((res.value?.totalInterest ?? 0) > 0).toBe(true);
  });
  it('blocks zero principal', () => expect(calculateEmi(0, 10, 12).success).toBe(false));
  it('blocks zero months', () => expect(calculateEmi(1000, 10, 0).success).toBe(false));
});

describe('calculateTip', () => {
  it('100 bill, 10% tip, 2 people', () => {
    expect(calculateTip(100, 10, 2)).toEqual({ success: true, value: { tip: 10, total: 110, perPerson: 55 } });
  });
  it('blocks 0 people', () => expect(calculateTip(100, 10, 0).success).toBe(false));
});

describe('calculateTax', () => {
  it('add 18% to 100 = 118', () => {
    expect(calculateTax(100, 18, 'add')).toEqual({ success: true, value: { base: 100, tax: 18, total: 118 } });
  });
  it('extract 18% from 118 = base 100', () => {
    const res = calculateTax(118, 18, 'extract');
    expect(res.value?.base).toBeCloseTo(100, 6);
    expect(res.value?.tax).toBeCloseTo(18, 6);
  });
  it('blocks tax above 100', () => expect(calculateTax(100, 101, 'add').success).toBe(false));
});
