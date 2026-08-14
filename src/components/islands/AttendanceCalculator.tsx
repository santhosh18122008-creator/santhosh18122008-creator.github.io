import { useState } from 'react';
import { calculateAttendance, type AttendanceResult } from '../../lib/calculations/attendance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function AttendanceCalculator() {
  const [attended, setAttended] = useState('');
  const [total, setTotal] = useState('');
  const [target, setTarget] = useState('75');
  const [result, setResult] = useState<AttendanceResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<{ attended?: string; total?: string; target?: string }>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(attended);
    const v2 = parseAndValidateNumber(total);
    const v3 = parseAndValidateNumber(target);
    const next: typeof errors = {};
    if (!v1.valid) next.attended = v1.error;
    if (!v2.valid) next.total = v2.error;
    if (!v3.valid) next.target = v3.error;
    setErrors(next);
    if (next.attended || next.total || next.target) { setResult(null); setError(''); return; }
    const r = calculateAttendance(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as AttendanceResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setAttended(''); setTotal(''); setTarget('75'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="att-attended" className="mb-1 block text-sm font-medium">Classes attended</label>
          <input id="att-attended" type="text" inputMode="numeric" value={attended} onChange={(e) => setAttended(e.target.value)} className={'field' + (errors.attended ? ' field-invalid' : '')} />
          {errors.attended && <p className="err-text">{errors.attended}</p>}
        </div>
        <div>
          <label htmlFor="att-total" className="mb-1 block text-sm font-medium">Total classes</label>
          <input id="att-total" type="text" inputMode="numeric" value={total} onChange={(e) => setTotal(e.target.value)} className={'field' + (errors.total ? ' field-invalid' : '')} />
          {errors.total && <p className="err-text">{errors.total}</p>}
        </div>
        <div>
          <label htmlFor="att-target" className="mb-1 block text-sm font-medium">Target %</label>
          <input id="att-target" type="text" inputMode="numeric" value={target} onChange={(e) => setTarget(e.target.value)} className={'field' + (errors.target ? ' field-invalid' : '')} />
          {errors.target && <p className="err-text">{errors.target}</p>}
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.currentPercentage)} suffix="%" label="Current attendance" />
          {result.status === 'below' && <p className="text-center text-sm text-soft">Attend <span className="font-semibold text-ink dark:text-paper">{result.classesNeeded}</span> consecutive classes to reach your target.</p>}
          {result.status === 'above' && <p className="text-center text-sm text-soft">You can safely skip <span className="font-semibold text-ink dark:text-paper">{result.classesSkippable}</span> classes and still meet your target.</p>}
          {result.status === 'met' && <p className="text-center text-sm text-soft">You are exactly at your target.</p>}
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your classes above to see where you stand.</p>
      )}
    </div>
  );
}
