import { useState } from 'react';
import { calculateFreelanceRate, type FreelanceResult } from '../../lib/calculations/freelance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function FreelanceRateCalculator() {
  const [target, setTarget] = useState('100000');
  const [expenses, setExpenses] = useState('10000');
  const [tax, setTax] = useState('30');
  const [hours, setHours] = useState('160');
  const [result, setResult] = useState<FreelanceResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(target);
    const v2 = parseAndValidateNumber(expenses);
    const v3 = parseAndValidateNumber(tax);
    const v4 = parseAndValidateNumber(hours);
    const next: Record<string, string> = {};
    if (!v1.valid) next.target = v1.error as string;
    if (!v2.valid) next.expenses = v2.error as string;
    if (!v3.valid) next.tax = v3.error as string;
    if (!v4.valid) next.hours = v4.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateFreelanceRate(v1.num as number, v2.num as number, v3.num as number, v4.num as number);
    if (r.success) { setResult(r.value as FreelanceResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setTarget('100000'); setExpenses('10000'); setTax('30'); setHours('160'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="fr-target" className="mb-1 block text-sm font-medium">Target monthly income (in-hand)</label><input id="fr-target" type="text" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} className={'field' + (errors.target ? ' field-invalid' : '')} />{errors.target && <p className="err-text">{errors.target}</p>}</div>
        <div><label htmlFor="fr-exp" className="mb-1 block text-sm font-medium">Monthly expenses (tools, internet)</label><input id="fr-exp" type="text" inputMode="decimal" value={expenses} onChange={(e) => setExpenses(e.target.value)} className={'field' + (errors.expenses ? ' field-invalid' : '')} />{errors.expenses && <p className="err-text">{errors.expenses}</p>}</div>
        <div><label htmlFor="fr-tax" className="mb-1 block text-sm font-medium">Expected tax (%)</label><input id="fr-tax" type="text" inputMode="decimal" value={tax} onChange={(e) => setTax(e.target.value)} className={'field' + (errors.tax ? ' field-invalid' : '')} />{errors.tax && <p className="err-text">{errors.tax}</p>}</div>
        <div><label htmlFor="fr-hours" className="mb-1 block text-sm font-medium">Billable hours per month</label><input id="fr-hours" type="text" inputMode="decimal" value={hours} onChange={(e) => setHours(e.target.value)} className={'field' + (errors.hours ? ' field-invalid' : '')} />{errors.hours && <p className="err-text">{errors.hours}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.hourlyRate, 0)} label="Hourly rate to charge" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Daily rate: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.dailyRate, 0)}</span></span>
            <span>Monthly revenue needed: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.monthlyRevenue, 0)}</span></span>
          </div>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your income goal and billable hours to find your hourly rate.</p>
      )}
    </div>
  );
}
