import { useState } from 'react';
import { calculateWHR, type WhrResult } from '../../lib/calculations/whr';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function WaistToHipCalculator() {
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [waist, setWaist] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<WhrResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(waist);
    const v2 = parseAndValidateNumber(hip);
    const next: Record<string, string> = {};
    if (!v1.valid) next.waist = v1.error as string;
    if (!v2.valid) next.hip = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateWHR(v1.num as number, v2.num as number, sex);
    if (r.success) { setResult(r.value as WhrResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setSex('male'); setWaist(''); setHip(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSex('male')} aria-pressed={sex === 'male'} className={'cat-btn ' + (sex === 'male' ? 'is-active' : '')}>Male</button>
        <button onClick={() => setSex('female')} aria-pressed={sex === 'female'} className={'cat-btn ' + (sex === 'female' ? 'is-active' : '')}>Female</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div><label htmlFor="whr-w" className="mb-1 block text-sm font-medium">Waist circumference</label><input id="whr-w" type="text" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} className={'field' + (errors.waist ? ' field-invalid' : '')} />{errors.waist && <p className="err-text">{errors.waist}</p>}</div>
        <div><label htmlFor="whr-h" className="mb-1 block text-sm font-medium">Hip circumference</label><input id="whr-h" type="text" inputMode="decimal" value={hip} onChange={(e) => setHip(e.target.value)} className={'field' + (errors.hip ? ' field-invalid' : '')} />{errors.hip && <p className="err-text">{errors.hip}</p>}</div>
      </div>
      <p className="mt-3 text-xs text-soft">Use the same unit (cm or inches) for both measurements.</p>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.ratio, 2)} label="Waist-to-Hip Ratio" />
          <p className="text-center text-sm text-soft">Health risk category: <span className="font-semibold text-ink dark:text-paper">{result.risk}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your measurements to see your ratio and risk category.</p>
      )}
    </div>
  );
}
