import { useState } from 'react';
import { calculateBodyFat, type Sex } from '../../lib/calculations/bodyFat';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function BodyFatCalculator() {
  const [sex, setSex] = useState<Sex>('male');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [neck, setNeck] = useState('');
  const [hip, setHip] = useState('');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const vH = parseAndValidateNumber(height);
    const vW = parseAndValidateNumber(waist);
    const vN = parseAndValidateNumber(neck);
    const vHip = parseAndValidateNumber(hip);
    const next: Record<string, string> = {};
    if (!vH.valid) next.height = vH.error as string;
    if (!vW.valid) next.waist = vW.error as string;
    if (!vN.valid) next.neck = vN.error as string;
    if (sex === 'female' && !vHip.valid) next.hip = vHip.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateBodyFat(sex, vH.num as number, vW.num as number, vN.num as number, vHip.num as number || 0);
    if (r.success) { setResult(r.value as number); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setSex('male'); setHeight(''); setWaist(''); setNeck(''); setHip(''); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setSex('male')} aria-pressed={sex === 'male'} className={'cat-btn ' + (sex === 'male' ? 'is-active' : '')}>Male</button>
        <button onClick={() => setSex('female')} aria-pressed={sex === 'female'} className={'cat-btn ' + (sex === 'female' ? 'is-active' : '')}>Female</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="bf-h" className="mb-1 block text-sm font-medium">Height (cm)</label><input id="bf-h" type="text" inputMode="decimal" value={height} onChange={(e) => setHeight(e.target.value)} className={'field' + (errors.height ? ' field-invalid' : '')} />{errors.height && <p className="err-text">{errors.height}</p>}</div>
        <div><label htmlFor="bf-w" className="mb-1 block text-sm font-medium">Waist at navel (cm)</label><input id="bf-w" type="text" inputMode="decimal" value={waist} onChange={(e) => setWaist(e.target.value)} className={'field' + (errors.waist ? ' field-invalid' : '')} />{errors.waist && <p className="err-text">{errors.waist}</p>}</div>
        <div><label htmlFor="bf-n" className="mb-1 block text-sm font-medium">Neck (cm)</label><input id="bf-n" type="text" inputMode="decimal" value={neck} onChange={(e) => setNeck(e.target.value)} className={'field' + (errors.neck ? ' field-invalid' : '')} />{errors.neck && <p className="err-text">{errors.neck}</p>}</div>
        {sex === 'female' && <div><label htmlFor="bf-hip" className="mb-1 block text-sm font-medium">Hips at widest (cm)</label><input id="bf-hip" type="text" inputMode="decimal" value={hip} onChange={(e) => setHip(e.target.value)} className={'field' + (errors.hip ? ' field-invalid' : '')} />{errors.hip && <p className="err-text">{errors.hip}</p>}</div>}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 1)} suffix="%" label="Estimated body fat (US Navy Method)" />
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your measurements above to estimate your body fat percentage.</p>
      )}
    </div>
  );
}
