import { useState } from 'react';
import { calculateHeartRateZones, type HrZones } from '../../lib/calculations/heartRate';
import { parseAndValidateNumber } from '../../lib/validation/number';
import ResultDisplay from './ResultDisplay';

export default function HeartRateZonesCalculator() {
  const [age, setAge] = useState('');
  const [rhr, setRhr] = useState('');
  const [result, setResult] = useState<HrZones | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(age);
    const v2 = parseAndValidateNumber(rhr);
    const next: Record<string, string> = {};
    if (!v1.valid) next.age = v1.error as string;
    if (!v2.valid) next.rhr = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateHeartRateZones(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as HrZones); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setAge(''); setRhr(''); setResult(null); setError(''); setErrors({}); };

  const zones = result ? [
    { name: 'Zone 1 (Recovery)', range: result.z1, pct: '50-60%' },
    { name: 'Zone 2 (Fat Burn)', range: result.z2, pct: '60-70%' },
    { name: 'Zone 3 (Aerobic)', range: result.z3, pct: '70-80%' },
    { name: 'Zone 4 (Threshold)', range: result.z4, pct: '80-90%' },
    { name: 'Zone 5 (Max Effort)', range: result.z5, pct: '90-100%' },
  ] : [];

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="hr-age" className="mb-1 block text-sm font-medium">Age</label><input id="hr-age" type="text" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} className={'field' + (errors.age ? ' field-invalid' : '')} />{errors.age && <p className="err-text">{errors.age}</p>}</div>
        <div><label htmlFor="hr-rhr" className="mb-1 block text-sm font-medium">Resting Heart Rate (bpm)</label><input id="hr-rhr" type="text" inputMode="numeric" value={rhr} onChange={(e) => setRhr(e.target.value)} className={'field' + (errors.rhr ? ' field-invalid' : '')} />{errors.rhr && <p className="err-text">{errors.rhr}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate zones</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={String(result.maxHr)} suffix="bpm" label="Maximum Heart Rate" />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {zones.map((z) => (
              <div key={z.name} className="rounded-lg border border-ink/10 bg-paper p-3 dark:border-ink/20">
                <p className="text-xs font-semibold text-soft">{z.name} ({z.pct})</p>
                <p className="mt-1 font-mono text-lg font-bold tabular-nums text-ink dark:text-paper">{z.range[0]} – {z.range[1]} bpm</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your age and resting heart rate (Karvonen method).</p>
      )}
    </div>
  );
}
