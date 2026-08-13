import { useState } from 'react';
import { calculateCompoundInterest, type CompoundInterestResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [freq, setFreq] = useState(12);
  const [result, setResult] = useState<CalculationResult<CompoundInterestResult> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(principal);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const nextErrors: Record<string, string> = {};
    if (!v1.valid) nextErrors.principal = v1.error as string;
    if (!v2.valid) nextErrors.rate = v2.error as string;
    if (!v3.valid) nextErrors.years = v3.error as string;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) { setResult(null); return; }
    setResult(calculateCompoundInterest(v1.num as number, v2.num as number, v3.num as number, freq));
  };

  const handleReset = () => { setPrincipal(''); setRate(''); setYears(''); setFreq(12); setResult(null); setErrors({}); };

  const inputClass = (k: string) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (errors[k] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label htmlFor="ci-p" className="mb-1 block text-sm font-medium">Principal</label><input id="ci-p" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={inputClass('principal')} />{errors.principal && <p className="mt-1 text-xs text-red-600">{errors.principal}</p>}</div>
        <div><label htmlFor="ci-r" className="mb-1 block text-sm font-medium">Rate (%/year)</label><input id="ci-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass('rate')} />{errors.rate && <p className="mt-1 text-xs text-red-600">{errors.rate}</p>}</div>
        <div><label htmlFor="ci-t" className="mb-1 block text-sm font-medium">Time (years)</label><input id="ci-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass('years')} />{errors.years && <p className="mt-1 text-xs text-red-600">{errors.years}</p>}</div>
        <div><label htmlFor="ci-n" className="mb-1 block text-sm font-medium">Compounding</label>
          <select id="ci-n" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className={inputClass('')}>
            <option value={1}>Yearly</option><option value={2}>Semi-annually</option><option value={4}>Quarterly</option><option value={12}>Monthly</option>
          </select>
        </div>
      </div>
      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="btn-primary">Calculate</button>
        <button onClick={handleReset} className="btn-secondary">Reset</button>
      </div>
      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="grid grid-cols-2 gap-3 text-center">
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Interest earned</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as CompoundInterestResult).interest, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Total amount</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as CompoundInterestResult).amount, 2)}</p></div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
