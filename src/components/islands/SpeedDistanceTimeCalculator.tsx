import { useState } from 'react';
import { calculateSpeedDistanceTime, type SpeedResult } from '../../lib/calculations/speed';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function SpeedDistanceTimeCalculator() {
  const [s, setS] = useState('');
  const [d, setD] = useState('');
  const [t, setT] = useState('');
  const [result, setResult] = useState<{ value: number; label: string } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const r = calculateSpeedDistanceTime(s, d, t);
    if (!r.success) { setResult(null); setError(r.error as string); return; }
    const v = r.value as SpeedResult;
    if (s.trim() === '') setResult({ value: v.speed, label: 'Speed' });
    else if (d.trim() === '') setResult({ value: v.distance, label: 'Distance' });
    else setResult({ value: v.time, label: 'Time' });
    setError('');
  };
  const handleReset = () => { setS(''); setD(''); setT(''); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <p className="text-sm text-soft">Enter any <span className="font-semibold text-ink dark:text-paper">two</span> values and leave the third blank.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="sdt-s" className="mb-1 block text-sm font-medium">Speed</label><input id="sdt-s" type="text" inputMode="decimal" value={s} onChange={(e) => setS(e.target.value)} className="field" placeholder="e.g. km/h" /></div>
        <div><label htmlFor="sdt-d" className="mb-1 block text-sm font-medium">Distance</label><input id="sdt-d" type="text" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} className="field" placeholder="e.g. km" /></div>
        <div><label htmlFor="sdt-t" className="mb-1 block text-sm font-medium">Time</label><input id="sdt-t" type="text" inputMode="decimal" value={t} onChange={(e) => setT(e.target.value)} className="field" placeholder="e.g. hours" /></div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result.value)} label={result.label} />
        </div>
      )}
    </div>
  );
}
