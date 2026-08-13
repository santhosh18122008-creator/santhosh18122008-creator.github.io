import { useState } from 'react';
import { calculateDiscount, type DiscountResult } from '../../lib/calculations/finance';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<CalculationResult<DiscountResult> | null>(null);
  const [errors, setErrors] = useState<{ price?: string; discount?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(price);
    const v2 = parseAndValidateNumber(discount);
    const nextErrors: typeof errors = {};
    if (!v1.valid) nextErrors.price = v1.error;
    if (!v2.valid) nextErrors.discount = v2.error;
    setErrors(nextErrors);
    if (nextErrors.price || nextErrors.discount) { setResult(null); return; }
    setResult(calculateDiscount(v1.num as number, v2.num as number));
  };

  const handleReset = () => { setPrice(''); setDiscount(''); setResult(null); setErrors({}); };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="disc-price" className="mb-1 block text-sm font-medium">Original price</label>
          <input id="disc-price" type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={inputClass(Boolean(errors.price))} />
          {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="disc-pct" className="mb-1 block text-sm font-medium">Discount (%)</label>
          <input id="disc-pct" type="text" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} className={inputClass(Boolean(errors.discount))} />
          {errors.discount && <p className="mt-1 text-xs text-red-600">{errors.discount}</p>}
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
                  <p className="text-sm text-slate-600 dark:text-slate-300">You save</p>
                  <p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as DiscountResult).saved, 2)}</p>
                </div>
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-300">Final price</p>
                  <p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as DiscountResult).finalPrice, 2)}</p>
                </div>
              </div>
            ) : <p className="text-center font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
