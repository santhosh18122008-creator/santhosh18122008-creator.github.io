import type { CalculationResult } from './types';

export interface OhmsLawResult {
  voltage: number;
  current: number;
  resistance: number;
}

export function calculateOhmsLaw(
  vStr: string,
  iStr: string,
  rStr: string
): CalculationResult<OhmsLawResult> {
  const hasV = vStr.trim() !== '';
  const hasI = iStr.trim() !== '';
  const hasR = rStr.trim() !== '';
  const filledCount = (hasV ? 1 : 0) + (hasI ? 1 : 0) + (hasR ? 1 : 0);

  if (filledCount !== 2) {
    return { success: false, error: 'Please enter exactly two values and leave one blank to calculate.' };
  }

  const numV = hasV ? Number(vStr) : 0;
  const numI = hasI ? Number(iStr) : 0;
  const numR = hasR ? Number(rStr) : 0;

  if ((hasV && !Number.isFinite(numV)) || (hasI && !Number.isFinite(numI)) || (hasR && !Number.isFinite(numR))) {
    return { success: false, error: 'Please enter valid numbers.' };
  }

  if (hasV && hasI && !hasR) {
    if (numI === 0) return { success: false, error: 'Current cannot be zero when calculating Resistance.' };
    return { success: true, value: { voltage: numV, current: numI, resistance: numV / numI } };
  }
  if (hasV && hasR && !hasI) {
    if (numR === 0) return { success: false, error: 'Resistance cannot be zero when calculating Current.' };
    return { success: true, value: { voltage: numV, current: numV / numR, resistance: numR } };
  }
  if (hasI && hasR && !hasV) {
    return { success: true, value: { voltage: numI * numR, current: numI, resistance: numR } };
  }

  return { success: false, error: 'Unable to calculate.' };
}

export interface EnergyResult {
  energy: number;
}

export function calculateKineticEnergy(mass: number, velocity: number): CalculationResult<EnergyResult> {
  if (!Number.isFinite(mass) || !Number.isFinite(velocity)) return { success: false, error: 'Invalid input values.' };
  if (mass < 0) return { success: false, error: 'Mass cannot be negative.' };
  return { success: true, value: { energy: 0.5 * mass * Math.pow(velocity, 2) } };
}

export function calculatePotentialEnergy(mass: number, height: number, gravity: number = 9.81): CalculationResult<EnergyResult> {
  if (!Number.isFinite(mass) || !Number.isFinite(height) || !Number.isFinite(gravity)) return { success: false, error: 'Invalid input values.' };
  if (mass < 0) return { success: false, error: 'Mass cannot be negative.' };
  if (gravity <= 0) return { success: false, error: 'Gravity must be greater than zero.' };
  return { success: true, value: { energy: mass * gravity * height } };
}
