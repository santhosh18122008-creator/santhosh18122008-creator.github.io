import { useState } from 'react';
import {
  calculateGpa,
  LETTER_GRADES,
  type LetterGrade,
  type GpaResult,
} from '../../lib/calculations/gpa';
import type { CalculationResult } from '../../lib/calculations/types';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

interface Row {
  id: number;
  grade: LetterGrade;
  credits: string;
}

export default function GpaCalculator() {
  const [rows, setRows] = useState<Row[]>([{ id: 1, grade: 'A', credits: '' }]);
  const [nextId, setNextId] = useState(2);
  const [result, setResult] = useState<CalculationResult<GpaResult> | null>(null);
  const [errors, setErrors] = useState<Record<number, string>>({});

  const updateRow = (id: number, patch: Partial<Row>) => {
    setRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  };

  const addRow = () => {
    if (rows.length >= 20) return;
    setRows((prev) => [...prev, { id: nextId, grade: 'A', credits: '' }]);
    setNextId((n) => n + 1);
    setResult(null);
  };

  const removeRow = (id: number) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((row) => row.id !== id));
    setResult(null);
  };

  const handleCalculate = () => {
    const nextErrors: Record<number, string> = {};
    const entries = rows.map((row) => {
      const parsed = parseAndValidateNumber(row.credits);
      if (!parsed.valid) nextErrors[row.id] = parsed.error as string;
      return { grade: row.grade, credits: parsed.num ?? 0 };
    });

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setResult(null);
      return;
    }

    setResult(calculateGpa(entries));
  };

  const handleReset = () => {
    setRows([{ id: nextId, grade: 'A', credits: '' }]);
    setNextId((n) => n + 1);
    setResult(null);
    setErrors({});
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 space-y-4">
        {rows.map((row, index) => (
          <div key={row.id} className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
            <div>
              <label htmlFor={'gpa-grade-' + row.id} className="mb-1 block text-sm font-medium">
                Course {index + 1} grade
              </label>
              <select
                id={'gpa-grade-' + row.id}
                value={row.grade}
                onChange={(e) => updateRow(row.id, { grade: e.target.value as LetterGrade })}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
              >
                {LETTER_GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={'gpa-credits-' + row.id} className="mb-1 block text-sm font-medium">
                Credits
              </label>
              <input
                id={'gpa-credits-' + row.id}
                type="text"
                inputMode="decimal"
                value={row.credits}
                onChange={(e) => updateRow(row.id, { credits: e.target.value })}
                className={
                  'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
                  (errors[row.id] ? 'border-red-500' : 'border-slate-300 dark:border-slate-700')
                }
              />
              {errors[row.id] && <p className="mt-1 text-xs text-red-600">{errors[row.id]}</p>}
            </div>
            <button
              onClick={() => removeRow(row.id)}
              disabled={rows.length <= 1}
              aria-label={'Remove course ' + (index + 1)}
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-600 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={addRow}
          disabled={rows.length >= 20}
          className="rounded-md border border-brand-600 px-4 py-2 font-medium text-brand-600 hover:bg-brand-50 disabled:opacity-40 dark:hover:bg-slate-800"
        >
          + Add course
        </button>
        <button
          onClick={handleCalculate}
          className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          Calculate GPA
        </button>
        <button
          onClick={handleReset}
          className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>

      <div aria-live="polite">
        {result && (
          <div className="rounded-md bg-slate-100 p-4 dark:bg-slate-800">
            {result.success ? (
              <div className="text-center">
                <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Your GPA (4.0 scale)</p>
                <p className="text-3xl font-bold tabular-nums text-brand-900 dark:text-brand-100">
                  {formatNumber((result.value as GpaResult).gpa, 2)}
                </p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                  Total credits: {formatNumber((result.value as GpaResult).totalCredits)}
                </p>
              </div>
            ) : (
              <p className="text-center font-medium text-red-600">{result.error}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
