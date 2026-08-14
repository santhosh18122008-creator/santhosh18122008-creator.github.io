import { useState } from 'react';
import { calculateNeededScore } from '../../lib/calculations/predictor';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function GradePredictor() {
  const [target, setTarget] = useState('');
  const [current, setCurrent] = useState('');
  const [completed, setCompleted] = useState('');
  const [remaining, setRemaining] = useState('');
  const [result, setResult] = useState<{ needed: number; possible: boolean } | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(target);
    const v2 = parseAndValidateNumber(current);
    const v3 = parseAndValidateNumber(completed);
    const v4 = parseAndValidateNumber(remaining);
    const next: Record<string, string> = {};
    if (!v1.valid) next.target = v1.error as string;
    if (!v2.valid) next.current = v2.error as string;
    if (!v3.valid) next.completed = v3.error as string;
    if (!v4.valid) next.remaining = v4.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateNeededScore(v1.num as number, v2.num as number, v3.num as number, v4.num as number);
    if (r.success) { setResult(r.value as { needed: number; possible: boolean }); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setTarget(''); setCurrent(''); setCompleted(''); setRemaining(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="pred-t" className="mb-1 block text-sm font-medium">Target overall %</label><input id="pred-t" type="text" inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} className={'field' + (errors.target ? ' field-invalid' : '')} />{errors.target && <p className="err-text">{errors.target}</p>}</div>
        <div><label htmlFor="pred-c" className="mb-1 block text-sm font-medium">Current average %</label><input id="pred-c" type="text" inputMode="decimal" value={current} onChange={(e) => setCurrent(e.target.value)} className={'field' + (errors.current ? ' field-invalid' : '')} />{errors.current && <p className="err-text">{errors.current}</p>}</div>
        <div><label htmlFor="pred-cw" className="mb-1 block text-sm font-medium">Completed weight (%)</label><input id="pred-cw" type="text" inputMode="decimal" value={completed} onChange={(e) => setCompleted(e.target.value)} className={'field' + (errors.completed ? ' field-invalid' : '')} />{errors.completed && <p className="err-text">{errors.completed}</p>}</div>
        <div><label htmlFor="pred-rw" className="mb-1 block text-sm font-medium">Remaining weight (%)</label><input id="pred-rw" type="text" inputMode="decimal" value={remaining} onChange={(e) => setRemaining(e.target.value)} className={'field' + (errors.remaining ? ' field-invalid' : '')} />{errors.remaining && <p className="err-text">{errors.remaining}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Predict score needed</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.needed, 1)} suffix="%" label="Score needed on the remaining work" />
          {!result.possible && <p className="text-center text-sm text-soft">This requires a score above 100%, which may be impossible without extra credit.</p>}
        </div>
      )}
    </div>
  );
}
