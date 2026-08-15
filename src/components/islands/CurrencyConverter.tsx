import { useState, useEffect } from 'react';
import { fetchRates, convertCurrency, type CurrencyRates } from '../../lib/calculations/currency';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

export default function CurrencyConverter() {
  const [ratesData, setRatesData] = useState<CurrencyRates | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  
  const [amount, setAmount] = useState('100');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');

  useEffect(() => {
    fetchRates()
      .then(setRatesData)
      .catch(() => setFetchError('Could not load live exchange rates. Please check your internet connection.'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20"><p className="text-sm text-soft">Loading live exchange rates...</p></div>;
  if (fetchError || !ratesData) return <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20"><p className="err-text">{fetchError || 'Unknown error.'}</p></div>;

  const allCurrencies = Object.keys(ratesData.rates).sort();
  
  const handleSwap = () => { setFrom(to); setTo(from); };

  const v = parseAndValidateNumber(amount);
  let result: number | null = null;
  let calcError = '';
  if (v.valid) {
    const r = convertCurrency(v.num as number, from, to, ratesData.rates);
    if (r.success) result = r.value as number;
    else calcError = r.error as string;
  } else {
    calcError = v.error as string;
  }

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_1fr] md:items-end">
        <div>
          <label htmlFor="cur-amt" className="mb-1 block text-sm font-medium">Amount</label>
          <input id="cur-amt" type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="field" />
        </div>
        <div className="flex items-center justify-center pb-2">
          <button onClick={handleSwap} className="btn-text text-xl" aria-label="Swap currencies">⇄</button>
        </div>
        <div></div>
        <div>
          <label htmlFor="cur-from" className="mb-1 block text-sm font-medium">From</label>
          <select id="cur-from" value={from} onChange={(e) => setFrom(e.target.value)} className="field">
            {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div></div>
        <div>
          <label htmlFor="cur-to" className="mb-1 block text-sm font-medium">To</label>
          <select id="cur-to" value={to} onChange={(e) => setTo(e.target.value)} className="field">
            {allCurrencies.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      <p className="mt-3 text-xs text-soft">Rates updated: {new Date(ratesData.date).toLocaleDateString()} (cached for 24h)</p>

      {calcError && <p className="err-text mt-4 text-sm">{calcError}</p>}
      {result !== null ? (
        <div className="mt-6">
          <ResultDisplay value={formatNumber(result, 2)} suffix={to} label="Converted amount" />
        </div>
      ) : (
        !calcError && <p className="mt-6 text-sm text-soft">Enter an amount to convert.</p>
      )}
    </div>
  );
}
