import { useState } from 'react';
import { calculateAverage, type AverageResult } from '../../lib/calculations/average';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

interface Row { id: number; value: string; }

export default function AverageCalculator() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, value: '' }]);
  const [nextId, setNextId] = useState(2);
  const [result, setResult] = useState<AverageResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<number, string>>({});

  const updateRow = (id: number, value: string) => setRows((p) => p.map((r) => r.id === id ? { ...r, value } : r));
  const addRow = () => {
    if (rows.length >= 50) return;
    setRows((p) => [...p, { id: nextId, value: '' }]);
    setNextId((n) => n + 1);
    setResult(null); setError('');
  };
  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((p) => p.filter((r) => r.id !== id));
    setResult(null); setError('');
  };

  const handleCalculate = () => {
    const next: Record<number, string> = {};
    const numbers = rows.map((r) => {
      const parsed = parseAndValidateNumber(r.value);
      if (!parsed.valid) next[r.id] = parsed.error as string;
      return parsed.num ?? 0;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateAverage(numbers);
    if (r.success) { setResult(r.value as AverageResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => {
    setRows([{ id: nextId, value: '' }]);
    setNextId((n) => n + 1);
    setResult(null); setError(''); setErrors({});
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.id} className="flex items-end gap-3">
            <div className="flex-1">
              <label htmlFor={'avg-val-' + row.id} className="mb-1 block text-sm font-medium">Number {i + 1}</label>
              <input id={'avg-val-' + row.id} type="text" inputMode="decimal" value={row.value} onChange={(e) => updateRow(row.id, e.target.value)} className={'field' + (errors[row.id] ? ' field-invalid' : '')} />
              {errors[row.id] && <p className="err-text">{errors[row.id]}</p>}
            </div>
            <button onClick={() => removeRow(row.id)} disabled={rows.length <= 1} aria-label={'Remove number ' + (i + 1)} className="btn-text disabled:opacity-40">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={addRow} disabled={rows.length >= 50} className="btn-text disabled:opacity-40">+ Add number</button>
        <button onClick={handleCalculate} className="btn-filled">Calculate average</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.mean)} label="Average (mean)" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Sum: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.sum)}</span></span>
            <span>Count: <span className="font-mono font-semibold text-ink dark:text-paper">{result.count}</span></span>
          </div>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter numbers above to see their average.</p>
      )}
    </div>
  );
}
