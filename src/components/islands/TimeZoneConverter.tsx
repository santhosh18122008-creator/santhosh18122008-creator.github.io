import { useState, useEffect } from 'react';
import ResultDisplay from './ResultDisplay';

const COMMON_ZONES = [
  'America/New_York', 'America/Chicago', 'America/Denver', 'America/Los_Angeles',
  'Europe/London', 'Europe/Paris', 'Europe/Berlin', 'Asia/Dubai',
  'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'
];

export default function TimeZoneConverter() {
  const [baseTime, setBaseTime] = useState('');
  const [baseZone, setBaseZone] = useState('America/New_York');
  const [targets, setTargets] = useState<string[]>(['Europe/London', 'Asia/Tokyo']);
  const [results, setResults] = useState<{zone: string, time: string}[]>([]);

  useEffect(() => {
    if (!baseTime) { setResults([]); return; }
    const [h, m] = baseTime.split(':').map(Number);
    const today = new Date();
    today.setHours(h, m, 0, 0);
    
    const formatter = (zone: string) => new Intl.DateTimeFormat('en-US', {
      weekday: 'short', hour: '2-digit', minute: '2-digit', timeZone: zone, hour12: false
    }).format(today);

    setResults(targets.map(z => ({ zone: z, time: formatter(z) })));
  }, [baseTime, baseZone, targets]);

  const updateTarget = (idx: number, val: string) => {
    const next = [...targets];
    next[idx] = val;
    setTargets(next);
  };

  const addTarget = () => { if (targets.length < 5) setTargets([...targets, 'Europe/London']); };
  const removeTarget = (idx: number) => { if (targets.length > 1) setTargets(targets.filter((_, i) => i !== idx)); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="tz-time" className="mb-1 block text-sm font-medium">Time</label>
          <input id="tz-time" type="time" value={baseTime} onChange={(e) => setBaseTime(e.target.value)} className="field" />
        </div>
        <div>
          <label htmlFor="tz-base" className="mb-1 block text-sm font-medium">In this time zone</label>
          <select id="tz-base" value={baseZone} onChange={(e) => setBaseZone(e.target.value)} className="field">
            {COMMON_ZONES.map(z => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium">Compare with:</p>
        <div className="space-y-2">
          {targets.map((t, i) => (
            <div key={i} className="flex gap-2">
              <select value={t} onChange={(e) => updateTarget(i, e.target.value)} className="field flex-1">
                {COMMON_ZONES.map(z => <option key={z} value={z}>{z.replace('_', ' ')}</option>)}
              </select>
              <button onClick={() => removeTarget(i)} disabled={targets.length <= 1} className="btn-text disabled:opacity-40">×</button>
            </div>
          ))}
        </div>
        <button onClick={addTarget} disabled={targets.length >= 5} className="btn-text mt-2 disabled:opacity-40">+ Add zone</button>
      </div>

      {results.length > 0 && (
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg border border-ink/10 bg-paper p-4 text-center dark:border-ink/20">
              <p className="text-xs font-semibold text-soft">{r.zone.split('/').pop()?.replace('_', ' ')}</p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-ink dark:text-paper">{r.time}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
