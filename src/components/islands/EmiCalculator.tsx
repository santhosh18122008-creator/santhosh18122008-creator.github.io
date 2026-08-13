import { useState } from 'react';
import { calculateEmi, type EmiResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function EmiCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<CalculationResult<EmiResult> | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(amount);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const nextErrors: Record<string, string> = {};
    if (!v1.valid) nextErrors.amount = v1.error as string;
    if (!v2.valid) nextErrors.rate = v2.error as string;
    if (!v3.valid) nextErrors.years = v3.error as string;
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) { setResult(null); return; }
    const months = Math.round((v3.num as number) * 12);
    setResult(calculateEmi(v1.num as number, v2.num as number, months));
  };

  const handleReset = () => { setAmount(''); setRate(''); setYears(''); setResult(null); setErrors({}); };

  const inputClass = (k: string) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (errors[k] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="emi-a" className="mb-1 block text-sm font-medium">Loan amount</label><input id="emi-a" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={inputClass('amount')} />{errors.amount && <p className="mt-1 text-xs text-red-600">{errors.amount}</p>}</div>
        <div><label htmlFor="emi-r" className="mb-1 block text-sm font-medium">Rate (%/year)</label><input id="emi-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={inputClass('rate')} />{errors.rate && <p className="mt-1 text-xs text-red-600">{errors.rate}</p>}</div>
        <div><label htmlFor="emi-t" className="mb-1 block text-sm font-medium">Tenure (years)</label><input id="emi-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={inputClass('years')} />{errors.years && <p className="mt-1 text-xs text-red-600">{errors.years}</p>}</div>
      </div>
      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="btn-primary">Calculate EMI</button>
        <button onClick={handleReset} className="btn-secondary">Reset</button>
      </div>
      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="grid grid-cols-3 gap-3 text-center">
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Monthly EMI</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as EmiResult).emi, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Total interest</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as EmiResult).totalInterest, 2)}</p></div>
                <div><p className="text-sm text-slate-600 dark:text-slate-300">Total payment</p><p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as EmiResult).totalPayment, 2)}</p></div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
