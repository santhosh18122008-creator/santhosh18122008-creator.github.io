import { useState } from 'react';
import { calculateBreakEven, type BreakEvenResult } from '../../lib/calculations/breakeven';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function BreakEvenCalculator() {
  const [fixed, setFixed] = useState('10000');
  const [price, setPrice] = useState('50');
  const [variable, setVariable] = useState('30');
  const [result, setResult] = useState<BreakEvenResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(fixed);
    const v2 = parseAndValidateNumber(price);
    const v3 = parseAndValidateNumber(variable);
    const next: Record<string, string> = {};
    if (!v1.valid) next.fixed = v1.error as string;
    if (!v2.valid) next.price = v2.error as string;
    if (!v3.valid) next.variable = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateBreakEven(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as BreakEvenResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setFixed('10000'); setPrice('50'); setVariable('30'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="be-f" className="mb-1 block text-sm font-medium">Fixed costs (per period)</label><input id="be-f" type="text" inputMode="decimal" value={fixed} onChange={(e) => setFixed(e.target.value)} className={'field' + (errors.fixed ? ' field-invalid' : '')} />{errors.fixed && <p className="err-text">{errors.fixed}</p>}</div>
        <div><label htmlFor="be-p" className="mb-1 block text-sm font-medium">Price per unit</label><input id="be-p" type="text" inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} className={'field' + (errors.price ? ' field-invalid' : '')} />{errors.price && <p className="err-text">{errors.price}</p>}</div>
        <div><label htmlFor="be-v" className="mb-1 block text-sm font-medium">Variable cost per unit</label><input id="be-v" type="text" inputMode="decimal" value={variable} onChange={(e) => setVariable(e.target.value)} className={'field' + (errors.variable ? ' field-invalid' : '')} />{errors.variable && <p className="err-text">{errors.variable}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(Math.ceil(result.units), 0)} suffix="units" label="Break-even volume" />
          <p className="text-center text-sm text-soft">Break-even revenue: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.revenue, 0)}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your fixed costs and per-unit economics above.</p>
      )}
    </div>
  );
}
