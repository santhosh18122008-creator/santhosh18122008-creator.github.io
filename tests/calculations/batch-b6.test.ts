import { describe, it, expect } from 'vitest';
import { calculateBodyFat } from '../../src/lib/calculations/bodyFat';
import { calculateHeartRateZones } from '../../src/lib/calculations/heartRate';
import { calculateWHR } from '../../src/lib/calculations/whr';
import { calculateOneRepMax } from '../../src/lib/calculations/oneRepMax';
import { calculatePace } from '../../src/lib/calculations/pace';

describe('calculateBodyFat', () => {
  it('Male 180cm, waist 85, neck 40 ≈ 14.8%', () => {
    expect(calculateBodyFat('male', 180, 85, 40, 100).value).toBeCloseTo(14.8, 0);
  });
  it('blocks waist <= neck for men', () => {
    expect(calculateBodyFat('male', 180, 40, 40, 0).success).toBe(false);
  });
});

describe('calculateHeartRateZones', () => {
  it('Age 30, RHR 60 gives MaxHR 190', () => {
    const r = calculateHeartRateZones(30, 60);
    expect(r.value?.maxHr).toBe(190);
    expect(r.value?.z3[0]).toBe(151); // 60 + 0.7 * 130
  });
  it('blocks RHR > MaxHR', () => { expect(calculateHeartRateZones(30, 200).success).toBe(false); });
});

describe('calculateWHR', () => {
  it('Male 80/100 = 0.8 (Low)', () => {
    const r = calculateWHR(80, 100, 'male');
    expect(r.value?.ratio).toBe(0.8);
    expect(r.value?.risk).toBe('Low');
  });
  it('Female 80/90 = 0.88 (High)', () => {
    const r = calculateWHR(80, 90, 'female');
    expect(r.value?.risk).toBe('High');
  });
});

describe('calculateOneRepMax', () => {
  it('100kg for 5 reps = 116.6kg', () => {
    expect(calculateOneRepMax(100, 5).value).toBeCloseTo(116.66, 1);
  });
  it('1 rep = exact weight', () => {
    expect(calculateOneRepMax(150, 1).value).toBe(150);
  });
  it('blocks > 30 reps', () => { expect(calculateOneRepMax(50, 31).success).toBe(false); });
});

describe('calculatePace', () => {
  it('21.1km in 105 mins = 4:58 /km', () => {
    const r = calculatePace(105, 21.1, 'km');
    expect(r.value?.paceFormatted).toBe('4:59');
  });
  it('blocks zero distance', () => { expect(calculatePace(60, 0, 'km').success).toBe(false); });
});
