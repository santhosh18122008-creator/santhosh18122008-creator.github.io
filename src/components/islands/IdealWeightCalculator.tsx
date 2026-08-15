import { useState } from 'react';
import { calculateIdealWeight, type Sex } from '../../lib/calculations/idealWeight';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ height?: string }>({});

  const handleCalculate = () => {
    const v = parseAndValidateNumber(height);
    if (!v.valid) { setErrors({ height: v.error as string }); setResult(null); setError(''); return; }
    setErrors({});
    const r = calculateIdealWeight(v.num as number, sex);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setHeight(''); setSex('male'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSex('male')} aria-pressed={sex === 'male'} className={'cat-btn ' + (sex === 'male' ? 'is-active' : '')}>Male</button>
        <button onClick={() => setSex('female')} aria-pressed={sex === 'female'} className={'cat-btn ' + (sex === 'female' ? 'is-active' : '')}>Female</button>
      </div>
      <div className="mt-5">
        <label htmlFor="iw-h" className="mb-1 block text-sm font-medium">Height (cm)</label>
        <input id="iw-h" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={'field' + (errors.height ? ' field-invalid' : '')} />
        {errors.height && <p className="err-text">{errors.height}</p>}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 1)} suffix="kg" label="Ideal weight (Devine formula)" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your height to see the Devine-formula ideal weight.</p>
      )}
    </div>
  );
}
