import { useState } from 'react';
import { calculateDiscount, type DiscountResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function DiscountCalculator() {
  const [price, setPrice] = useState('');
  const [discount, setDiscount] = useState('');
  const [result, setResult] = useState<DiscountResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ price?: string; discount?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(price);
    const v2 = parseAndValidateNumber(discount);
    const next: typeof errors = {};
    if (!v1.valid) next.price = v1.error;
    if (!v2.valid) next.discount = v2.error;
    setErrors(next);
    if (next.price || next.discount) { setResult(null); setError(''); return; }
    const r = calculateDiscount(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as DiscountResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setPrice(''); setDiscount(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="disc-price" className="mb-1 block text-sm font-medium">Original price</label>
          <input id="disc-price" type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={'field' + (errors.price ? ' field-invalid' : '')} />
          {errors.price && <p className="err-text">{errors.price}</p>}
        </div>
        <div>
          <label htmlFor="disc-pct" className="mb-1 block text-sm font-medium">Discount (%)</label>
          <input id="disc-pct" type="text" inputMode="decimal" value={discount} onChange={(e) => setDiscount(e.target.value)} className={'field' + (errors.discount ? ' field-invalid' : '')} />
          {errors.discount && <p className="err-text">{errors.discount}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.finalPrice, 2)} label="Final price" />
          <p className="text-center text-sm text-soft">You save <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.saved, 2)}</span></p>
        </div>
      )}
    </div>
  );
}
