import type { CalculationResult } from './types';

export function addTime(timeStr: string, hours: number, minutes: number, mode: 'add' | 'subtract'): CalculationResult<string> {
  const match = /^(\d{1,2}):(\d{2})$/.exec(timeStr.trim());
  if (!match) return { success: false, error: 'Enter a valid time like 14:30.' };
  let h = parseInt(match[1], 10);
  let m = parseInt(match[2], 10);
  if (h < 0 || h > 23 || m < 0 || m > 59) return { success: false, error: 'Hours must be 0-23, minutes 0-59.' };
  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) return { success: false, error: 'Invalid duration values.' };

  let totalMins = h * 60 + m;
  const delta = Math.round(hours * 60 + minutes);
  totalMins = mode === 'add' ? totalMins + delta : totalMins - delta;

  totalMins = ((totalMins % 1440) + 1440) % 1440;
  const hh = Math.floor(totalMins / 60).toString().padStart(2, '0');
  const mm = (totalMins % 60).toString().padStart(2, '0');
  return { success: true, value: `${hh}:${mm}` };
}
