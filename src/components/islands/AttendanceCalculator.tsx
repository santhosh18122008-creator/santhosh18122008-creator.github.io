import { useState } from 'react';
import { calculateAttendance, type AttendanceResult } from '../../lib/calculations/attendance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [target, setTarget] = useState('75');
  const [result, setResult] = useState<CalculationResult<AttendanceResult> | null>(null);
  const [errors, setErrors] = useState<{ attended?: string; total?: string; target?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(attended);
    const v2 = parseAndValidateNumber(total);
    const v3 = parseAndValidateNumber(target);

    const nextErrors: typeof errors = {};
    if (!v1.valid) nextErrors.attended = v1.error;
    if (!v2.valid) nextErrors.total = v2.error;
    if (!v3.valid) nextErrors.target = v3.error;

    setErrors(nextErrors);
    if (nextErrors.attended || nextErrors.total || nextErrors.target) {
      setResult(null);
      return;
    }

    setResult(calculateAttendance(v1.num as number, v2.num as number, v3.num as number));
  };

  const handleReset = () => {
    setAttended('');
    setTotal('');
    setTarget('75');
    setResult(null);
    setErrors({});
  };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="att-attended" className="mb-1 block text-sm font-medium">Classes attended</label>
          <input id="att-attended" type="text" inputMode="numeric" value={attended} onChange={(e) => setAttended(e.target.value)} className={inputClass(Boolean(errors.attended))} />
          {errors.attended && <p className="mt-1 text-xs text-red-600">{errors.attended}</p>}
        </div>
        <div>
          <label htmlFor="att-total" className="mb-1 block text-sm font-medium">Total classes</label>
          <input id="att-total" type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} className={inputClass(Boolean(errors.total))} />
          {errors.total && <p className="mt-1 text-xs text-red-600">{errors.total}</p>}
        </div>
        <div>
          <label htmlFor="att-target" className="mb-1 block text-sm font-medium">Target %</label>
          <input id="att-target" type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} className={inputClass(Boolean(errors.target))} />
          {errors.target && <p className="mt-1 text-xs text-red-600">{errors.target}</p>}
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600">Calculate</button>
        <button onClick={handleReset} className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800">Reset</button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="text-center">
                <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Current Attendance</p>
                <p className="text-3xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as AttendanceResult).currentPercentage)}%</p>
                {(result.value as AttendanceResult).status === 'below' && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                    You need <span className="font-bold">{(result.value as AttendanceResult).classesNeeded}</span> consecutive classes to reach your target.
                  </p>
                )}
                {(result.value as AttendanceResult).status === 'above' && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">
                    You can skip <span className="font-bold">{(result.value as AttendanceResult).classesSkippable}</span> class(es) and still meet your target.
                  </p>
                )}
                {(result.value as AttendanceResult).status === 'met' && (
                  <p className="mt-2 text-sm text-slate-700 dark:text-slate-200">You are exactly at your target.</p>
                )}
              </div>
            ) : (
              <p className="text-center font-medium text-red-600">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
