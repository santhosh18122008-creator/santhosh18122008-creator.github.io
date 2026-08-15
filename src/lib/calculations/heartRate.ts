import type { CalculationResult } from './types';

export interface HrZones { z1: [number, number]; z2: [number, number]; z3: [number, number]; z4: [number, number]; z5: [number, number]; maxHr: number; }

export function calculateHeartRateZones(age: number, restingHr: number): CalculationResult<HrZones> {
  if (![age, restingHr].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (age <= 0 || age > 120) return { success: false, error: 'Age must be between 1 and 120.' };
  if (restingHr < 30 || restingHr > 120) return { success: false, error: 'Resting heart rate should be between 30 and 120 bpm.' };
  
  const maxHr = 220 - age;
  if (restingHr >= maxHr) return { success: false, error: 'Resting heart rate cannot be higher than maximum heart rate.' };
  
  const reserve = maxHr - restingHr;
  const zone = (lowPct: number, highPct: number): [number, number] => [
    Math.round(restingHr + reserve * lowPct),
    Math.round(restingHr + reserve * highPct)
  ];

  return {
    success: true,
    value: {
      z1: zone(0.50, 0.60),
      z2: zone(0.60, 0.70),
      z3: zone(0.70, 0.80),
      z4: zone(0.80, 0.90),
      z5: zone(0.90, 1.00),
      maxHr
    }
  };
}
