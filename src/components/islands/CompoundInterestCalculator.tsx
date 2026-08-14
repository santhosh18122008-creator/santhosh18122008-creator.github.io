import { useState } from 'react';
import { calculateCompoundInterest, type CompoundInterestResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function CompoundInterestCalculator() {
  const [principal, setPrincipal] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [freq, setFreq] = useState(12);
  const [result, setResult] = useState<CompoundInterestResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(principal);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const next: Record<string, string> = {};
    if (!v1.valid) next.principal = v1.error as string;
    if (!v2.valid) next.rate = v2.error as string;
    if (!v3.valid) next.years = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateCompoundInterest(v1.num as number, v2.num as number, v3.num as number, freq);
    if (r.success) { setResult(r.value as CompoundInterestResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setPrincipal(''); setRate(''); setYears(''); setFreq(12); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div><label htmlFor="ci-p" className="mb-1 block text-sm font-medium">Principal</label><input id="ci-p" type="text" inputMode="decimal" value={principal} onChange={(e) => setPrincipal(e.target.value)} className={'field' + (errors.principal ? ' field-invalid' : '')} />{errors.principal && <p className="err-text">{errors.principal}</p>}</div>
        <div><label htmlFor="ci-r" className="mb-1 block text-sm font-medium">Rate (%/year)</label><input id="ci-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={'field' + (errors.rate ? ' field-invalid' : '')} />{errors.rate && <p className="err-text">{errors.rate}</p>}</div>
        <div><label htmlFor="ci-t" className="mb-1 block text-sm font-medium">Time (years)</label><input id="ci-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={'field' + (errors.years ? ' field-invalid' : '')} />{errors.years && <p className="err-text">{errors.years}</p>}</div>
        <div><label htmlFor="ci-n" className="mb-1 block text-sm font-medium">Compounding</label>
          <select id="ci-n" value={freq} onChange={(e) => setFreq(Number(e.target.value))} className="field">
            <option value={1}>Yearly</option><option value={2}>Semi-annually</option><option value={4}>Quarterly</option><option value={12}>Monthly</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.amount, 2)} label="Total amount" />
          <p className="text-center text-sm text-soft">Interest earned: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.interest, 2)}</span></p>
        </div>
      )}
    </div>
  );
}
