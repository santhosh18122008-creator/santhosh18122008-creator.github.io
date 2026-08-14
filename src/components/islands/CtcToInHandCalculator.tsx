import { useState } from 'react';
import { calculateCtcToInHand, type SalaryBreakdown } from '../../lib/calculations/salary';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function CtcToInHandCalculator() {
  const [ctc, setCtc] = useState('1200000');
  const [basic, setBasic] = useState('40');
  const [hra, setHra] = useState('40');
  const [pt, setPt] = useState('200');
  const [result, setResult] = useState<SalaryBreakdown | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(ctc);
    const v2 = parseAndValidateNumber(basic);
    const v3 = parseAndValidateNumber(hra);
    const v4 = parseAndValidateNumber(pt);
    const next: Record<string, string> = {};
    if (!v1.valid) next.ctc = v1.error as string;
    if (!v2.valid) next.basic = v2.error as string;
    if (!v3.valid) next.hra = v3.error as string;
    if (!v4.valid) next.pt = v4.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateCtcToInHand(v1.num as number, v2.num as number, v3.num as number, v4.num as number);
    if (r.success) { setResult(r.value as SalaryBreakdown); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setCtc('1200000'); setBasic('40'); setHra('40'); setPt('200'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="ctc-v" className="mb-1 block text-sm font-medium">Annual CTC</label><input id="ctc-v" type="text" inputMode="decimal" value={ctc} onChange={(e) => setCtc(e.target.value)} className={'field' + (errors.ctc ? ' field-invalid' : '')} />{errors.ctc && <p className="err-text">{errors.ctc}</p>}</div>
        <div><label htmlFor="ctc-pt" className="mb-1 block text-sm font-medium">Professional tax (per month)</label><input id="ctc-pt" type="text" inputMode="decimal" value={pt} onChange={(e) => setPt(e.target.value)} className={'field' + (errors.pt ? ' field-invalid' : '')} />{errors.pt && <p className="err-text">{errors.pt}</p>}</div>
        <div><label htmlFor="ctc-b" className="mb-1 block text-sm font-medium">Basic (% of CTC)</label><input id="ctc-b" type="text" inputMode="decimal" value={basic} onChange={(e) => setBasic(e.target.value)} className={'field' + (errors.basic ? ' field-invalid' : '')} />{errors.basic && <p className="err-text">{errors.basic}</p>}</div>
        <div><label htmlFor="ctc-h" className="mb-1 block text-sm font-medium">HRA (% of Basic)</label><input id="ctc-h" type="text" inputMode="decimal" value={hra} onChange={(e) => setHra(e.target.value)} className={'field' + (errors.hra ? ' field-invalid' : '')} />{errors.hra && <p className="err-text">{errors.hra}</p>}</div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.monthlyInHand, 0)} label="Monthly in-hand (approx)" />
          <div className="grid grid-cols-2 gap-2 text-sm text-soft sm:grid-cols-3">
            <div><span className="font-semibold text-ink dark:text-paper">Basic:</span> {formatNumber(result.basic, 0)}/yr</div>
            <div><span className="font-semibold text-ink dark:text-paper">HRA:</span> {formatNumber(result.hra, 0)}/yr</div>
            <div><span className="font-semibold text-ink dark:text-paper">Special:</span> {formatNumber(result.specialAllowance, 0)}/yr</div>
            <div><span className="font-semibold text-ink dark:text-paper">Employer PF:</span> {formatNumber(result.employerPf, 0)}/yr</div>
            <div><span className="font-semibold text-ink dark:text-paper">Employee PF:</span> {formatNumber(result.employeePf, 0)}/yr</div>
            <div><span className="font-semibold text-ink dark:text-paper">Gratuity:</span> {formatNumber(result.gratuity, 0)}/yr</div>
          </div>
          <p className="text-center text-xs text-soft">Annual in-hand: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.annualInHand, 0)}</span>. This excludes income tax — use the Income Tax Calculator for full take-home.</p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your CTC above to see a salary breakup.</p>
      )}
    </div>
  );
}
