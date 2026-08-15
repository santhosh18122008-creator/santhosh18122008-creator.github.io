import { useState } from 'react';
import { calculateOneRepMax } from '../../lib/calculations/oneRepMax';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('');
  const [reps, setReps] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(weight);
    const v2 = parseAndValidateNumber(reps);
    const next: Record<string, string> = {};
    if (!v1.valid) next.weight = v1.error as string;
    if (!v2.valid) next.reps = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateOneRepMax(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setWeight(''); setReps(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="orm-w" className="mb-1 block text-sm font-medium">Weight lifted</label><input id="orm-w" type="text" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className={'field' + (errors.weight ? ' field-invalid' : '')} />{errors.weight && <p className="err-text">{errors.weight}</p>}</div>
        <div><label htmlFor="orm-r" className="mb-1 block text-sm font-medium">Reps performed</label><input id="orm-r" type="text" inputMode="numeric" value={reps} onChange={(e) => setReps(e.target.value)} className={'field' + (errors.reps ? ' field-invalid' : '')} />{errors.reps && <p className="err-text">{errors.reps}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate 1RM</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 1)} label="Estimated One-Rep Max (Epley)" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter the weight you lifted and how many reps you completed.</p>
      )}
    </div>
  );
}
