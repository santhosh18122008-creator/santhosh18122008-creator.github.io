import { useState } from 'react';
import { calculateSip, type SipResult } from '../../lib/calculations/sip';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function SipCalculator() {
  const [monthly, setMonthly] = useState('5000');
  const [rate, setRate] = useState('12');
  const [years, setYears] = useState('10');
  const [result, setResult] = useState<SipResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(monthly);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const next: Record<string, string> = {};
    if (!v1.valid) next.monthly = v1.error as string;
    if (!v2.valid) next.rate = v2.error as string;
    if (!v3.valid) next.years = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateSip(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as SipResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setMonthly('5000'); setRate('12'); setYears('10'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="sip-m" className="mb-1 block text-sm font-medium">Monthly investment</label><input id="sip-m" type="text" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={'field' + (errors.monthly ? ' field-invalid' : '')} />{errors.monthly && <p className="err-text">{errors.monthly}</p>}</div>
        <div><label htmlFor="sip-r" className="mb-1 block text-sm font-medium">Expected return (%/year)</label><input id="sip-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={'field' + (errors.rate ? ' field-invalid' : '')} />{errors.rate && <p className="err-text">{errors.rate}</p>}</div>
        <div><label htmlFor="sip-t" className="mb-1 block text-sm font-medium">Time (years)</label><input id="sip-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={'field' + (errors.years ? ' field-invalid' : '')} />{errors.years && <p className="err-text">{errors.years}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.totalValue, 0)} label="Total value at maturity" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Invested: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.invested, 0)}</span></span>
            <span>Returns: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.estimatedReturns, 0)}</span></span>
          </div>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your SIP details above to see the projected value.</p>
      )}
    </div>
  );
}
