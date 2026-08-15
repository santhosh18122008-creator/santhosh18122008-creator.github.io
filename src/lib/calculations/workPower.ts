import type { CalculationResult } from './types';

export interface WorkPowerResult { work: number; power: number; }

export function calculateWorkPower(
  force: number, distance: number, time: number
): CalculationResult<WorkPowerResult> {
  if (![force, distance, time].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (force < 0 || distance < 0) return { success: false, error: 'Force and distance cannot be negative.' };
  if (time <= 0) return { success: false, error: 'Time must be greater than zero.' };
  const work = force * distance;
  const power = work / time;
  return { success: true, value: { work, power } };
}
