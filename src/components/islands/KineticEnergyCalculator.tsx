import { useState } from 'react';
import { calculateKineticEnergy, type EnergyResult } from '../../lib/calculations/physics';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function KineticEnergyCalculator() {
  const [mass, setMass] = useState('');
  const [velocity, setVelocity] = useState('');
  const [result, setResult] = useState<EnergyResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ mass?: string; velocity?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(mass);
    const v2 = parseAndValidateNumber(velocity);
    const next: typeof errors = {};
    if (!v1.valid) next.mass = v1.error;
    if (!v2.valid) next.velocity = v2.error;
    setErrors(next);
    if (next.mass || next.velocity) { setResult(null); setError(''); return; }
    const r = calculateKineticEnergy(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as EnergyResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setMass(''); setVelocity(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="ke-mass" className="mb-1 block text-sm font-medium">Mass (kg)</label>
          <input id="ke-mass" type="text" inputMode="decimal" value={mass} onChange={(e) => setMass(e.target.value)} className={'field' + (errors.mass ? ' field-invalid' : '')} />
          {errors.mass && <p className="err-text">{errors.mass}</p>}
        </div>
        <div>
          <label htmlFor="ke-vel" className="mb-1 block text-sm font-medium">Velocity (m/s)</label>
          <input id="ke-vel" type="text" inputMode="decimal" value={velocity} onChange={(e) => setVelocity(e.target.value)} className={'field' + (errors.velocity ? ' field-invalid' : '')} />
          {errors.velocity && <p className="err-text">{errors.velocity}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result.energy)} suffix="J" label="Kinetic energy" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter mass and velocity above to see the kinetic energy.</p>
      )}
    </div>
  );
}
