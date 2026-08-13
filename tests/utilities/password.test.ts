import { describe, it, expect } from 'vitest';
import {
  generatePassword,
  estimateEntropyBits,
  strengthLabel,
  CHARSETS,
  type PasswordOptions,
} from '../../src/lib/utilities/password';

const allOn: PasswordOptions = {
  length: 16,
  useLowercase: true,
  useUppercase: true,
  useNumbers: true,
  useSymbols: true,
};

const zeroRandom = () => 0;

describe('generatePassword', () => {
  it('produces the requested length', () => {
    const res = generatePassword(allOn, zeroRandom);
    expect(res.success).toBe(true);
    expect(res.value?.length).toBe(16);
  });
  it('contains at least one character from each selected set', () => {
    const res = generatePassword(allOn, zeroRandom);
    const pw = res.value as string;
    expect([...pw].some((c) => CHARSETS.lowercase.includes(c))).toBe(true);
    expect([...pw].some((c) => CHARSETS.uppercase.includes(c))).toBe(true);
    expect([...pw].some((c) => CHARSETS.numbers.includes(c))).toBe(true);
    expect([...pw].some((c) => CHARSETS.symbols.includes(c))).toBe(true);
  });
  it('uses only characters from the selected pool', () => {
    const opts: PasswordOptions = { ...allOn, useSymbols: false };
    const res = generatePassword(opts, zeroRandom);
    const pool = CHARSETS.lowercase + CHARSETS.uppercase + CHARSETS.numbers;
    expect([...(res.value as string)].every((c) => pool.includes(c))).toBe(true);
  });
  it('blocks when no character types are selected', () => {
    const opts: PasswordOptions = {
      length: 16,
      useLowercase: false,
      useUppercase: false,
      useNumbers: false,
      useSymbols: false,
    };
    expect(generatePassword(opts, zeroRandom).success).toBe(false);
  });
  it('blocks length below 8', () => {
    expect(generatePassword({ ...allOn, length: 7 }, zeroRandom).success).toBe(false);
  });
  it('blocks length above 64', () => {
    expect(generatePassword({ ...allOn, length: 65 }, zeroRandom).success).toBe(false);
  });
  it('blocks non-integer length', () => {
    expect(generatePassword({ ...allOn, length: 12.5 }, zeroRandom).success).toBe(false);
  });
});

describe('entropy and strength', () => {
  it('full pool 16 chars is Strong', () => {
    const bits = estimateEntropyBits(allOn);
    expect(bits).toBeGreaterThan(100);
    expect(strengthLabel(bits)).toBe('Strong');
  });
  it('labels Weak and Good correctly', () => {
    expect(strengthLabel(30)).toBe('Weak');
    expect(strengthLabel(70)).toBe('Good');
  });
  it('zero pool = zero bits', () => {
    expect(
      estimateEntropyBits({ length: 16, useLowercase: false, useUppercase: false, useNumbers: false, useSymbols: false })
    ).toBe(0);
  });
});
