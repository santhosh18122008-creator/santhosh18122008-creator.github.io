import { useState } from 'react';
import { calculateTip, type TipResult } from '../../lib/calculations/finance';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function TipCalculator() {
  const [bill, setBill] = useState('');
  const [tip, setTip] = useState('10');
  const [people, setPeople] = useState('1');
  const [result, setResult] = useState<TipResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(bill);
    const v2 = parseAndValidateNumber(tip);
    const v3 = parseAndValidateNumber(people);
    const next: Record<string, string> = {};
    if (!v1.valid) next.bill = v1.error as string;
    if (!v2.valid) next.tip = v2.error as string;
    if (!v3.valid) next.people = v3.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateTip(v1.num as number, v2.num as number, v3.num as number);
    if (r.success) { setResult(r.value as TipResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };
  const handleReset = () => { setBill(''); setTip('10'); setPeople('1'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div><label htmlFor="tip-b" className="mb-1 block text-sm font-medium">Bill amount</label><input id="tip-b" type="text" inputMode="decimal" value={bill} onChange={(e) => setBill(e.target.value)} className={'field' + (errors.bill ? ' field-invalid' : '')} />{errors.bill && <p className="err-text">{errors.bill}</p>}</div>
        <div><label htmlFor="tip-p" className="mb-1 block text-sm font-medium">Tip (%)</label><input id="tip-p" type="text" inputMode="decimal" value={tip} onChange={(e) => setTip(e.target.value)} className={'field' + (errors.tip ? ' field-invalid' : '')} />{errors.tip && <p className="err-text">{errors.tip}</p>}</div>
        <div><label htmlFor="tip-n" className="mb-1 block text-sm font-medium">People</label><input id="tip-n" type="text" inputMode="numeric" value={people} onChange={(e) => setPeople(e.target.value)} className={'field' + (errors.people ? ' field-invalid' : '')} />{errors.people && <p className="err-text">{errors.people}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result && (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.perPerson, 2)} label="Per person" />
          <div className="flex justify-center gap-6 text-sm text-soft">
            <span>Tip: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.tip, 2)}</span></span>
            <span>Total: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.total, 2)}</span></span>
          </div>
        </div>
      )}
    </div>
  );
}
