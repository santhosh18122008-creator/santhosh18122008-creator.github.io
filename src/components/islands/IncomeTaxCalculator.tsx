import { useState } from 'react';
import { calculateIncomeTax, type TaxResult, type TaxRegime } from '../../lib/calculations/incomeTax';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function IncomeTaxCalculator() {
  const [income, setIncome] = useState('1200000');
  const [regime, setRegime] = useState<TaxRegime>('new');
  const [deductions, setDeductions] = useState('0');
  const [result, setResult] = useState<TaxResult | null>(null);
  const [error, setError] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleCalculate = () => {
    const v1 = parseAndValidateNumber(income);
    const v2 = parseAndValidateNumber(deductions);
    const next: Record<string, string> = {};
    if (!v1.valid) next.income = v1.error as string;
    if (!v2.valid) next.deductions = v2.error as string;
    setErrors(next);
    if (Object.keys(next).length > 0) { setResult(null); setError(''); return; }
    const r = calculateIncomeTax(v1.num as number, regime, v2.num as number);
    if (r.success) { setResult(r.value as TaxResult); setError(''); }
    else { setResult(null); setError(r.error as string); }
  };

  const handleReset = () => { setIncome('1200000'); setRegime('new'); setDeductions('0'); setResult(null); setError(''); setErrors({}); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setRegime('new')} aria-pressed={regime === 'new'} className={'cat-btn ' + (regime === 'new' ? 'is-active' : '')}>New regime (FY 2024-25)</button>
        <button onClick={() => setRegime('old')} aria-pressed={regime === 'old'} className={'cat-btn ' + (regime === 'old' ? 'is-active' : '')}>Old regime</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label htmlFor="tax-i" className="mb-1 block text-sm font-medium">Gross annual income</label><input id="tax-i" type="text" inputMode="decimal" value={income} onChange={(e) => setIncome(e.target.value)} className={'field' + (errors.income ? ' field-invalid' : '')} />{errors.income && <p className="err-text">{errors.income}</p>}</div>
        <div>
          <label htmlFor="tax-d" className="mb-1 block text-sm font-medium">
            {regime === 'new' ? 'Deductions (80C etc., excluding std. deduction)' : 'Deductions (80C, HRA etc., excluding std. deduction)'}
          </label>
          <input id="tax-d" type="text" inputMode="decimal" value={deductions} onChange={(e) => setDeductions(e.target.value)} className={'field' + (errors.deductions ? ' field-invalid' : '')} />
          {errors.deductions && <p className="err-text">{errors.deductions}</p>}
        </div>
      </div>
      <p className="mt-3 text-xs text-soft">Standard deduction (₹{formatNumber(regime === 'new' ? 75000 : 50000, 0)}) is applied automatically.</p>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate tax</button>
        <button onClick={handleReset} className="btn-text">Reset</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {result ? (
        <div className="mt-6 space-y-3">
          <ResultDisplay value={formatNumber(result.totalTax, 0)} label="Total tax (incl. cess)" />
          <div className="grid grid-cols-2 gap-2 text-sm text-soft sm:grid-cols-3">
            <div><span className="font-semibold text-ink dark:text-paper">Taxable:</span> {formatNumber(result.taxableIncome, 0)}</div>
            <div><span className="font-semibold text-ink dark:text-paper">Tax:</span> {formatNumber(result.tax, 0)}</div>
            <div><span className="font-semibold text-ink dark:text-paper">Cess (4%):</span> {formatNumber(result.cess, 0)}</div>
          </div>
          <p className="text-center text-sm text-soft">Annual in-hand: <span className="font-mono font-semibold text-ink dark:text-paper">{formatNumber(result.inHand, 0)}</span></p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Enter your gross income above to estimate your tax.</p>
      )}
    </div>
  );
}
