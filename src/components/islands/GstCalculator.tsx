import { useState } from 'react';
import { calculateTax, type TaxResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'extract'>('add');
  const [result, setResult] = useState<CalculationResult<TaxResult> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(amount);
    const v2 = parseAndValidateNumber(rate);
    const nextErrors: Record<string, string> = {};
    if (!v1.valid) nextErrors.amount = v1.error as string;
    if (!v2.valid) nextErrors.rate = v2.error as string;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) { setResult(null); return; }
    setResult(calculateTax(v1.num as number, v2.num as number, mode));
  };

  const handleReset = () => { setAmount(''); setRate('18'); setMode('add'); setResult(null); setErrors({}); };

  const inputClass = (k: string) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (errors[k] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-wrap gap-2">
        <button onClick={() => setMode('add')} aria-pressed={mode === 'add'} className={'rounded-md px-4 py-2 text-sm font-medium ' + (mode === 'add' ? 'bg-brand-900 text-white dark:bg-brand-500' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800')}>Add tax to price</button>
        <button onClick={() => setMode('extract')} aria-pressed={mode === 'extract'} className={'rounded-md px-4 py-2 text-sm font-medium ' + (mode === 'extract' ? 'bg-brand-900 text-white dark:bg-brand-500' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800')}>Extract tax from price</button>
      </div>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="gst-a" className="mb-1 block text-sm font-medium">{mode === 'add' ? 'Price (before tax)' : 'Price (tax included)'}</label><input id="gst-a" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass('amount')} />{errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}</div>
        <div><label htmlFor="gst-r" className="mb-1 block text-sm font-medium">Tax rate (%)</label><input id="gst-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass('rate')} />{errors.rate && <p className="mt-1 text-xs text-red-600">{errors.rate}</p>}</div>
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
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Base price</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TaxResult).base, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Tax</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TaxResult).tax, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Total</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as TaxResult).total, 2)}</p></div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
