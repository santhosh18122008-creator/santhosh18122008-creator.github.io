import { useState } from 'react';
import { calculateGpa, LETTER_GRADES, type LetterGrade, type GpaResult } from '../../lib/calculations/gpa';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

interface Row { id: number; grade: LetterGrade; credits: string; }

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, grade: 'A', credits: '' }]);
  const [nextId, setNextId] = useState(2);
  const [result, setResult] = useState<GpaResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<number, string>>({});

  const updateRow = (id: number, patch: Partial<Row>) => setRows((p) => p.map((r) => r.id === id ? { ...r, ...patch } : r));
  const addRow = () => {
    if (rows.length >= 20) return;
    setRows((p) => [...p, { id: nextId, grade: 'A', credits: '' }]);
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
    const entries = rows.map((r) => {
      const parsed = parseAndValidateNumber(r.credits);
      if (!parsed.valid) next[r.id] = parsed.error as string;
      return { grade: r.grade, credits: parsed.num ?? 0 };
    });
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateGpa(entries);
    if (r.success) { setResult(r.value as GpaResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => {
    setRows([{ id: nextId, grade: 'A', credits: '' }]);
    setNextId((n) => n + 1);
    setResult(null); setError(''); setErrors({});
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="space-y-3">
        {rows.map((row, i) => (
          <div key={row.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor={'gpa-grade-' + row.id} className="mb-1 block text-sm font-medium">Course {i + 1} grade</label>
              <select id={'gpa-grade-' + row.id} value={row.grade} onChange={(e) => updateRow(row.id, { grade: e.target.value as LetterGrade })} className="field">
                {LETTER_GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor={'gpa-credits-' + row.id} className="mb-1 block text-sm font-medium">Credits</label>
              <input id={'gpa-credits-' + row.id} type="text" inputMode="decimal" value={row.credits} onChange={(e) => updateRow(row.id, { credits: e.target.value })} className={'field' + (errors[row.id] ? ' field-invalid' : '')} />
              {errors[row.id] && <p className="err-text">{errors[row.id]}</p>}
            </div>
            <button onClick={() => removeRow(row.id)} disabled={rows.length <= 1} aria-label={'Remove course ' + (i + 1)} className="btn-text disabled:opacity-40">Remove</button>
          </div>
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <button onClick={addRow} disabled={rows.length >= 20} className="btn-text disabled:opacity-40">+ Add course</button>
        <button onClick={handleCalculate} className="btn-filled">Calculate GPA</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.gpa, 2)} label="Your GPA (4.0 scale)" />
          <p className="text-center text-sm text-soft">Total credits: <span className="font-semibold text-ink dark:text-paper">{formatNumber(result.totalCredits)}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Add your courses above to see your GPA.</p>
      )}
    </div>
  );
}
