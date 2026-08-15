import type { CalculationResult } from './types';

export interface DensityResult { density: number; mass: number; volume: number; }

export function calculateDensity(dStr: string, mStr: string, vStr: string): CalculationResult<DensityResult> {
  const hasD = dStr.trim() !== '';
  const hasM = mStr.trim() !== '';
  const hasV = vStr.trim() !== '';
  const filled = (hasD ? 1 : 0) + (hasM ? 1 : 0) + (hasV ? 1 : 0);
  if (filled !== 2) return { success: false, error: 'Enter exactly two values and leave one blank.' };

  const d = hasD ? Number(dStr) : 0;
  const m = hasM ? Number(mStr) : 0;
  const v = hasV ? Number(vStr) : 0;

  if ((hasD && !Number.isFinite(d)) || (hasM && !Number.isFinite(m)) || (hasV && !Number.isFinite(v))) {
    return { success: false, error: 'Enter valid numbers.' };
  }

  if (!hasD) {
    if (v === 0) return { success: false, error: 'Volume must be greater than zero.' };
    return { success: true, value: { density: m / v, mass: m, volume: v } };
  }
  if (!hasM) {
    return { success: true, value: { density: d, mass: d * v, volume: v } };
  }
  if (d === 0) return { success: false, error: 'Density must be greater than zero.' };
  return { success: true, value: { density: d, mass: m, volume: m / d } };
}
