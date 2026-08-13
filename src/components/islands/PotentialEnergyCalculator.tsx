import { useState } from 'react';
import { calculatePotentialEnergy, type EnergyResult } from '../../lib/calculations/physics';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

export default function PotentialEnergyCalculator() {
  const [mass, setMass] = useState('');
  const [height, setHeight] = useState('');
  const [gravity, setGravity] = useState('9.81');
  const [result, setResult] = useState<CalculationResult<EnergyResult> | null>(null);
  const [errors, setErrors] = useState<{ mass?: string; height?: string; gravity?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(mass);
    const v2 = parseAndValidateNumber(height);
    const v3 = parseAndValidateNumber(gravity);
    const nextErrors: typeof errors = {};
    if (!v1.valid) nextErrors.mass = v1.error;
    if (!v2.valid) nextErrors.height = v2.error;
    if (!v3.valid) nextErrors.gravity = v3.error;
    setErrors(nextErrors);
    if (nextErrors.mass || nextErrors.height || nextErrors.gravity) { setResult(null); return; }
    setResult(calculatePotentialEnergy(v1.num as number, v2.num as number, v3.num as number));
  };

  const handleReset = () => { setMass(''); setHeight(''); setGravity('9.81'); setResult(null); setErrors({}); };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="pe-mass" className="mb-1 block text-sm font-medium">Mass (kg)</label>
          <input id="pe-mass" type="text" inputMode="decimal" value={mass} onChange={(e) => setMass(e.target.value)} className={inputClass(Boolean(errors.mass))} />
          {errors.mass && <p className="mt-1 text-xs text-red-600">{errors.mass}</p>}
        </div>
        <div>
          <label htmlFor="pe-height" className="mb-1 block text-sm font-medium">Height (m)</label>
          <input id="pe-height" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={inputClass(Boolean(errors.height))} />
          {errors.height && <p className="mt-1 text-xs text-red-600">{errors.height}</p>}
        </div>
        <div>
          <label htmlFor="pe-grav" className="mb-1 block text-sm font-medium">Gravity (m/s²)</label>
          <input id="pe-grav" type="text" inputMode="decimal" value={gravity} onChange={(e) => setGravity(e.target.value)} className={inputClass(Boolean(errors.gravity))} />
          {errors.gravity && <p className="mt-1 text-xs text-red-600">{errors.gravity}</p>}
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600">Calculate</button>
        <button onClick={handleReset} className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800">Reset</button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 text-center dark:bg-slate-800">
            {result.success ? (
              <>
                <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Potential Energy</p>
                <p className="text-3xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber((result.value as EnergyResult).energy)} <span className="text-lg">Joules (J)</span></p>
              </>
            ) : <p className="font-medium text-red-600">{result.error}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
