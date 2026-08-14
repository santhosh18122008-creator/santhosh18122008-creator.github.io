import { useState } from 'react';
import { calculateAge, parseIsoDate, type AgeResult } from '../../lib/calculations/dates';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function AgeCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [birth, setBirth] = useState('');
  const [asOf, setAsOf] = useState(today);
  const [result, setResult] = useState<AgeResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const b = parseIsoDate(birth);
    const a = parseIsoDate(asOf);
    if (!b || !a) { setError('Please choose valid dates.'); setResult(null); return; }
    const r = calculateAge(b, a);
    if (r.success) { setResult(r.value as AgeResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setBirth(''); setAsOf(today); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="age-birth" className="mb-1 block text-sm font-medium">Date of birth</label>
          <input id="age-birth" type="date" value={birth} onChange={(e) => setBirth(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="age-asof" className="mb-1 block text-sm font-medium">Age at this date</label>
          <input id="age-asof" type="date" value={asOf} onChange={(e) => setAsOf(e.target.value)} className="field" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate age</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={`${result.years}y ${result.months}m ${result.days}d`} label="Exact age" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Total days: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.totalDays)}</span></span>
            <span>Next birthday in: <span className="font-mono font-semibold text-ink dark:text-paper">{result.daysUntilNextBirthday} days</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
