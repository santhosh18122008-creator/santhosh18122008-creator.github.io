import { useState } from 'react';
import { generatePassword, estimateEntropyBits, strengthLabel, MIN_LENGTH, MAX_LENGTH, type PasswordOptions } from '../../lib/utilities/password';
import ResultDisplay from './ResultDisplay';

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x = 0;
  do { crypto.getRandomValues(buf); x = buf[0]; } while (x >= limit);
  return x % max;
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLowercase, setUseLowercase] = useState(true);
  const [useUppercase, setUseUppercase] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const options: PasswordOptions = { length, useLowercase, useUppercase, useNumbers, useSymbols };
  const bits = estimateEntropyBits(options);

  const handleGenerate = () => {
    const r = generatePassword(options, secureRandomInt);
    if (r.success) { setPassword(r.value as string); setError(''); }
    else { setPassword(''); setError(r.error as string); }
  };

  const checkbox = 'h-4 w-4 rounded border-ink/30 bg-card text-desk focus:ring-desk';

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div>
        <label htmlFor="pw-length" className="mb-1 block text-sm font-medium">Length: <span className="font-mono font-semibold text-ink dark:text-paper">{length}</span></label>
        <input id="pw-length" type="range" min={MIN_LENGTH} max={MAX_LENGTH} value={length} onChange={(e) => setLength(Number(e.target.value))} className="w-full accent-desk" />
      </div>
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2"><input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className={checkbox} /> Lowercase (a-z)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className={checkbox} /> Uppercase (A-Z)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className={checkbox} /> Numbers (0-9)</label>
        <label className="flex items-center gap-2"><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className={checkbox} /> Symbols (!@#$)</label>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleGenerate} className="btn-filled">Generate password</button>
      </div>
      {error && <p className="err-text mt-4 text-sm">{error}</p>}
      {password ? (
        <div className="mt-6 space-y-2">
          <ResultDisplay value={password} label="Your password" copyValue={password} />
          <p className="text-center text-sm text-soft">Strength: <span className="font-semibold text-ink dark:text-paper">{strengthLabel(bits)}</span> (~{bits} bits)</p>
        </div>
      ) : (
        !error && <p className="mt-6 text-sm text-soft">Click Generate to create a strong password.</p>
      )}
    </div>
  );
}
