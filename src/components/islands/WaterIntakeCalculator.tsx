import { useState } from 'react';
import { calculateWaterIntake } from '../../lib/calculations/waterIntake';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function WaterIntakeCalculator() {
  const [weight, setWeight] = useState('');
  const [exercise, setExercise] = useState('0');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(weight);
    const v2 = parseAndValidateNumber(exercise);
    const next: Record<string, string> = {};
    if (!v1.valid) next.weight = v1.error as string;
    if (!v2.valid) next.exercise = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateWaterIntake(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setWeight(''); setExercise('0'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="wa-w" className="mb-1 block text-sm font-medium">Body weight (kg)</label><input id="wa-w" type="text" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className={'field' + (errors.weight ? ' field-invalid' : '')} />{errors.weight && <p className="err-text">{errors.weight}</p>}</div>
        <div><label htmlFor="wa-e" className="mb-1 block text-sm font-medium">Exercise today (minutes)</label><input id="wa-e" type="text" inputMode="numeric" value={exercise} onChange={(e) => setExercise(e.target.value)} className={'field' + (errors.exercise ? ' field-invalid' : '')} />{errors.exercise && <p className="err-text">{errors.exercise}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result / 1000, 2)} suffix="L" label="Recommended daily water" />
          <p className="text-center text-sm text-soft">That is <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result, 0)} ml</span>, or about <span className="font-mono font-semibold text-ink dark:text-paper">{Math.round(result / 250)}</span> cups (250ml each).</p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your weight to see how much water you should drink.</p>
      )}
    </div>
  );
}
