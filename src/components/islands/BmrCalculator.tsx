import { useState } from 'react';
import { calculateBmr, type BmrResult, type Sex, type ActivityLevel } from '../../lib/calculations/bmr';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

const ACTIVITIES: { id: ActivityLevel; label: string }[] = [
  { id: 'sedentary', label: 'Sedentary (office job)' },
  { id: 'light', label: 'Light (1-3 days/week)' },
  { id: 'moderate', label: 'Moderate (3-5 days/week)' },
  { id: 'active', label: 'Active (6-7 days/week)' },
  { id: 'very-active', label: 'Very active (physical job)' },
];

export default function BmrCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<Sex>('male');
  const [activity, setActivity] = useState<ActivityLevel>('moderate');
  const [result, setResult] = useState<BmrResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(weight);
    const v2 = parseAndValidateNumber(height);
    const v3 = parseAndValidateNumber(age);
    const next: Record<string, string> = {};
    if (!v1.valid) next.weight = v1.error as string;
    if (!v2.valid) next.height = v2.error as string;
    if (!v3.valid) next.age = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateBmr(v1.num as number, v2.num as number, v3.num as number, sex, activity);
    if (r.success) { setResult(r.value as BmrResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setWeight(''); setHeight(''); setAge(''); setSex('male'); setActivity('moderate'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSex('male')} aria-pressed={sex === 'male'} className={'cat-btn ' + (sex === 'male' ? 'is-active' : '')}>Male</button>
        <button onClick={() => setSex('female')} aria-pressed={sex === 'female'} className={'cat-btn ' + (sex === 'female' ? 'is-active' : '')}>Female</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="bmr-w" className="mb-1 block text-sm font-medium">Weight (kg)</label><input id="bmr-w" type="text" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value)} className={'field' + (errors.weight ? ' field-invalid' : '')} />{errors.weight && <p className="err-text">{errors.weight}</p>}</div>
        <div><label htmlFor="bmr-h" className="mb-1 block text-sm font-medium">Height (cm)</label><input id="bmr-h" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={'field' + (errors.height ? ' field-invalid' : '')} />{errors.height && <p className="err-text">{errors.height}</p>}</div>
        <div><label htmlFor="bmr-a" className="mb-1 block text-sm font-medium">Age</label><input id="bmr-a" type="text" inputMode="numeric" value={age} onChange={(e) => setAge(e.target.value)} className={'field' + (errors.age ? ' field-invalid' : '')} />{errors.age && <p className="err-text">{errors.age}</p>}</div>
      </div>
      <div className="mt-4">
        <label htmlFor="bmr-act" className="mb-1 block text-sm font-medium">Activity level</label>
        <select id="bmr-act" value={activity} onChange={(e) => setActivity(e.target.value as ActivityLevel)} className="field">
          {ACTIVITIES.map((a) => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.tdee, 0)} suffix="kcal" label="Daily calorie needs (TDEE)" />
          <p className="text-center text-sm text-soft">Basal metabolic rate: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.bmr, 0)} kcal</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your details to estimate your daily calorie needs.</p>
      )}
    </div>
  );
}
