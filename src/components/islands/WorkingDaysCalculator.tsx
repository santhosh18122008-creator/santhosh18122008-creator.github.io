import { useState } from 'react';
import { calculateWorkingDays } from '../../lib/calculations/workingDays';
import ResultDisplay from './ResultDisplay';

export default function WorkingDaysCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState(today);
  const [end, setEnd] = useState(today);
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const r = calculateWorkingDays(start, end);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setStart(today); setEnd(today); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="wd-start" className="mb-1 block text-sm font-medium">Start date</label>
          <input id="wd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="wd-end" className="mb-1 block text-sm font-medium">End date</label>
          <input id="wd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="field" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={String(result)} suffix="days" label="Working days (Mon-Fri)" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Choose two dates to count the working days between them.</p>
      )}
    </div>
  );
}
