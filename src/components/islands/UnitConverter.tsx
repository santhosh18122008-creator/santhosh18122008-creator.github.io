import { useState, useEffect } from 'react';
import { convertLength, convertMass, convertTemperature, LENGTH_UNITS, MASS_UNITS, TEMP_UNITS, type LengthUnit, type MassUnit, type TempUnit } from '../../lib/calculations/units';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

type Category = 'Length' | 'Mass' | 'Temperature';

export default function UnitConverter() {
  const [category, setCategory] = useState<Category>('Length');
  const [value, setValue] = useState('1');
  const [fromUnit, setFromUnit] = useState<string>('m');
  const [toUnit, setToUnit] = useState<string>('km');
  const [result, setResult] = useState<number | null>(1000);

  const units = category === 'Length' ? LENGTH_UNITS : category === 'Mass' ? MASS_UNITS : TEMP_UNITS;

  useEffect(() => { setFromUnit(units[0]); setToUnit(units[1] || units[0]); }, [category]);

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
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap justify-center gap-2">
        {(['Length', 'Mass', 'Temperature'] as Category[]).map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={'cat-btn ' + (category === c ? 'is-active' : '')}>{c}</button>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="unit-from" className="mb-1 block text-sm font-medium">From</label>
          <select id="unit-from" value={fromUnit} onChange={(e) => setFromUnit(e.target.value)} className="field">
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="unit-to" className="mb-1 block text-sm font-medium">To</label>
          <select id="unit-to" value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="field">
            {units.map((u) => <option key={u} value={u}>{u}</option>)}
          </select>
        </div>
      </div>
      <div className="mt-4">
        <label htmlFor="unit-val" className="mb-1 block text-sm font-medium">Value</label>
        <input id="unit-val" type="text" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} className="field" />
      </div>
      <div className="mt-6">
        {result !== null ? (
          <ResultDisplay value={formatNumber(result, 6)} suffix={toUnit} label={'= ' + formatNumber(Number(value)) + ' ' + fromUnit} />
        ) : (
          <p className="text-center text-sm text-soft">Enter a valid number to see the conversion.</p>
        )}
      </div>
    </div>
  );
}
