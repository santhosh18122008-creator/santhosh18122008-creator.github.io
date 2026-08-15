import { useState } from 'react';
import { calculatePace, type PaceResult } from '../../lib/calculations/pace';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function PaceCalculator() {
  const [time, setTime] = useState('');
  const [distance, setDistance] = useState('');
  const [unit, setUnit] = useState<'km' | 'mi'>('km');
  const [result, setResult] = useState<PaceResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(time);
    const v2 = parseAndValidateNumber(distance);
    const next: Record<string, string> = {};
    if (!v1.valid) next.time = v1.error as string;
    if (!v2.valid) next.distance = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculatePace(v1.num as number, v2.num as number, unit);
    if (r.success) { setResult(r.value as PaceResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setTime(''); setDistance(''); setUnit('km'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setUnit('km')} aria-pressed={unit === 'km'} className={'cat-btn ' + (unit === 'km' ? 'is-active' : '')}>Kilometers</button>
        <button onClick={() => setUnit('mi')} aria-pressed={unit === 'mi'} className={'cat-btn ' + (unit === 'mi' ? 'is-active' : '')}>Miles</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="pace-t" className="mb-1 block text-sm font-medium">Total time (minutes)</label><input id="pace-t" type="text" inputMode="decimal" value={time} onChange={(e) => setTime(e.target.value)} className={'field' + (errors.time ? ' field-invalid' : '')} />{errors.time && <p className="err-text">{errors.time}</p>}<p className="mt-1 text-xs text-soft">e.g. 105 for 1h 45m</p></div>
        <div><label htmlFor="pace-d" className="mb-1 block text-sm font-medium">Distance ({unit})</label><input id="pace-d" type="text" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} className={'field' + (errors.distance ? ' field-invalid' : '')} />{errors.distance && <p className="err-text">{errors.distance}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate pace</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={result.paceFormatted} suffix={`min/${unit}`} label="Your pace" />
          <p className="text-center text-sm text-soft">Speed: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.speedKmh, 2)} km/h</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your time and distance to see your pace.</p>
      )}
    </div>
  );
}
