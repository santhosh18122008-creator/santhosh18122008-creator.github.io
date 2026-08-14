import { describe, it, expect } from 'vitest';
import { cgpaToPercentage } from '../../src/lib/calculations/cgpa';
import { calculatePercentile } from '../../src/lib/calculations/percentile';
import { calculateSpeedDistanceTime } from '../../src/lib/calculations/speed';
import { calculateBmi } from '../../src/lib/calculations/bmi';
import { generateRandomInts } from '../../src/lib/calculations/random';

describe('cgpaToPercentage', () => {
  it('9 CGPA with 9.5 = 85.5', () => expect(cgpaToPercentage(9, 9.5).value?.percentage).toBeCloseTo(85.5, 6));
  it('0 CGPA = 0', () => expect(cgpaToPercentage(0, 9.5).value?.percentage).toBe(0));
  it('blocks CGPA above 10', () => expect(cgpaToPercentage(11, 9.5).success).toBe(false));
  it('blocks negative CGPA', () => expect(cgpaToPercentage(-1, 9.5).success).toBe(false));
});

describe('calculatePercentile', () => {
  it('rank 1 of 100 = 99', () => { expect(calculatePercentile(1, 100).value).toBe(99); });
  it('rank 100 of 100 = 0', () => { expect(calculatePercentile(100, 100).value).toBe(0); });
  it('rank 50 of 100 = 50', () => { expect(calculatePercentile(50, 100).value).toBe(50); });
  it('blocks rank above total', () => { expect(calculatePercentile(101, 100).success).toBe(false); });
  it('blocks rank 0', () => { expect(calculatePercentile(0, 100).success).toBe(false); });
});

describe('calculateSpeedDistanceTime', () => {
  it('solves speed: 100 in 2 = 50', () => { expect(calculateSpeedDistanceTime('', '100', '2').value?.speed).toBe(50); });
  it('solves distance: 50 for 2 = 100', () => { expect(calculateSpeedDistanceTime('50', '', '2').value?.distance).toBe(100); });
  it('solves time: 100 at 50 = 2', () => { expect(calculateSpeedDistanceTime('50', '100', '').value?.time).toBe(2); });
  it('blocks three inputs', () => { expect(calculateSpeedDistanceTime('50', '100', '2').success).toBe(false); });
  it('blocks zero time when solving speed', () => { expect(calculateSpeedDistanceTime('', '100', '0').success).toBe(false); });
});

describe('calculateBmi', () => {
  it('70kg 170cm ≈ 24.2 Normal', () => {
    const r = calculateBmi(70, 170);
    expect(r.value?.bmi).toBeCloseTo(24.22, 1);
    expect(r.value?.category).toBe('Normal');
  });
  it('50kg 170cm = Underweight', () => { expect(calculateBmi(50, 170).value?.category).toBe('Underweight'); });
  it('80kg 170cm = Overweight', () => { expect(calculateBmi(80, 170).value?.category).toBe('Overweight'); });
  it('100kg 170cm = Obese', () => { expect(calculateBmi(100, 170).value?.category).toBe('Obese'); });
  it('blocks zero weight', () => { expect(calculateBmi(0, 170).success).toBe(false); });
});

describe('generateRandomInts', () => {
  it('stub 0 returns min', () => { expect(generateRandomInts(5, 10, 3, () => 0).value?.numbers).toEqual([5, 5, 5]); });
  it('stub max returns max', () => { expect(generateRandomInts(5, 10, 2, (m) => m - 1).value?.numbers).toEqual([10, 10]); });
  it('blocks min > max', () => { expect(generateRandomInts(10, 5, 1, () => 0).success).toBe(false); });
  it('blocks count 0', () => { expect(generateRandomInts(1, 10, 0, () => 0).success).toBe(false); });
  it('blocks count 101', () => { expect(generateRandomInts(1, 10, 101, () => 0).success).toBe(false); });
});
