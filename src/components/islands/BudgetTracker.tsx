import { useState, useEffect } from 'react';
import { parseAndValidateNumber } from '../../lib/validation/number';
import { formatNumber } from '../../lib/formatting/number';
import ResultDisplay from './ResultDisplay';

interface Entry { id: string; desc: string; amount: number; type: 'in' | 'out'; }

export default function BudgetTracker() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [desc, setDesc] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<'in' | 'out'>('out');
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('md-budget');
    if (saved) setEntries(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('md-budget', JSON.stringify(entries));
  }, [entries, loaded]);

  const addEntry = () => {
    const v = parseAndValidateNumber(amount);
    if (!desc.trim() || !v.valid || (v.num as number) <= 0) { setError('Enter a description and a valid positive amount.'); return; }
    setEntries([...entries, { id: Date.now().toString(), desc: desc.trim(), amount: v.num as number, type }]);
    setDesc(''); setAmount(''); setError('');
  };

  const removeEntry = (id: string) => setEntries(entries.filter(e => e.id !== id));

  const totalIn = entries.filter(e => e.type === 'in').reduce((sum, e) => sum + e.amount, 0);
  const totalOut = entries.filter(e => e.type === 'out').reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIn - totalOut;

  if (!loaded) return <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">Loading...</div>;

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="mb-6 grid grid-cols-3 gap-3">
        <div><p className="text-xs text-soft">Income</p><p className="font-mono text-lg font-bold text-ink dark:text-paper">{formatNumber(totalIn, 2)}</p></div>
        <div><p className="text-xs text-soft">Expenses</p><p className="font-mono text-lg font-bold text-ink dark:text-paper">{formatNumber(totalOut, 2)}</p></div>
        <div><p className="text-xs text-soft">Balance</p><p className={'font-mono text-lg font-bold ' + (balance >= 0 ? 'text-ink dark:text-paper' : 'text-err')}>{formatNumber(balance, 2)}</p></div>
      </div>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto_auto] md:items-end">
        <div><label className="mb-1 block text-sm font-medium">Description</label><input type="text" value={desc} onChange={(e) => setDesc(e.target.value)} className="field" /></div>
        <div><label className="mb-1 block text-sm font-medium">Amount</label><input type="text" inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} className="field" /></div>
        <div>
          <select value={type} onChange={(e) => setType(e.target.value as 'in' | 'out')} className="field">
            <option value="out">Expense</option>
            <option value="in">Income</option>
          </select>
        </div>
        <button onClick={addEntry} className="btn-filled h-[42px]">Add</button>
      </div>
      {error && <p className="err-text mt-2">{error}</p>}

      <div className="mt-6 space-y-2">
        {[...entries].reverse().map(e => (
          <div key={e.id} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-3 dark:border-ink/20">
            <div className={'h-2 w-2 rounded-full ' + (e.type === 'in' ? 'bg-desk' : 'bg-err')} />
            <div className="flex-1 text-sm">{e.desc}</div>
            <div className={'font-mono text-sm font-semibold ' + (e.type === 'in' ? 'text-desk' : 'text-err')}>
              {e.type === 'in' ? '+' : '-'}{formatNumber(e.amount, 2)}
            </div>
            <button onClick={() => removeEntry(e.id)} className="btn-text text-err">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
