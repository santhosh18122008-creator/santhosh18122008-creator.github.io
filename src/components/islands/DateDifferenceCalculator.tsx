import { useState } from 'react';
import { calculateDateDifference, parseIsoDate, type DateDifferenceResult } from '../../lib/calculations/dates';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function DateDifferenceCalculator() {
  const today = new Date().toISOString().slice(0, 10);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState(today);
  const [result, setResult] = useState<DateDifferenceResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const s = parseIsoDate(start);
    const e = parseIsoDate(end);
    if (!s || !e) { setError('Please choose valid dates.'); setResult(null); return; }
    const r = calculateDateDifference(s, e);
    if (r.success) { setResult(r.value as DateDifferenceResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setStart(''); setEnd(today); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="dd-start" className="mb-1 block text-sm font-medium">Start date</label>
          <input id="dd-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="dd-end" className="mb-1 block text-sm font-medium">End date</label>
          <input id="dd-end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} className="field" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate difference</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.totalDays)} suffix="days" label="Total difference" />
          <div className="flex flex-wrap justify-center gap-6 text-sm text-soft">
            <span>= <span className="font-mono font-semibold text-ink dark:text-paper">{result.weeks}</span> weeks <span className="font-mono font-semibold text-ink dark:text-paper">{result.remainingDays}</span> days</span>
            <span>= <span className="font-mono font-semibold text-ink dark:text-paper">{result.years}</span>y <span className="font-mono font-semibold text-ink dark:text-paper">{result.months}</span>m <span className="font-mono font-semibold text-ink dark:text-paper">{result.days}</span>d</span>
          </div>
        </div>
      )}
    </div>
  );
}
