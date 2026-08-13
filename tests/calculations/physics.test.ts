import { describe, it, expect } from 'vitest';
import { calculateOhmsLaw, calculateKineticEnergy, calculatePotentialEnergy } from '../../src/lib/calculations/physics';

describe('calculateOhmsLaw', () => {
  it('calculates V given I=2 and R=5', () => {
    const res = calculateOhmsLaw('', '2', '5');
    expect(res.value?.voltage).toBe(10);
  });
  it('calculates I given V=12 and R=4', () => {
    const res = calculateOhmsLaw('12', '', '4');
    expect(res.value?.current).toBe(3);
  });
  it('calculates R given V=9 and I=3', () => {
    const res = calculateOhmsLaw('9', '3', '');
    expect(res.value?.resistance).toBe(3);
  });
  it('blocks 0 current when calculating R', () => {
    expect(calculateOhmsLaw('10', '0', '').success).toBe(false);
  });
  it('blocks 3 inputs provided', () => {
    expect(calculateOhmsLaw('10', '2', '5').success).toBe(false);
  });
  it('blocks 1 input provided', () => {
    expect(calculateOhmsLaw('10', '', '').success).toBe(false);
  });
});

describe('calculateKineticEnergy', () => {
  it('10 kg at 5 m/s = 125 J', () => {
    expect(calculateKineticEnergy(10, 5).value?.energy).toBe(125);
  });
  it('blocks negative mass', () => {
    expect(calculateKineticEnergy(-5, 5).success).toBe(false);
  });
});

describe('calculatePotentialEnergy', () => {
  it('10 kg at 5 m height = 490.5 J', () => {
    expect(calculatePotentialEnergy(10, 5).value?.energy).toBeCloseTo(490.5, 5);
  });
  it('allows custom gravity (e.g. Moon 1.62)', () => {
    expect(calculatePotentialEnergy(10, 5, 1.62).value?.energy).toBeCloseTo(81, 5);
  });
  it('blocks negative mass', () => {
    expect(calculatePotentialEnergy(-10, 5).success).toBe(false);
  });
});
