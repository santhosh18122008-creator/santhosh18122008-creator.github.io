import { useState } from 'react';
import { generateRandomInts } from '../../lib/calculations/random';
import { parseAndValidateNumber } from '../../lib/validation/number';
import ResultDisplay from './ResultDisplay';

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x = 0;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}

export default function RandomNumberGenerator() {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('1');
  const [numbers, setNumbers] = useState<number[] | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleGenerate = () => {
    const v1 = parseAndValidateNumber(min);
    const v2 = parseAndValidateNumber(max);
    const v3 = parseAndValidateNumber(count);
    const next: Record<string, string> = {};
    if (!v1.valid) next.min = v1.error as string;
    if (!v2.valid) next.max = v2.error as string;
    if (!v3.valid) next.count = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setNumbers(null); setError(''); return; }
    const r = generateRandomInts(v1.num as number, v2.num as number, v3.num as number, secureRandomInt);
    if (r.success) { setNumbers((r.value as { numbers: number[] }).numbers); setError(''); }
    else { setNumbers(null); setError(r.error as string); }
  };
  const handleReset = () => { setMin('1'); setMax('100'); setCount('1'); setNumbers(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="rnd-min" className="mb-1 block text-sm font-medium">Minimum</label><input id="rnd-min" type="text" inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value)} className={'field' + (errors.min ? ' field-invalid' : '')} />{errors.min && <p className="err-text">{errors.min}</p>}</div>
        <div><label htmlFor="rnd-max" className="mb-1 block text-sm font-medium">Maximum</label><input id="rnd-max" type="text" inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value)} className={'field' + (errors.max ? ' field-invalid' : '')} />{errors.max && <p className="err-text">{errors.max}</p>}</div>
        <div><label htmlFor="rnd-count" className="mb-1 block text-sm font-medium">How many</label><input id="rnd-count" type="text" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value)} className={'field' + (errors.count ? ' field-invalid' : '')} />{errors.count && <p className="err-text">{errors.count}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleGenerate} className="btn-filled">Generate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {numbers && (
        <div className="mt-6">
          {numbers.length === 1 ? (
            <ResultDisplay value={String(numbers[0])} label="Your random number" />
          ) : (
            <div className="rounded-xl border border-ink/10 bg-card p-6 text-center dark:border-ink/20">
              <p className="text-sm text-soft">Your random numbers</p>
              <p className="mt-2 font-mono text-2xl font-bold tabular-nums text-ink dark:text-paper">{numbers.join(', ')}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
