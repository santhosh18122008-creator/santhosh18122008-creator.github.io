import { describe, it, expect } from 'vitest';
import { convertLength, convertMass, convertTemperature } from '../../src/lib/calculations/units';

describe('convertLength', () => {
  it('1 km to m = 1000', () => expect(convertLength(1, 'km', 'm').value).toBe(1000));
  it('1 mi to km ≈ 1.609', () => expect(convertLength(1, 'mi', 'km').value).toBeCloseTo(1.609344, 5));
  it('1 ft to in = 12', () => expect(convertLength(1, 'ft', 'in').value).toBeCloseTo(12, 5));
});

describe('convertMass', () => {
  it('1 kg to g = 1000', () => expect(convertMass(1, 'kg', 'g').value).toBe(1000));
  it('1 kg to lb ≈ 2.204', () => expect(convertMass(1, 'kg', 'lb').value).toBeCloseTo(2.20462, 4));
});

describe('convertTemperature', () => {
  it('0 C to F = 32', () => expect(convertTemperature(0, 'C', 'F').value).toBe(32));
  it('100 C to F = 212', () => expect(convertTemperature(100, 'C', 'F').value).toBe(212));
  it('32 F to C = 0', () => expect(convertTemperature(32, 'F', 'C').value).toBe(0));
  it('0 C to K = 273.15', () => expect(convertTemperature(0, 'C', 'K').value).toBe(273.15));
});
