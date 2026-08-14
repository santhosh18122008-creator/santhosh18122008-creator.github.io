import { useEffect, useRef, useState } from 'react';

interface Props {
  value: string;
  suffix?: string;
  label?: string;
  copyValue?: string;
}

export default function ResultDisplay({ value, suffix, label, copyValue }: Props) {
  const [drawn, setDrawn] = useState(false);
  const [copied, setCopied] = useState(false);
  const first = useRef(true);

  useEffect(() => {
    setDrawn(false);
    if (first.current) { first.current = false; }
    const id = window.setTimeout(() => setDrawn(true), 30);
    return () => window.clearTimeout(id);
  }, [value]);

  const handleCopy = () => {
    navigator.clipboard
      .writeText(copyValue ?? value)
      .then(() => { setCopied(true); window.setTimeout(() => setCopied(false), 1500); })
      .catch(() => {});
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 text-center dark:border-ink/20">
      {label && <p className="text-sm text-soft">{label}</p>}
      <p
        aria-live="polite"
        className={'result-highlight font-mono text-5xl font-bold tracking-tight sm:text-6xl ' + (drawn ? 'drawn' : '')}
      >
        {value}
        {suffix ? <span className="ml-1 align-baseline text-2xl font-medium text-soft">{suffix}</span> : null}
      </p>
      <button type="button" onClick={handleCopy} className="btn-text mt-4">
        {copied ? 'Copied' : 'Copy result'}
      </button>
    </div>
  );
}
