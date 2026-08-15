import type { CalculationResult } from './types';

export interface ProjectileResult { range: number; maxHeight: number; flightTime: number; }

export function calculateProjectile(
  velocity: number, angleDeg: number, gravity: number = 9.81
): CalculationResult<ProjectileResult> {
  if (![velocity, angleDeg, gravity].every(Number.isFinite)) return { success: false, error: 'Invalid input values.' };
  if (velocity < 0) return { success: false, error: 'Velocity cannot be negative.' };
  if (angleDeg < 0 || angleDeg > 90) return { success: false, error: 'Angle must be between 0 and 90 degrees.' };
  if (gravity <= 0) return { success: false, error: 'Gravity must be greater than zero.' };

  const rad = (angleDeg * Math.PI) / 180;
  const sinA = Math.sin(rad);
  const cosA = Math.cos(rad);

  const range = (velocity * velocity * Math.sin(2 * rad)) / gravity;
  const maxHeight = (velocity * velocity * sinA * sinA) / (2 * gravity);
  const flightTime = (2 * velocity * sinA) / gravity;

  return { success: true, value: { range, maxHeight, flightTime } };
}
