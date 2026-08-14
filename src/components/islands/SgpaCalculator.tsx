import { useState } from 'react';
import { calculateSgpa, type SgpaEntry } from '../../lib/calculations/sgpa';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

interface Row { id: number; credits: string; gradePoints: string; }

export default function SgpaCalculator() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, credits: '', gradePoints: '' }]);
  const [nextId, setNextId] = useState(2);
  const [result, setResult] = useState<{ sgpa: number; totalCredits: number } | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<number, { credits?: string; gradePoints?: string }>>({});

  const updateRow = (id: number, patch: Partial<Row>) => setRows((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  const addRow = () => { if (rows.length >= 20) return; setRows((p) => [...p, { id: nextId, credits: '', gradePoints: '' }]); setNextId((n) => n + 1); setResult(null); setError(''); };
  const removeRow = (id: number) => { if (rows.length <= 1) return; setRows((p) => p.filter((r) => r.id !== id)); setResult(null); setError(''); };

  const handleCalculate = () => {
    const next: Record<number, { credits?: string; gradePoints?: string }> = {};
    const entries: SgpaEntry[] = rows.map((r) => {
      const c = parseAndValidateNumber(r.credits);
      const g = parseAndValidateNumber(r.gradePoints);
      const e: { credits?: string; gradePoints?: string } = {};
      if (!c.valid) e.credits = c.error;
      if (!g.valid) e.gradePoints = g.error;
      if (Object.keys(e).length > 0) next[r.id] = e;
      return { credits: c.num ?? 0, gradePoints: g.num ?? 0 };
    });
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateSgpa(entries);
    if (r.success) { setResult(r.value as { sgpa: number; totalCredits: number }); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setRows([{ id: nextId, credits: '', gradePoints: '' }]); setNextId((n) => n + 1); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-end">
            <div className="sm:col-span-1"><label className="mb-1 block text-sm font-medium">Subject {i + 1}</label><p className="text-sm text-soft py-2">Course {i + 1}</p></div>
            <div>
              <label htmlFor={'sgpa-c-' + row.id} className="mb-1 block text-sm font-medium">Credits</label>
              <input id={'sgpa-c-' + row.id} type="text" inputMode="decimal" value={row.credits} onChange={(e) => updateRow(row.id, { credits: e.target.value })} className={'field' + (errors[row.id]?.credits ? ' field-invalid' : '')} />
              {errors[row.id]?.credits && <p className="err-text">{errors[row.id]?.credits}</p>}
            </div>
            <div>
              <label htmlFor={'sgpa-g-' + row.id} className="mb-1 block text-sm font-medium">Grade Points (out of 10)</label>
              <input id={'sgpa-g-' + row.id} type="text" inputMode="decimal" value={row.gradePoints} onChange={(e) => updateRow(row.id, { gradePoints: e.target.value })} className={'field' + (errors[row.id]?.gradePoints ? ' field-invalid' : '')} />
              {errors[row.id]?.gradePoints && <p className="err-text">{errors[row.id]?.gradePoints}</p>}
            </div>
            <button onClick={() => removeRow(row.id)} disabled={rows.length <= 1} aria-label={'Remove subject ' + (i + 1)} className="btn-text disabled:opacity-40">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={addRow} disabled={rows.length >= 20} className="btn-text disabled:opacity-40">+ Add subject</button>
        <button onClick={handleCalculate} className="btn-filled">Calculate SGPA</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.sgpa, 2)} label="Your SGPA" />
          <p className="text-center text-sm text-soft">Total credits: <span className="font-semibold text-ink dark:text-paper">{formatNumber(result.totalCredits)}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Add your subjects above to calculate your semester average.</p>
      )}
    </div>
  );
}
