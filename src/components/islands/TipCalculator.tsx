import { useState } from 'react';
import { calculateTip, type TipResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('10');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<CalculationResult<TipResult> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(bill);
    const v2 = parseAndValidateNumber(tip);
    const v3 = parseAndValidateNumber(people);
    const nextErrors: Record<string, string> = {};
    if (!v1.valid) nextErrors.bill = v1.error as string;
    if (!v2.valid) nextErrors.tip = v2.error as string;
    if (!v3.valid) nextErrors.people = v3.error as string;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) { setResult(null); return; }
    setResult(calculateTip(v1.num as number, v2.num as number, v3.num as number));
  };

  const handleReset = () => { setBill(''); setTip('10'); setPeople('1'); setResult(null); setErrors({}); };

  const inputClass = (k: string) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (errors[k] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="tip-b" className="mb-1 block text-sm font-medium">Bill amount</label><input id="tip-b" type="text" inputMode="decimal" value={bill} onChange={(e) => setBill(e.target.value)} className={inputClass('bill')} />{errors.bill && <p className="mt-1 text-xs text-red-600">{errors.bill}</p>}</div>
        <div><label htmlFor="tip-p" className="mb-1 block text-sm font-medium">Tip (%)</label><input id="tip-p" type="text" inputMode="decimal" value={tip} onChange={(e) => setTip(e.target.value)} className={inputClass('tip')} />{errors.tip && <p className="mt-1 text-xs text-red-600">{errors.tip}</p>}</div>
        <div><label htmlFor="tip-n" className="mb-1 block text-sm font-medium">People</label><input id="tip-n" type="text" inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} className={inputClass('people')} />{errors.people && <p className="mt-1 text-xs text-red-600">{errors.people}</p>}</div>
      </div>
      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="btn-primary">Calculate</button>
        <button onClick={handleReset} className="btn-secondary">Reset</button>
      </div>
      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Tip</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TipResult).tip, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Total</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TipResult).total, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Per person</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TipResult).perPerson, 2)}</p></div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
