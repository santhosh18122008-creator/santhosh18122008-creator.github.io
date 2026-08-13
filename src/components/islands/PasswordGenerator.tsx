import { useState } from 'react';
import {
  generatePassword,
  estimateEntropyBits,
  strengthLabel,
  MIN_LENGTH,
  MAX_LENGTH,
  type PasswordOptions,
} from '../../lib/utilities/password';

function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1);
  const limit = Math.floor(0xffffffff / max) * max;
  let x = 0;
  do {
    crypto.getRandomValues(buf);
    x = buf[0];
  } while (x >= limit);
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
  const [copied, setCopied] = useState(false);

  const options: PasswordOptions = { length, useLowercase, useUppercase, useNumbers, useSymbols };
  const bits = estimateEntropyBits(options);

  const handleGenerate = () => {
    setCopied(false);
    const res = generatePassword(options, secureRandomInt);
    if (res.success) {
      setPassword(res.value as string);
      setError('');
    } else {
      setPassword('');
      setError(res.error as string);
    }
  };

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard
      .writeText(password)
      .then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => setError('Copying failed. Please select and copy manually.'));
  };

  const checkboxClass = 'h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500';

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6">
        <label htmlFor="pw-length" className="mb-1 block text-sm font-medium">
          Length: <span className="font-bold tabular-nums">{length}</span>
        </label>
        <input
          id="pw-length"
          type="range"
          min={MIN_LENGTH}
          max={MAX_LENGTH}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full accent-brand-600"
        />
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useLowercase} onChange={(e) => setUseLowercase(e.target.checked)} className={checkboxClass} />
          Lowercase (a-z)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useUppercase} onChange={(e) => setUseUppercase(e.target.checked)} className={checkboxClass} />
          Uppercase (A-Z)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useNumbers} onChange={(e) => setUseNumbers(e.target.checked)} className={checkboxClass} />
          Numbers (0-9)
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} className={checkboxClass} />
          Symbols (!@#$)
        </label>
      </div>

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={handleGenerate}
          className="rounded-md bg-brand-900 px-5 py-2 font-medium text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          Generate Password
        </button>
        <button
          onClick={handleCopy}
          disabled={!password}
          className="rounded-md border border-slate-300 px-5 py-2 hover:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      <div aria-live="polite">
        {error && <p className="mb-4 text-center font-medium text-red-600">{error}</p>}
        {password && (
          <div className="rounded-md bg-slate-100 p-4 text-center dark:bg-slate-800">
            <p className="break-all font-mono text-lg font-bold tabular-nums text-brand-900 dark:text-brand-100">{password}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Strength: <span className="font-bold">{strengthLabel(bits)}</span> (~{bits} bits)
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
