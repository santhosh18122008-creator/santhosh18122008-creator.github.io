import { useState, useEffect } from 'react';
import {
  convertLength, convertMass, convertTemperature,
  LENGTH_UNITS, MASS_UNITS, TEMP_UNITS,
  type LengthUnit, type MassUnit, type TempUnit
} from '../../lib/calculations/units';
import { formatNumber } from '../../lib/formatting/number';

type Category = 'Length' | 'Mass' | 'Temperature';

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [result, setResult] = useState<number | null>(1000);

  const units = category === 'Length' ? LENGTH_UNITS : category === 'Mass' ? MASS_UNITS : TEMP_UNITS;

  useEffect(() => {
    setFromUnit(units[0]);
    setToUnit(units[1] || units[0]);
  }, [category]);

  useEffect(() => {
    const num = Number(value);
    if (!Number.isFinite(num)) { setResult(null); return; }
    
    let res;
    if (category === 'Length') res = convertLength(num, fromUnit as LengthUnit, toUnit as LengthUnit);
    else if (category === 'Mass') res = convertMass(num, fromUnit as MassUnit, toUnit as MassUnit);
    else res = convertTemperature(num, fromUnit as TempUnit, toUnit as TempUnit);

    setResult(res.success ? (res.value as number) : null);
  }, [value, fromUnit, toUnit, category]);

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex flex-wrap justify-center gap-2 border-b border-slate-200 pb-4 dark:border-slate-700">
        {(['Length', 'Mass', 'Temperature'] as Category[]).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 text-sm font-medium rounded-md ${category === cat ? 'bg-brand-900 text-white dark:bg-brand-500' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <label htmlFor="unit-val" className="mb-1 block text-sm font-medium">Value</label>
          <input
            id="unit-val"
            type="text"
            inputMode="decimal"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
          />
          <label htmlFor="unit-from" className="mt-3 mb-1 block text-sm font-medium">From</label>
          <select
            id="unit-from"
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
          >
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>

        <div className="hidden md:flex items-center justify-center text-2xl text-slate-400">→</div>

        <div>
          <label className="mb-1 block text-sm font-medium text-transparent select-none">Result</label>
          <div className="w-full rounded-md border border-slate-200 bg-slate-50 px-3 py-2 tabular-nums text-lg font-bold text-brand-900 dark:border-slate-700 dark:bg-slate-800 dark:text-brand-100">
            {result !== null ? formatNumber(result, 6) : 'Invalid'}
          </div>
          <label htmlFor="unit-to" className="mt-3 mb-1 block text-sm font-medium">To</label>
          <select
            id="unit-to"
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
          >
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
    </div>
  );
}
