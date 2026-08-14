import { useState } from 'react';
import { calculatePercentile } from '../../lib/calculations/percentile';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function RankPercentileCalculator() {
  const [rank, setRank] = useState('');
  const [total, setTotal] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ rank?: string; total?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(rank);
    const v2 = parseAndValidateNumber(total);
    const next: typeof errors = {};
    if (!v1.valid) next.rank = v1.error;
    if (!v2.valid) next.total = v2.error;
    setErrors(next);
    if (next.rank || next.total) { setResult(null); setError(''); return; }
    const r = calculatePercentile(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setRank(''); setTotal(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="pc-rank" className="mb-1 block text-sm font-medium">Your rank</label>
          <input id="pc-rank" type="text" inputMode="numeric" value={rank} onChange={(e) => setRank(e.target.value)} className={'field' + (errors.rank ? ' field-invalid' : '')} />
          {errors.rank && <p className="err-text">{errors.rank}</p>}
        </div>
        <div>
          <label htmlFor="pc-total" className="mb-1 block text-sm font-medium">Total candidates</label>
          <input id="pc-total" type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} className={'field' + (errors.total ? ' field-invalid' : '')} />
          {errors.total && <p className="err-text">{errors.total}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 2)} suffix="%" label="Your percentile" />
          <p className="mt-3 text-center text-sm text-soft">You scored above {formatNumber(result, 2)}% of candidates.</p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your rank and total candidates above.</p>
      )}
    </div>
  );
}
