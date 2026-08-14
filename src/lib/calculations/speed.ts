import type { CalculationResult } from './types';

export interface SpeedResult { speed: number; distance: number; time: number; }

export function calculateSpeedDistanceTime(sStr: string, dStr: string, tStr: string): CalculationResult<SpeedResult> {
  const hasS = sStr.trim() !== '';
  const hasD = dStr.trim() !== '';
  const hasT = tStr.trim() !== '';
  const filled = (hasS ? 1 : 0) + (hasD ? 1 : 0) + (hasT ? 1 : 0);
  if (filled !== 2) return { success: false, error: 'Enter exactly two values and leave one blank.' };

  const speed = hasS ? Number(sStr) : 0;
  const distance = hasD ? Number(dStr) : 0;
  const time = hasT ? Number(tStr) : 0;

  if ((hasS && !Number.isFinite(speed)) || (hasD && !Number.isFinite(distance)) || (hasT && !Number.isFinite(time))) {
    return { success: false, error: 'Enter valid numbers.' };
  }
  if (distance < 0 || speed < 0 || time < 0) return { success: false, error: 'Values cannot be negative.' };

  if (!hasS) {
    if (time === 0) return { success: false, error: 'Time must be greater than zero.' };
    return { success: true, value: { speed: distance / time, distance, time } };
  }
  if (!hasD) {
    return { success: true, value: { speed, distance: speed * time, time } };
  }
  if (speed === 0) return { success: false, error: 'Speed must be greater than zero.' };
  return { success: true, value: { speed, distance, time: distance / speed } };
}
