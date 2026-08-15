import { useState } from 'react';
import { calculateFire, type FireResult } from '../../lib/calculations/fire';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function FireCalculator() {
  const [savings, setSavings] = useState('0');
  const [monthly, setMonthly] = useState('2000');
  const [expenses, setExpenses] = useState('40000');
  const [returnPct, setReturnPct] = useState('7');
  const [result, setResult] = useState<FireResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(savings);
    const v2 = parseAndValidateNumber(monthly);
    const v3 = parseAndValidateNumber(expenses);
    const v4 = parseAndValidateNumber(returnPct);
    const next: Record<string, string> = {};
    if (!v1.valid) next.savings = v1.error as string;
    if (!v2.valid) next.monthly = v2.error as string;
    if (!v3.valid) next.expenses = v3.error as string;
    if (!v4.valid) next.returnPct = v4.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateFire(v1.num as number, v2.num as number, v3.num as number, v4.num as number);
    if (r.success) { setResult(r.value as FireResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setSavings('0'); setMonthly('2000'); setExpenses('40000'); setReturnPct('7'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="fire-s" className="mb-1 block text-sm font-medium">Current savings</label><input id="fire-s" type="text" inputMode="decimal" value={savings} onChange={(e) => setSavings(e.target.value)} className={'field' + (errors.savings ? ' field-invalid' : '')} />{errors.savings && <p className="err-text">{errors.savings}</p>}</div>
        <div><label htmlFor="fire-m" className="mb-1 block text-sm font-medium">Monthly contribution</label><input id="fire-m" type="text" inputMode="decimal" value={monthly} onChange={(e) => setMonthly(e.target.value)} className={'field' + (errors.monthly ? ' field-invalid' : '')} />{errors.monthly && <p className="err-text">{errors.monthly}</p>}</div>
        <div><label htmlFor="fire-e" className="mb-1 block text-sm font-medium">Annual expenses</label><input id="fire-e" type="text" inputMode="decimal" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={'field' + (errors.expenses ? ' field-invalid' : '')} />{errors.expenses && <p className="err-text">{errors.expenses}</p>}</div>
        <div><label htmlFor="fire-r" className="mb-1 block text-sm font-medium">Expected return (%/year)</label><input id="fire-r" type="text" inputMode="decimal" value={returnPct} onChange={(e) => setReturnPct(e.target.value)} className={'field' + (errors.returnPct ? ' field-invalid' : '')} />{errors.returnPct && <p className="err-text">{errors.returnPct}</p>}</div>
      </div>
      <p className="mt-3 text-xs text-soft">Target = 25 × annual expenses (the 4% rule).</p>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate FIRE date</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.years, 1)} suffix="years" label="Time to financial independence" />
          <p className="text-center text-sm text-soft">FIRE number: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.targetNumber, 0)}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your savings, contributions, and expenses to project your FIRE date.</p>
      )}
    </div>
  );
}
