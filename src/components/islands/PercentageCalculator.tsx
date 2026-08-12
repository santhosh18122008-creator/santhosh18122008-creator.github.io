import { useState } from 'react';
import {
  calculatePercentageOf,
  calculateWhatPercentage,
  calculatePercentageChange,
  type CalculationResult,
} from '../../lib/calculations/percentage';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';

type Mode = 'of' | 'is' | 'change';

const MODES: { id: Mode; label: string }[] = [
  { id: 'of', label: 'X% of Y' },
  { id: 'is', label: 'X is what % of Y' },
  { id: 'change', label: '% Change' },
];

function getLabels(mode: Mode): { l1: string; l2: string } {
  if (mode === 'of') return { l1: 'Percentage (X)', l2: 'Number (Y)' };
  if (mode === 'is') return { l1: 'Value (X)', l2: 'Total (Y)' };
  return { l1: 'Original value', l2: 'New value' };
}

export default function PercentageCalculator() {
  const [mode, setMode] = useState<Mode>('of');
  const [input1, setInput1] = useState('');
  const [input2, setInput2] = useState('');
  const [result, setResult] = useState<CalculationResult<number> | null>(null);
  const [errors, setErrors] = useState<{ i1?: string; i2?: string }>({});

  const labels = getLabels(mode);

  const switchMode = (next: Mode) => {
    setMode(next);
    setResult(null);
    setErrors({});
  };

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(input1);
    const v2 = parseAndValidateNumber(input2);

    const nextErrors: { i1?: string; i2?: string } = {};
    if (!v1.valid) nextErrors.i1 = v1.error;
    if (!v2.valid) nextErrors.i2 = v2.error;

    setErrors(nextErrors);
    if (nextErrors.i1 || nextErrors.i2) {
      setResult(null);
      return;
    }

    let res: CalculationResult<number>;
    if (mode === 'of') res = calculatePercentageOf(v1.num as number, v2.num as number);
    else if (mode === 'is') res = calculateWhatPercentage(v1.num as number, v2.num as number);
    else res = calculatePercentageChange(v1.num as number, v2.num as number);

    setResult(res);
  };

  const handleReset = () => {
    setInput1('');
    setInput2('');
    setResult(null);
    setErrors({});
  };

  const inputClass = (hasError: boolean) =>
    'w-full rounded-md border bg-white px-3 py-2 tabular-nums focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-slate-950 ' +
    (hasError ? 'border-red-500' : 'border-slate-300 dark:border-slate-700');

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div role="tablist" aria-label="Calculation mode" className="mb-6 flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-700">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => switchMode(m.id)}
            className={
              'px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 ' +
              (mode === m.id
                ? 'border-b-2 border-brand-600 text-brand-900 dark:text-brand-100'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200')
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="calc-input-1" className="mb-1 block text-sm font-medium">
            {labels.l1}
          </label>
          <input
            id="calc-input-1"
            type="text"
            inputMode="decimal"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            className={inputClass(Boolean(errors.i1))}
          />
          {errors.i1 && <p className="mt-1 text-xs text-red-600">{errors.i1}</p>}
        </div>
        <div>
          <label htmlFor="calc-input-2" className="mb-1 block text-sm font-medium">
            {labels.l2}
          </label>
          <input
            id="calc-input-2"
            type="text"
            inputMode="decimal"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            className={inputClass(Boolean(errors.i2))}
          />
          {errors.i2 && <p className="mt-1 text-xs text-red-600">{errors.i2}</p>}
        </div>
      </div>

      <div className="mb-6 flex gap-3">
        <button
          onClick={handleCalculate}
          className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          Calculate
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
                <p className="mb-1 text-sm text-slate-600 dark:text-slate-300">Result</p>
                <p className="text-3xl font-bold tabular-nums text-brand-900 dark:text-brand-100">
                  {formatNumber(result.value as number)}
                  {mode !== 'of' ? '%' : ''}
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
