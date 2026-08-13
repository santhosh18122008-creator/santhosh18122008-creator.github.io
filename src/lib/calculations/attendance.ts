import type { CalculationResult } from './types';

export interface AttendanceResult {
  currentPercentage: number;
  status: 'met' | 'below' | 'above';
  classesNeeded?: number;
  classesSkippable?: number;
}

export function calculateAttendance(
  attended: number,
  total: number,
  targetPercentage: number
): CalculationResult<AttendanceResult> {
  if (!Number.isFinite(attended) || !Number.isFinite(total) || !Number.isFinite(targetPercentage)) {
    return { success: false, error: 'Invalid input values.' };
  }
  if (attended < 0 || total <= 0) {
    return { success: false, error: 'Classes must be positive numbers (total must be > 0).' };
  }
  if (attended > total) {
    return { success: false, error: 'Classes attended cannot exceed total classes.' };
  }
  if (targetPercentage <= 0 || targetPercentage > 100) {
    return { success: false, error: 'Target percentage must be between 1 and 100.' };
  }

  const currentPercentage = (attended / total) * 100;
  
  if (currentPercentage >= targetPercentage) {
    const skippable = Math.floor((100 * attended - targetPercentage * total) / targetPercentage);
    return {
      success: true,
      value: {
        currentPercentage,
        status: skippable > 0 ? 'above' : 'met',
        classesSkippable: skippable > 0 ? skippable : 0,
      },
    };
  } else {
    const needed = Math.ceil((targetPercentage * total - 100 * attended) / (100 - targetPercentage));
    return {
      success: true,
      value: {
        currentPercentage,
        status: 'below',
        classesNeeded: needed > 0 ? needed : 0,
      },
    };
  }
}
