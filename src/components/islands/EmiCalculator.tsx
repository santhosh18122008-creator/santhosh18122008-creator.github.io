import { useState } from 'react';
import { calculateEmi, type EmiResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function EmiCalculator() {
  const [amount, setAmount] = useState('');
  const [rate, setRate] = useState('');
  const [years, setYears] = useState('');
  const [result, setResult] = useState<EmiResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(amount);
    const v2 = parseAndValidateNumber(rate);
    const v3 = parseAndValidateNumber(years);
    const next: Record<string, string> = {};
    if (!v1.valid) next.amount = v1.error as string;
    if (!v2.valid) next.rate = v2.error as string;
    if (!v3.valid) next.years = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const months = Math.round((v3.num as number) * 12);
    const r = calculateEmi(v1.num as number, v2.num as number, months);
    if (r.success) { setResult(r.value as EmiResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setAmount(''); setRate(''); setYears(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="emi-a" className="mb-1 block text-sm font-medium">Loan amount</label><input id="emi-a" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className={'field' + (errors.amount ? ' field-invalid' : '')} />{errors.amount && <p className="err-text">{errors.amount}</p>}</div>
        <div><label htmlFor="emi-r" className="mb-1 block text-sm font-medium">Rate (%/year)</label><input id="emi-r" type="text" inputMode="decimal" value={rate} onChange={(e) => setRate(e.target.value)} className={'field' + (errors.rate ? ' field-invalid' : '')} />{errors.rate && <p className="err-text">{errors.rate}</p>}</div>
        <div><label htmlFor="emi-t" className="mb-1 block text-sm font-medium">Tenure (years)</label><input id="emi-t" type="text" inputMode="decimal" value={years} onChange={(e) => setYears(e.target.value)} className={'field' + (errors.years ? ' field-invalid' : '')} />{errors.years && <p className="err-text">{errors.years}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate EMI</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.emi, 2)} label="Monthly EMI" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Total interest: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.totalInterest, 2)}</span></span>
            <span>Total payment: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.totalPayment, 2)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
