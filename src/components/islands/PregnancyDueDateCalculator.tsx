import { useState } from 'react';
import { calculateDueDate } from '../../lib/calculations/dueDate';
import ResultDisplay from './ResultDisplay';

export default function PregnancyDueDateCalculator() {
  const [lmp, setLmp] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const r = calculateDueDate(lmp);
    if (r.success) { setResult(r.value as string); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setLmp(''); setResult(null); setError(''); };

  const formatted = result ? new Date(result + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : null;

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div>
        <label htmlFor="dd-lmp" className="mb-1 block text-sm font-medium">First day of last menstrual period (LMP)</label>
        <input id="dd-lmp" type="date" value={lmp} onChange={(e) => setLmp(e.target.value)} className="field" />
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate due date</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={result} label="Estimated due date" />
          {formatted && <p className="text-center text-sm text-soft">{formatted}</p>}
          <p className="text-center text-xs text-soft">Based on Naegele's rule (LMP + 280 days). Confirm with your healthcare provider.</p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter the first day of your last period to estimate your due date.</p>
      )}
    </div>
  );
}
