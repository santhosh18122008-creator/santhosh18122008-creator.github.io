import { useState } from 'react';
import { calculateWorkPower, type WorkPowerResult } from '../../lib/calculations/workPower';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function WorkPowerCalculator() {
  const [force, setForce] = useState('');
  const [distance, setDistance] = useState('');
  const [time, setTime] = useState('');
  const [result, setResult] = useState<WorkPowerResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(force);
    const v2 = parseAndValidateNumber(distance);
    const v3 = parseAndValidateNumber(time);
    const next: Record<string, string> = {};
    if (!v1.valid) next.force = v1.error as string;
    if (!v2.valid) next.distance = v2.error as string;
    if (!v3.valid) next.time = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateWorkPower(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as WorkPowerResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setForce(''); setDistance(''); setTime(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="wp-f" className="mb-1 block text-sm font-medium">Force (N)</label><input id="wp-f" type="text" inputMode="decimal" value={force} onChange={(e) => setForce(e.target.value)} className={'field' + (errors.force ? ' field-invalid' : '')} />{errors.force && <p className="err-text">{errors.force}</p>}</div>
        <div><label htmlFor="wp-d" className="mb-1 block text-sm font-medium">Distance (m)</label><input id="wp-d" type="text" inputMode="decimal" value={distance} onChange={(e) => setDistance(e.target.value)} className={'field' + (errors.distance ? ' field-invalid' : '')} />{errors.distance && <p className="err-text">{errors.distance}</p>}</div>
        <div><label htmlFor="wp-t" className="mb-1 block text-sm font-medium">Time (s)</label><input id="wp-t" type="text" inputMode="decimal" value={time} onChange={(e) => setTime(e.target.value)} className={'field' + (errors.time ? ' field-invalid' : '')} />{errors.time && <p className="err-text">{errors.time}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.work, 2)} suffix="J" label="Work done" />
          <p className="text-center text-sm text-soft">Power: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.power, 2)} W</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter force, distance, and time to see work and power.</p>
      )}
    </div>
  );
}
