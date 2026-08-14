import { useState } from 'react';
import { calculateTax, type TaxResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function GstCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('18');
  const [mode, setMode] = useState<'add' | 'extract'>('add');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(amount);
    const v2 = parseAndValidateNumber(rate);
    const next: Record<string, string> = {};
    if (!v1.valid) next.amount = v1.error as string;
    if (!v2.valid) next.rate = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateTax(v1.num as number, v2.num as number, mode);
    if (r.success) { setResult(r.value as TaxResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setAmount(''); setRate('18'); setMode('add'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode('add')} aria-pressed={mode === 'add'} className={'cat-btn ' + (mode === 'add' ? 'is-active' : '')}>Add tax to price</button>
        <button onClick={() => setMode('extract')} aria-pressed={mode === 'extract'} className={'cat-btn ' + (mode === 'extract' ? 'is-active' : '')}>Extract tax from price</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="gst-a" className="mb-1 block text-sm font-medium">{mode === 'add' ? 'Price (before tax)' : 'Price (tax included)'}</label><input id="gst-a" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={'field' + (errors.amount ? ' field-invalid' : '')} />{errors.amount && <p className="err-text">{errors.amount}</p>}</div>
        <div><label htmlFor="gst-r" className="mb-1 block text-sm font-medium">Tax rate (%)</label><input id="gst-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={'field' + (errors.rate ? ' field-invalid' : '')} />{errors.rate && <p className="err-text">{errors.rate}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.tax, 2)} label="Tax amount" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Base price: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.base, 2)}</span></span>
            <span>Total: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.total, 2)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
