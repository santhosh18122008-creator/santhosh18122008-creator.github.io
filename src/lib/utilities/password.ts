import type { CalculationResult } from '../calculations/types';

export interface PasswordOptions {
  length: number;
  useLowercase: boolean;
  useUppercase: boolean;
  useNumbers: boolean;
  useSymbols: boolean;
}

export const CHARSETS = {
  lowercase: 'abcdefghijklmnopqrstuvwxyz',
  uppercase: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
  numbers: '0123456789',
  symbols: '!@#$%^&*()-_=+[]{};:,.<>?',
} as const;

export const MIN_LENGTH = 8;
export const MAX_LENGTH = 64;

export function getPoolSize(options: PasswordOptions): number {
  let size = 0;
  if (options.useLowercase) size += CHARSETS.lowercase.length;
  if (options.useUppercase) size += CHARSETS.uppercase.length;
  if (options.useNumbers) size += CHARSETS.numbers.length;
  if (options.useSymbols) size += CHARSETS.symbols.length;
  return size;
}

export function estimateEntropyBits(options: PasswordOptions): number {
  const pool = getPoolSize(options);
  if (pool === 0) return 0;
  return Math.round(options.length * Math.log2(pool));
}

export function strengthLabel(bits: number): 'Weak' | 'Good' | 'Strong' {
  if (bits < 60) return 'Weak';
  if (bits < 90) return 'Good';
  return 'Strong';
}

export function generatePassword(
  options: PasswordOptions,
  randomInt: (max: number) => number
): CalculationResult<string> {
  if (!Number.isInteger(options.length) || options.length < MIN_LENGTH || options.length > MAX_LENGTH) {
    return { success: false, error: 'Length must be a whole number between 8 and 64.' };
  }

  const selectedSets: string[] = [];
  if (options.useLowercase) selectedSets.push(CHARSETS.lowercase);
  if (options.useUppercase) selectedSets.push(CHARSETS.uppercase);
  if (options.useNumbers) selectedSets.push(CHARSETS.numbers);
  if (options.useSymbols) selectedSets.push(CHARSETS.symbols);

  if (selectedSets.length === 0) {
    return { success: false, error: 'Select at least one character type.' };
  }

  const pool = selectedSets.join('');
  const chars: string[] = [];

  for (const set of selectedSets) {
    if (chars.length < options.length) {
      chars.push(set[randomInt(set.length)]);
    }
  }

  while (chars.length < options.length) {
    chars.push(pool[randomInt(pool.length)]);
  }

  for (let i = chars.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    const tmp = chars[i];
    chars[i] = chars[j];
    chars[j] = tmp;
  }

  return { success: true, value: chars.join('') };
}
