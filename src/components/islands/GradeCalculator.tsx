import { useState } from 'react';
import { calculateGrade, type GradeResult } from '../../lib/calculations/grade';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function GradeCalculator() {
  const [obtained, setObtained] = useState('');
  const [total, setTotal] = useState('');
  const [result, setResult] = useState<GradeResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ obtained?: string; total?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(obtained);
    const v2 = parseAndValidateNumber(total);
    const next: typeof errors = {};
    if (!v1.valid) next.obtained = v1.error;
    if (!v2.valid) next.total = v2.error;
    setErrors(next);
    if (next.obtained || next.total) { setResult(null); setError(''); return; }
    const r = calculateGrade(v1.num as number, v2.num as number);
    if (r.success) { setResult(r.value as GradeResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setObtained(''); setTotal(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="grade-obtained" className="mb-1 block text-sm font-medium">Marks obtained</label>
          <input id="grade-obtained" type="text" inputMode="decimal" value={obtained} onChange={(e) => setObtained(e.target.value)} className={'field' + (errors.obtained ? ' field-invalid' : '')} />
          {errors.obtained && <p className="err-text">{errors.obtained}</p>}
        </div>
        <div>
          <label htmlFor="grade-total" className="mb-1 block text-sm font-medium">Maximum marks</label>
          <input id="grade-total" type="text" inputMode="decimal" value={total} onChange={(e) => setTotal(e.target.value)} className={'field' + (errors.total ? ' field-invalid' : '')} />
          {errors.total && <p className="err-text">{errors.total}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.percentage)} suffix="%" label="Percentage" />
          <p className="text-center text-sm text-soft">Grade: <span className="font-semibold text-ink dark:text-paper">{result.grade}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your marks above to see your grade.</p>
      )}
    </div>
  );
}
