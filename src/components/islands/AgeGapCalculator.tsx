import { useState } from 'react';
import { calculateAgeGap } from '../../lib/calculations/ageGap';
import ResultDisplay from './ResultDisplay';

export default function AgeGapCalculator() {
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  const [result, setResult] = useState<{years: number, months: number, days: number} | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const r = calculateAgeGap(d1, d2);
    if (r.success) { setResult(r.value as {years: number, months: number, days: number}); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setD1(''); setD2(''); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="ag-d1" className="mb-1 block text-sm font-medium">Person 1 birthdate</label>
          <input id="ag-d1" type="date" value={d1} onChange={(e) => setD1(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="ag-d2" className="mb-1 block text-sm font-medium">Person 2 birthdate</label>
          <input id="ag-d2" type="date" value={d2} onChange={(e) => setD2(e.target.value)} className="field" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate gap</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6">
          <ResultDisplay value={`${result.years}y ${result.months}m ${result.days}d`} label="Exact age difference" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter two birthdates to see the exact difference.</p>
      )}
    </div>
  );
}
