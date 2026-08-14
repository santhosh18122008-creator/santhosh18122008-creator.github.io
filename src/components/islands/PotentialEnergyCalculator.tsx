import { useState } from 'react';
import { calculatePotentialEnergy, type EnergyResult } from '../../lib/calculations/physics';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function PotentialEnergyCalculator() {
  const [mass, setMass] = useState('');
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [result, setResult] = useState<EnergyResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ mass?: string; height?: string; gravity?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(mass);
    const v2 = parseAndValidateNumber(height);
    const v3 = parseAndValidateNumber(gravity);
    const next: typeof errors = {};
    if (!v1.valid) next.mass = v1.error;
    if (!v2.valid) next.height = v2.error;
    if (!v3.valid) next.gravity = v3.error;
    setErrors(next);
    if (next.mass || next.height || next.gravity) { setResult(null); setError(''); return; }
    const r = calculatePotentialEnergy(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as EnergyResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setMass(''); setHeight(''); setGravity('9.81'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="pe-mass" className="mb-1 block text-sm font-medium">Mass (kg)</label>
          <input id="pe-mass" type="text" inputMode="decimal" value={mass} onChange={(e) => setMass(e.target.value)} className={'field' + (errors.mass ? ' field-invalid' : '')} />
          {errors.mass && <p className="err-text">{errors.mass}</p>}
        </div>
        <div>
          <label htmlFor="pe-height" className="mb-1 block text-sm font-medium">Height (m)</label>
          <input id="pe-height" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={'field' + (errors.height ? ' field-invalid' : '')} />
          {errors.height && <p className="err-text">{errors.height}</p>}
        </div>
        <div>
          <label htmlFor="pe-grav" className="mb-1 block text-sm font-medium">Gravity (m/s²)</label>
          <input id="pe-grav" type="text" inputMode="decimal" value={gravity} onChange={(e) => setGravity(e.target.value)} className={'field' + (errors.gravity ? ' field-invalid' : '')} />
          {errors.gravity && <p className="err-text">{errors.gravity}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result.energy)} suffix="J" label="Potential energy" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter the values above to see the potential energy.</p>
      )}
    </div>
  );
}
