import { useState } from 'react';
import { calculateSimpleInterest, type SimpleInterestResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function SimpleInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<SimpleInterestResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ principal?: string; rate?: string; years?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(principal);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const next: typeof errors = {};
    if (!v1.valid) next.principal = v1.error;
    if (!v2.valid) next.rate = v2.error;
    if (!v3.valid) next.years = v3.error;
    setErrors(next);
    if (next.principal || next.rate || next.years) { setResult(null); setError(''); return; }
    const r = calculateSimpleInterest(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as SimpleInterestResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setPrincipal(''); setRate(''); setYears(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="si-p" className="mb-1 block text-sm font-medium">Principal (P)</label>
          <input id="si-p" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={'field' + (errors.principal ? ' field-invalid' : '')} />
          {errors.principal && <p className="err-text">{errors.principal}</p>}
        </div>
        <div>
          <label htmlFor="si-r" className="mb-1 block text-sm font-medium">Rate (%/year)</label>
          <input id="si-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={'field' + (errors.rate ? ' field-invalid' : '')} />
          {errors.rate && <p className="err-text">{errors.rate}</p>}
        </div>
        <div>
          <label htmlFor="si-t" className="mb-1 block text-sm font-medium">Time (years)</label>
          <input id="si-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={'field' + (errors.years ? ' field-invalid' : '')} />
          {errors.years && <p className="err-text">{errors.years}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.interest, 2)} label="Interest earned" />
          <p className="text-center text-sm text-soft">Total amount: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.total, 2)}</span></p>
        </div>
      )}
    </div>
  );
}
