import { useState } from 'react';
import { calculateSimpleInterest, type SimpleInterestResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<CalculationResult<SimpleInterestResult> | null>(null);
  const [errors, setErrors] = useState<{ principal?: string; rate?: string; years?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(principal);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const nextErrors: typeof errors = {};
    if (!v1.valid) nextErrors.principal = v1.error;
    if (!v2.valid) nextErrors.rate = v2.error;
    if (!v3.valid) nextErrors.years = v3.error;
    setErrors(nextErrors);
    if (nextErrors.principal || nextErrors.rate || nextErrors.years) { setResult(null); return; }
    setResult(calculateSimpleInterest(v1.num as number, v2.num as number, v3.num as number));
  };

  const handleReset = () => { setPrincipal(''); setRate(''); setYears(''); setResult(null); setErrors({}); };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="si-p" className="mb-1 block text-sm font-medium">Principal (P)</label>
          <input id="si-p" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClass(Boolean(errors.principal))} />
          {errors.principal && <p className="mt-1 text-xs text-red-600">{errors.principal}</p>}
        </div>
        <div>
          <label htmlFor="si-r" className="mb-1 block text-sm font-medium">Rate (% per year)</label>
          <input id="si-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass(Boolean(errors.rate))} />
          {errors.rate && <p className="mt-1 text-xs text-red-600">{errors.rate}</p>}
        </div>
        <div>
          <label htmlFor="si-t" className="mb-1 block text-sm font-medium">Time (years)</label>
          <input id="si-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass(Boolean(errors.years))} />
          {errors.years && <p className="mt-1 text-xs text-red-600">{errors.years}</p>}
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
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Interest earned</p>
                  <p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as SimpleInterestResult).interest, 2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Total amount</p>
                  <p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as SimpleInterestResult).total, 2)}</p>
                </div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
