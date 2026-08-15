import type { CalculationResult } from './types';

export interface PaceResult { paceSeconds: number; paceFormatted: string; speedKmh: number; }

export function calculatePace(timeMinutes: number, distance: number, unit: 'km' | 'mi'): CalculationResult<PaceResult> {
  if (![timeMinutes, distance].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (timeMinutes <= 0) return { success: false, error: 'Time must be greater than zero.' };
  if (distance <= 0) return { success: false, error: 'Distance must be greater than zero.' };

  const paceMinutes = timeMinutes / distance;
  const paceSecondsTotal = paceMinutes * 60;
  const mins = Math.floor(paceMinutes);
  const secs = Math.round((paceMinutes - mins) * 60);
  
  const distanceKm = unit === 'mi' ? distance * 1.60934 : distance;
  const speedKmh = distanceKm / (timeMinutes / 60);

  return {
    success: true,
    value: {
      paceSeconds: paceSecondsTotal,
      paceFormatted: `${mins}:${secs.toString().padStart(2, '0')}`,
      speedKmh
    }
  };
}
