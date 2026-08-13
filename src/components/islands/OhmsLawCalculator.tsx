import { useState } from 'react';
import { calculateOhmsLaw, type OhmsLawResult } from '../../lib/calculations/physics';
import { formatNumber } from '../../lib/formatting/number';

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

  const inputClass = "w-full rounded-md border border-slate-300 bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950";

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p className="mb-4 text-sm text-slate-600 dark:text-slate-400">Enter any <strong>two</strong> values and leave the third blank to calculate it.</p>
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="ohm-v" className="mb-1 block text-sm font-medium">Voltage (V)</label>
          <input id="ohm-v" type="text" inputMode="decimal" value={v} onChange={(e) => setV(e.target.value)} className={inputClass} placeholder="Volts" />
        </div>
        <div>
          <label htmlFor="ohm-i" className="mb-1 block text-sm font-medium">Current (I)</label>
          <input id="ohm-i" type="text" inputMode="decimal" value={i} onChange={(e) => setI(e.target.value)} className={inputClass} placeholder="Amps" />
        </div>
        <div>
          <label htmlFor="ohm-r" className="mb-1 block text-sm font-medium">Resistance (R)</label>
          <input id="ohm-r" type="text" inputMode="decimal" value={r} onChange={(e) => setR(e.target.value)} className={inputClass} placeholder="Ohms" />
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button onClick={handleCalculate} className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600">Calculate</button>
        <button onClick={handleReset} className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800">Reset</button>
      </div>

      <div aria-live="polite">
        {error && <p className="text-center font-medium text-red-600">{error}</p>}
        {result && (
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">Voltage</p>
              <p className="text-xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber(result.voltage)} V</p>
            </div>
            <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">Current</p>
              <p className="text-xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber(result.current)} A</p>
            </div>
            <div className="rounded-md bg-slate-100 p-3 dark:bg-slate-800">
              <p className="text-xs text-slate-600 dark:text-slate-400">Resistance</p>
              <p className="text-xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{formatNumber(result.resistance)} Ω</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
