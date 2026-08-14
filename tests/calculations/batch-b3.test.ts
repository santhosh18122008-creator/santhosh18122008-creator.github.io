import { describe, it, expect } from 'vitest';
import { calculateSip } from '../../src/lib/calculations/sip';
import { calculateCtcToInHand } from '../../src/lib/calculations/salary';
import { calculateFreelanceRate } from '../../src/lib/calculations/freelance';
import { calculateBreakEven } from '../../src/lib/calculations/breakeven';
import { calculateIncomeTax } from '../../src/lib/calculations/incomeTax';

describe('calculateSip', () => {
  it('5000/month for 10 years at 12%', () => {
    const r = calculateSip(5000, 12, 10);
    expect(r.value?.invested).toBe(600000);
    expect(r.value?.totalValue).toBeCloseTo(1161695, -3);
  });
  it('0% return returns invested amount', () => {
    const r = calculateSip(1000, 0, 2);
    expect(r.value?.totalValue).toBe(24000);
  });
  it('blocks 0 monthly', () => { expect(calculateSip(0, 12, 10).success).toBe(false); });
});

describe('calculateCtcToInHand', () => {
  it('12L CTC gives reasonable monthly in-hand', () => {
    const r = calculateCtcToInHand(1200000);
    expect(r.value?.basic).toBe(480000);
    expect(r.value?.hra).toBe(192000);
    expect(r.value?.monthlyInHand).toBeGreaterThan(70000);
    expect(r.value?.monthlyInHand).toBeLessThan(100000);
  });
  it('blocks 0 CTC', () => { expect(calculateCtcToInHand(0).success).toBe(false); });
});

describe('calculateFreelanceRate', () => {
  it('100k target, 10k expenses, 30% tax, 160h = ~982/h', () => {
    const r = calculateFreelanceRate(100000, 10000, 30, 160);
    expect(r.value?.hourlyRate).toBeCloseTo(955.36, 0);
    expect(r.value?.dailyRate).toBeCloseTo(r.value!.hourlyRate * 8, 5);
  });
  it('blocks 100% tax', () => { expect(calculateFreelanceRate(100000, 0, 100, 160).success).toBe(false); });
  it('blocks 0 billable hours', () => { expect(calculateFreelanceRate(100000, 0, 0, 0).success).toBe(false); });
});

describe('calculateBreakEven', () => {
  it('10000 fixed, 50 price, 30 variable = 500 units', () => {
    const r = calculateBreakEven(10000, 50, 30);
    expect(r.value?.units).toBe(500);
    expect(r.value?.revenue).toBe(25000);
  });
  it('blocks price <= variable', () => { expect(calculateBreakEven(1000, 10, 10).success).toBe(false); });
});

describe('calculateIncomeTax', () => {
  it('12L new regime: taxable 11.25L, tax ~85k', () => {
    const r = calculateIncomeTax(1200000, 'new', 0);
    expect(r.value?.taxableIncome).toBe(1125000);
    expect(r.value?.tax).toBe(68750);
    expect(r.value?.cess).toBe(2750);
  });
  it('7L new regime = zero tax (87A rebate)', () => {
    const r = calculateIncomeTax(700000, 'new', 0);
    expect(r.value?.tax).toBe(0);
    expect(r.value?.totalTax).toBe(0);
  });
  it('5L old regime = zero tax (87A rebate)', () => {
    const r = calculateIncomeTax(500000, 'old', 0);
    expect(r.value?.tax).toBe(0);
  });
  it('15L old regime = correct slab math', () => {
    const r = calculateIncomeTax(1500000, 'old', 0);
    expect(r.value?.taxableIncome).toBe(1450000); // 15L - 50k std
    // 2.5L@0 + 2.5L@5% + 5L@20% + 4.5L@30% = 0 + 12500 + 100000 + 135000 = 247500
    expect(r.value?.tax).toBe(247500);
  });
});
