import { useState } from 'react';
import { addTime } from '../../lib/calculations/timeMath';
import { parseAndValidateNumber } from '../../lib/validation/number';
import ResultDisplay from './ResultDisplay';

export default function TimeAddSubtract() {
  const [time, setTime] = useState('14:00');
  const [hours, setHours] = useState('2');
  const [minutes, setMinutes] = useState('30');
  const [mode, setMode] = useState<'add' | 'subtract'>('add');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(hours);
    const v2 = parseAndValidateNumber(minutes);
    const next: Record<string, string> = {};
    if (!v1.valid) next.hours = v1.error as string;
    if (!v2.valid) next.minutes = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = addTime(time, v1.num as number, v2.num as number, mode);
    if (r.success) { setResult(r.value as string); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setTime('14:00'); setHours('2'); setMinutes('30'); setMode('add'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode('add')} aria-pressed={mode === 'add'} className={'cat-btn ' + (mode === 'add' ? 'is-active' : '')}>Add time</button>
        <button onClick={() => setMode('subtract')} aria-pressed={mode === 'subtract'} className={'cat-btn ' + (mode === 'subtract' ? 'is-active' : '')}>Subtract time</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="tm-time" className="mb-1 block text-sm font-medium">Start time (24h)</label><input id="tm-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field" /></div>
        <div><label htmlFor="tm-h" className="mb-1 block text-sm font-medium">Hours</label><input id="tm-h" type="text" inputMode="numeric" value={hours} onChange={(e) => setHours(e.target.value)} className={'field' + (errors.hours ? ' field-invalid' : '')} />{errors.hours && <p className="err-text">{errors.hours}</p>}</div>
        <div><label htmlFor="tm-m" className="mb-1 block text-sm font-medium">Minutes</label><input id="tm-m" type="text" inputMode="numeric" value={minutes} onChange={(e) => setMinutes(e.target.value)} className={'field' + (errors.minutes ? ' field-invalid' : '')} />{errors.minutes && <p className="err-text">{errors.minutes}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6">
          <ResultDisplay value={result} label="Final time" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter a start time and duration above.</p>
      )}
    </div>
  );
}
