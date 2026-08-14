import { useState } from 'react';
import { calculateOhmsLaw, type OhmsLawResult } from '../../lib/calculations/physics';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function OhmsLawCalculator() {
  const [v, setV] = useState('');
  const [i, setI] = useState('');
  const [r, setR] = useState('');
  const [result, setResult] = useState<OhmsLawResult | null>(null);
  const [error, setError] = useState('');

  const handleCalculate = () => {
    const res = calculateOhmsLaw(v, i, r);
    if (res.success) { setResult(res.value as OhmsLawResult); setError(''); }
    else { setResult(null); setError(res.error as string); }
  };
  const handleReset = () => { setV(''); setI(''); setR(''); setResult(null); setError(''); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <p className="text-sm text-soft">Enter any <span className="font-semibold text-ink dark:text-paper">two</span> values and leave the third blank to calculate it.</p>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="ohm-v" className="mb-1 block text-sm font-medium">Voltage (V)</label><input id="ohm-v" type="text" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} className="field" placeholder="Volts" /></div>
        <div><label htmlFor="ohm-i" className="mb-1 block text-sm font-medium">Current (I)</label><input id="ohm-i" type="text" inputMode="decimal" value={i} onChange={(e) => setI(e.target.value)} className="field" placeholder="Amps" /></div>
        <div><label htmlFor="ohm-r" className="mb-1 block text-sm font-medium">Resistance (R)</label><input id="ohm-r" type="text" inputMode="decimal" value={r} onChange={(e) => setR(e.target.value)} className="field" placeholder="Ohms" /></div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.voltage)} suffix="V" label="Voltage" />
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-ink/10 bg-paper p-3 text-center dark:border-ink/20">
              <p className="font-mono text-2xl font-bold tabular-nums text-ink dark:text-paper">{formatNumber(result.current)} A</p>
              <p className="mt-1 text-xs text-soft">Current</p>
            </div>
            <div className="rounded-lg border border-ink/10 bg-paper p-3 text-center dark:border-ink/20">
              <p className="font-mono text-2xl font-bold tabular-nums text-ink dark:text-paper">{formatNumber(result.resistance)} Ω</p>
              <p className="mt-1 text-xs text-soft">Resistance</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
