import type { CalculationResult } from '../calculations/types';

export interface RgbColor { r: number; g: number; b: number; }

export function hexToRgb(hex: string): CalculationResult<RgbColor> {
  const clean = hex.replace(/^#/, '');
  if (!/^[0-9A-Fa-f]{6}$/.test(clean)) {
    return { success: false, error: 'Enter a valid 6-digit hex code (e.g. 2F5D8A).' };
  }
  return { success: true, value: {
    r: parseInt(clean.substring(0, 2), 16),
    g: parseInt(clean.substring(2, 4), 16),
    b: parseInt(clean.substring(4, 6), 16),
  }};
}

export function rgbToHex(r: number, g: number, b: number): CalculationResult<string> {
  if (![r, g, b].every((v) => Number.isInteger(v) && v >= 0 && v <= 255)) {
    return { success: false, error: 'RGB values must be whole numbers between 0 and 255.' };
  }
  const toHex = (v: number) => v.toString(16).padStart(2, '0').toUpperCase();
  return { success: true, value: '#' + toHex(r) + toHex(g) + toHex(b) };
}
