import { useState } from 'react';
import { calculateGrade, type GradeResult } from '../../lib/calculations/grade';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function GradeCalculator() {
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');
  const [result, setResult] = useState<CalculationResult<GradeResult> | null>(null);
  const [errors, setErrors] = useState<{ obtained?: string; total?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(obtained);
    const v2 = parseAndValidateNumber(total);

    const nextErrors: { obtained?: string; total?: string } = {};
    if (!v1.valid) nextErrors.obtained = v1.error;
    if (!v2.valid) nextErrors.total = v2.error;

    setErrors(nextErrors);
    if (nextErrors.obtained || nextErrors.total) {
      setResult(null);
      return;
    }

    setResult(calculateGrade(v1.num as number, v2.num as number));
  };

  const handleReset = () => {
    setObtained('');
    setTotal('');
    setResult(null);
    setErrors({});
  };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="grade-obtained" className="mb-1 block text-sm font-medium">
            Marks obtained
          </label>
          <input
            id="grade-obtained"
            type="text"
            inputMode="decimal"
            value={obtained}
            onChange={(e) => setObtained(e.target.value)}
            className={inputClass(Boolean(errors.obtained))}
          />
          {errors.obtained && <p className="mt-1 text-xs text-red-600">{errors.obtained}</p>}
        </div>
        <div>
          <label htmlFor="grade-total" className="mb-1 block text-sm font-medium">
            Maximum marks
          </label>
          <input
            id="grade-total"
            type="text"
            inputMode="decimal"
            value={total}
            onChange={(e) => setTotal(e.target.value)}
            className={inputClass(Boolean(errors.total))}
          />
          {errors.total && <p className="mt-1 text-xs text-red-600">{errors.total}</p>}
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={handleCalculate}
          className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          Calculate
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="text-center">
                <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Percentage</p>
                <p className="text-3xl font-bold tabular-nums text-brand-900 dark:text-brand-100">
                  {formatNumber((result.value as GradeResult).percentage)}%
                </p>
                <p className="mt-2 text-slate-700 dark:text-slate-200">
                  Grade:{' '}
                  <span className="rounded-md bg-brand-900 px-3 py-1 font-bold text-white dark:bg-brand-500">
                    {(result.value as GradeResult).grade}
                  </span>
                </p>
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
