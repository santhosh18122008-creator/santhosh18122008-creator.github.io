import { useState } from 'react';
import { calculateProjectile, type ProjectileResult } from '../../lib/calculations/projectile';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function ProjectileMotionCalculator() {
  const [velocity, setVelocity] = useState('20');
  const [angle, setAngle] = useState('45');
  const [gravity, setGravity] = useState('9.81');
  const [result, setResult] = useState<ProjectileResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(velocity);
    const v2 = parseAndValidateNumber(angle);
    const v3 = parseAndValidateNumber(gravity);
    const next: Record<string, string> = {};
    if (!v1.valid) next.velocity = v1.error as string;
    if (!v2.valid) next.angle = v2.error as string;
    if (!v3.valid) next.gravity = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateProjectile(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as ProjectileResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setVelocity('20'); setAngle('45'); setGravity('9.81'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="proj-v" className="mb-1 block text-sm font-medium">Initial velocity (m/s)</label><input id="proj-v" type="text" inputMode="decimal" value={velocity} onChange={(e) => setVelocity(e.target.value)} className={'field' + (errors.velocity ? ' field-invalid' : '')} />{errors.velocity && <p className="err-text">{errors.velocity}</p>}</div>
        <div><label htmlFor="proj-a" className="mb-1 block text-sm font-medium">Launch angle (°)</label><input id="proj-a" type="text" inputMode="decimal" value={angle} onChange={(e) => setAngle(e.target.value)} className={'field' + (errors.angle ? ' field-invalid' : '')} />{errors.angle && <p className="err-text">{errors.angle}</p>}</div>
        <div><label htmlFor="proj-g" className="mb-1 block text-sm font-medium">Gravity (m/s²)</label><input id="proj-g" type="text" inputMode="decimal" value={gravity} onChange={(e) => setGravity(e.target.value)} className={'field' + (errors.gravity ? ' field-invalid' : '')} />{errors.gravity && <p className="err-text">{errors.gravity}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.range, 2)} suffix="m" label="Range" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Max height: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.maxHeight, 2)} m</span></span>
            <span>Flight time: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.flightTime, 2)} s</span></span>
          </div>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter velocity and angle to see the projectile's path.</p>
      )}
    </div>
  );
}
