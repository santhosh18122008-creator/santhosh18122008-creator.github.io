import { useState } from 'react';
import { calculateBmi, type BmiResult } from '../../lib/calculations/bmi';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [result, setResult] = useState<BmiResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ weight?: string; height?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(weight);
    const v2 = parseAndValidateNumber(height);
    const next: typeof errors = {};
    if (!v1.valid) next.weight = v1.error;
    if (!v2.valid) next.height = v2.error;
    setErrors(next);
    if (next.weight || next.height) { setResult(null); setError(''); return; }
    const r = calculateBmi(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as BmiResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setWeight(''); setHeight(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="bmi-w" className="mb-1 block text-sm font-medium">Weight (kg)</label>
          <input id="bmi-w" type="text" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className={'field' + (errors.weight ? ' field-invalid' : '')} />
          {errors.weight && <p className="err-text">{errors.weight}</p>}
        </div>
        <div>
          <label htmlFor="bmi-h" className="mb-1 block text-sm font-medium">Height (cm)</label>
          <input id="bmi-h" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={'field' + (errors.height ? ' field-invalid' : '')} />
          {errors.height && <p className="err-text">{errors.height}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.bmi, 1)} label="Your BMI" />
          <p className="text-center text-sm text-soft">Category: <span className="font-semibold text-ink dark:text-paper">{result.category}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your weight and height above to see your BMI.</p>
      )}
    </div>
  );
}
