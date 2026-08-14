import { useState } from 'react';
import { convertCase, type CaseMode } from '../../lib/utilities/caseConverter';
import ResultDisplay from './ResultDisplay';

const MODES: { id: CaseMode; label: string }[] = [
  { id: 'upper', label: 'UPPERCASE' },
  { id: 'lower', label: 'lowercase' },
  { id: 'title', label: 'Title Case' },
  { id: 'sentence', label: 'Sentence case' },
  { id: 'alt', label: 'aLtErNaTiNg' },
];

export default function CaseConverter() {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<CaseMode>('upper');
  const [copied, setCopied] = useState(false);

  const converted = convertCase(text, mode);

  const handleCopy = () => {
    navigator.clipboard.writeText(converted).then(() => {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <label htmlFor="case-text" className="mb-1 block text-sm font-medium">Enter your text</label>
      <textarea id="case-text" rows={4} value={text} onChange={(e) => setText(e.target.value)} placeholder="Type or paste here…" className="field" />
      <div className="mt-4 flex flex-wrap gap-2">
        {MODES.map((m) => (
          <button key={m.id} onClick={() => setMode(m.id)} className={'cat-btn ' + (mode === m.id ? 'is-active' : '')}>
            {m.label}
          </button>
        ))}
      </div>
      <div className="mt-6 space-y-3">
        <ResultDisplay value={converted || '…'} label="Converted text" />
        <div className="text-center">
          <button onClick={handleCopy} disabled={!text} className="btn-text disabled:opacity-40">
            {copied ? 'Copied' : 'Copy result'}
          </button>
        </div>
      </div>
    </div>
  );
}
