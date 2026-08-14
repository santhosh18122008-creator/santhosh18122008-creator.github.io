import { useState } from 'react';
import { cgpaToPercentage } from '../../lib/calculations/cgpa';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function CgpaToPercentageCalculator() {
  const [cgpa, setCgpa] = useState('');
  const [multiplier, setMultiplier] = useState('9.5');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ cgpa?: string; multiplier?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(cgpa);
    const v2 = parseAndValidateNumber(multiplier);
    const next: typeof errors = {};
    if (!v1.valid) next.cgpa = v1.error;
    if (!v2.valid) next.multiplier = v2.error;
    setErrors(next);
    if (next.cgpa || next.multiplier) { setResult(null); setError(''); return; }
    const r = cgpaToPercentage(v1.num as number, v2.num as number);
    if (r.success) { setResult((r.value as { percentage: number }).percentage); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setCgpa(''); setMultiplier('9.5'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="cgpa-val" className="mb-1 block text-sm font-medium">Your CGPA (out of 10)</label>
          <input id="cgpa-val" type="text" inputMode="decimal" value={cgpa} onChange={(e) => setCgpa(e.target.value)} className={'field' + (errors.cgpa ? ' field-invalid' : '')} />
          {errors.cgpa && <p className="err-text">{errors.cgpa}</p>}
        </div>
        <div>
          <label htmlFor="cgpa-mult" className="mb-1 block text-sm font-medium">Multiplier</label>
          <input id="cgpa-mult" type="text" inputMode="decimal" value={multiplier} onChange={(e) => setMultiplier(e.target.value)} className={'field' + (errors.multiplier ? ' field-invalid' : '')} />
          {errors.multiplier && <p className="err-text">{errors.multiplier}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 2)} suffix="%" label="Equivalent percentage" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your CGPA above to see the percentage.</p>
      )}
    </div>
  );
}
