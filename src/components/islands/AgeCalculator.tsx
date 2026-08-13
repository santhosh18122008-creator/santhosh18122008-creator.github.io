import { useState } from 'react';
import { calculateAge, parseIsoDate, type AgeResult } from '../../lib/calculations/dates';
import type { CalculationResult } from '../../lib/calculations/types';
import { formatNumber } from '../../lib/formatting/number';

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [birth, setBirth] = useState('');
  const [asOf, setAsOf] = useState(today);
  const [result, setResult] = useState<CalculationResult<AgeResult> | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const b = parseIsoDate(birth);
    const a = parseIsoDate(asOf);
    if (!b || !a) {
      setError('Please choose valid dates.');
      setResult(null);
      return;
    }
    const res = calculateAge(b, a);
    if (res.success) { setResult(res); setError(''); }
    else { setResult(null); setError(res.error as string); }
  };

  const handleReset = () => { setBirth(''); setAsOf(today); setResult(null); setError(''); };

  const inputClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="age-birth" className="mb-1 block text-sm font-medium">Date of birth</label>
          <input id="age-birth" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label htmlFor="age-asof" className="mb-1 block text-sm font-medium">Age at this date</label>
          <input id="age-asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className={inputClass} />
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600">Calculate Age</button>
        <button onClick={handleReset} className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800">Reset</button>
      </div>

      <div aria-live="polite">
        {error && <p className="text-center font-medium text-red-600">{error}</p>}
        {result && result.success && (
          <div className="rounded-md bg-slate-100 p-4 text-center dark:bg-slate-800">
            <p className="text-2xl font-bold text-brand-900 dark:text-brand-100">
              {(result.value as AgeResult).years} years, {(result.value as AgeResult).months} months, {(result.value as AgeResult).days} days
            </p>
            <div className="mt-3 flex justify-center gap-6 text-sm text-slate-600 dark:text-slate-300">
              <span>Total days: <strong className="tabular-nums">{formatNumber((result.value as AgeResult).totalDays)}</strong></span>
              <span>Next birthday in: <strong className="tabular-nums">{(result.value as AgeResult).daysUntilNextBirthday} days</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
