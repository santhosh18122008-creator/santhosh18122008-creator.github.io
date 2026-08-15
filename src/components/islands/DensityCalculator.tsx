import { useState } from 'react';
import { calculateDensity, type DensityResult } from '../../lib/calculations/density';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function DensityCalculator() {
  const [d, setD] = useState('');
  const [m, setM] = useState('');
  const [v, setV] = useState('');
  const [result, setResult] = useState<{ value: number; label: string } | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const r = calculateDensity(d, m, v);
    if (!r.success) { setResult(null); setError(r.error as string); return; }
    const val = r.value as DensityResult;
    if (d.trim() === '') setResult({ value: val.density, label: 'Density (kg/m³)' });
    else if (m.trim() === '') setResult({ value: val.mass, label: 'Mass (kg)' });
    else setResult({ value: val.volume, label: 'Volume (m³)' });
    setError('');
  };
  const handleReset = () => { setD(''); setM(''); setV(''); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <p className="text-sm text-soft">Enter any <span className="font-semibold text-ink dark:text-paper">two</span> values and leave the third blank.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="den-d" className="mb-1 block text-sm font-medium">Density</label><input id="den-d" type="text" inputMode="decimal" value={d} onChange={(e) => setD(e.target.value)} className="field" placeholder="kg/m³" /></div>
        <div><label htmlFor="den-m" className="mb-1 block text-sm font-medium">Mass</label><input id="den-m" type="text" inputMode="decimal" value={m} onChange={(e) => setM(e.target.value)} className="field" placeholder="kg" /></div>
        <div><label htmlFor="den-v" className="mb-1 block text-sm font-medium">Volume</label><input id="den-v" type="text" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} className="field" placeholder="m³" /></div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && <div className="mt-6"><ResultDisplay value={formatNumber(result.value)} label={result.label} /></div>}
    </div>
  );
}
