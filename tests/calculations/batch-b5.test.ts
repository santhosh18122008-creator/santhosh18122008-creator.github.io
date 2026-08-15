import { describe, it, expect } from 'vitest';
import { calculateProjectile } from '../../src/lib/calculations/projectile';
import { calculateDensity } from '../../src/lib/calculations/density';
import { calculateWorkPower } from '../../src/lib/calculations/workPower';
import { calculateBmr } from '../../src/lib/calculations/bmr';
import { calculateWaterIntake } from '../../src/lib/calculations/waterIntake';
import { calculateIdealWeight } from '../../src/lib/calculations/idealWeight';
import { calculateDueDate } from '../../src/lib/calculations/dueDate';
import { calculateFire } from '../../src/lib/calculations/fire';

describe('calculateProjectile', () => {
  it('20 m/s at 45° has range ~40.77m', () => {
    const r = calculateProjectile(20, 45);
    expect(r.value?.range).toBeCloseTo(40.77, 1);
    expect(r.value?.maxHeight).toBeCloseTo(10.19, 1);
    expect(r.value?.flightTime).toBeCloseTo(2.88, 1);
  });
  it('0° = zero height', () => { expect(calculateProjectile(20, 0).value?.maxHeight).toBeCloseTo(0, 6); });
  it('blocks angle > 90', () => { expect(calculateProjectile(20, 95).success).toBe(false); });
});

describe('calculateDensity', () => {
  it('solves density: 10 / 2 = 5', () => { expect(calculateDensity('', '10', '2').value?.density).toBe(5); });
  it('solves mass: 5 × 2 = 10', () => { expect(calculateDensity('5', '', '2').value?.mass).toBe(10); });
  it('solves volume: 10 / 5 = 2', () => { expect(calculateDensity('5', '10', '').value?.volume).toBe(2); });
  it('blocks three inputs', () => { expect(calculateDensity('5', '10', '2').success).toBe(false); });
});

describe('calculateWorkPower', () => {
  it('10N × 5m in 2s = 50J, 25W', () => {
    const r = calculateWorkPower(10, 5, 2);
    expect(r.value?.work).toBe(50);
    expect(r.value?.power).toBe(25);
  });
  it('blocks zero time', () => { expect(calculateWorkPower(10, 5, 0).success).toBe(false); });
});

describe('calculateBmr', () => {
  it('30M 70kg 170cm moderate ≈ 1665 BMR', () => {
    const r = calculateBmr(70, 170, 30, 'male', 'moderate');
    expect(r.value?.bmr).toBeCloseTo(1617.5, -1);
  });
  it('blocks age 0', () => { expect(calculateBmr(70, 170, 0, 'male', 'moderate').success).toBe(false); });
});

describe('calculateWaterIntake', () => {
  it('70kg no exercise = 2450ml', () => { expect(calculateWaterIntake(70, 0).value).toBe(2450); });
  it('70kg + 60min = 3450ml', () => { expect(calculateWaterIntake(70, 60).value).toBe(3450); });
});

describe('calculateIdealWeight', () => {
  it('male 180cm ≈ 79.3kg', () => { expect(calculateIdealWeight(180, 'male').value).toBeCloseTo(74.99, 0); });
  it('female 165cm ≈ 59.2kg', () => { expect(calculateIdealWeight(165, 'female').value).toBeCloseTo(56.91, 0); });
});

describe('calculateDueDate', () => {
  it('LMP 2024-01-01 = 2024-10-07', () => { expect(calculateDueDate('2024-01-01').value).toBe('2024-10-07'); });
  it('rejects invalid', () => { expect(calculateDueDate('garbage').success).toBe(false); });
});

describe('calculateFire', () => {
  it('target = expenses × 25', () => {
    const r = calculateFire(0, 2000, 40000, 7);
    expect(r.value?.targetNumber).toBe(1000000);
  });
  it('already at target = 0 years', () => {
    const r = calculateFire(1000000, 0, 40000, 7);
    expect(r.value?.years).toBe(0);
  });
  it('blocks zero return and zero contribution', () => {
    expect(calculateFire(0, 0, 40000, 0).success).toBe(false);
  });
});
