import { useState } from 'react';
import {
  calculatePercentageOf,
  calculateWhatPercentage,
  calculatePercentageChange,
} from '../../lib/calculations/percentage';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

type Mode = 'of' | 'is' | 'change';

const MODES: { id: Mode; label: string }[] = [
  { id: 'of', label: 'X% of Y' },
  { id: 'is', label: 'X is what % of Y' },
  { id: 'change', label: '% change' },
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
  const [result, setResult] = useState<{ value: number; sentence: string } | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ i1?: string; i2?: string }>({});

  const labels = getLabels(mode);

  const switchMode = (next: Mode) => {
    setMode(next);
    setResult(null);
    setError('');
    setErrors({});
  };

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(input1);
    const v2 = parseAndValidateNumber(input2);
    const nextErrors: { i1?: string; i2?: string } = {};
    if (!v1.valid) nextErrors.i1 = v1.error;
    if (!v2.valid) nextErrors.i2 = v2.error;
    setErrors(nextErrors);
    if (nextErrors.i1 || nextErrors.i2) { setResult(null); setError(''); return; }

    const a = v1.num as number;
    const b = v2.num as number;

    if (mode === 'of') {
      const r = calculatePercentageOf(a, b);
      if (!r.success) { setError(r.error as string); setResult(null); return; }
      setResult({ value: r.value as number, sentence: `${formatNumber(a)}% of ${formatNumber(b)} is` });
    } else if (mode === 'is') {
      const r = calculateWhatPercentage(a, b);
      if (!r.success) { setError(r.error as string); setResult(null); return; }
      setResult({ value: r.value as number, sentence: `${formatNumber(a)} is this percent of ${formatNumber(b)}:` });
    } else {
      const r = calculatePercentageChange(a, b);
      if (!r.success) { setError(r.error as string); setResult(null); return; }
      setResult({ value: r.value as number, sentence: `From ${formatNumber(a)} to ${formatNumber(b)} the change is` });
    }
    setError('');
  };

  const handleReset = () => {
    setInput1('');
    setInput2('');
    setResult(null);
    setError('');
    setErrors({});
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div role="tablist" aria-label="Calculation mode" className="mb-6 flex flex-wrap gap-2 border-b border-ink/10">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={mode === m.id}
            onClick={() => switchMode(m.id)}
            className={
              'px-4 py-2 text-sm font-medium transition-colors duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-desk ' +
              (mode === m.id ? 'border-b-2 border-desk text-ink' : 'text-soft hover:text-ink')
            }
          >
            {m.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="calc-input-1" className="mb-1 block text-sm font-medium">{labels.l1}</label>
          <input
            id="calc-input-1"
            type="text"
            inputMode="decimal"
            value={input1}
            onChange={(e) => setInput1(e.target.value)}
            className={'field' + (errors.i1 ? ' field-invalid' : '')}
          />
          {errors.i1 && <p className="err-text">{errors.i1}</p>}
        </div>
        <div>
          <label htmlFor="calc-input-2" className="mb-1 block text-sm font-medium">{labels.l2}</label>
          <input
            id="calc-input-2"
            type="text"
            inputMode="decimal"
            value={input2}
            onChange={(e) => setInput2(e.target.value)}
            className={'field' + (errors.i2 ? ' field-invalid' : '')}
          />
          {errors.i2 && <p className="err-text">{errors.i2}</p>}
        </div>
      </div>

      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>

      {error && <p className="err-text mt-4 text-sm">{error}</p>}

      {result ? (
        <div className="mt-6">
          <ResultDisplay
            value={formatNumber(result.value)}
            suffix={mode !== 'of' ? '%' : undefined}
            label={result.sentence}
          />
        </div>
      ) : (
        !error && (
          <p className="mt-6 text-sm text-soft">Enter two values above to see your result.</p>
        )
      )}
    </div>
  );
}
