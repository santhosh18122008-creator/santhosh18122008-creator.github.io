import { useState, useEffect, useRef } from 'react';
import { getCountdown, type CountdownResult } from '../../lib/calculations/countdown';
import ResultDisplay from './ResultDisplay';

export default function CountdownTimer() {
  const now = new Date();
  const nextYear = new Date(now.getFullYear() + 1, 0, 1).toISOString().slice(0, 16);
  const [target, setTarget] = useState(nextYear);
  const [countdown, setCountdown] = useState<CountdownResult | null>(null);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const targetMs = new Date(target).getTime();
      setCountdown(getCountdown(targetMs, Date.now()));
    };
    update();
    intervalRef.current = window.setInterval(update, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [target]);

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <label htmlFor="cd-target" className="mb-1 block text-sm font-medium">Target date and time</label>
      <input id="cd-target" type="datetime-local" value={target} onChange={(e) => setTarget(e.target.value)} className="field" />
      
      {countdown && (
        <div className="mt-6 space-y-3">
          {countdown.isPast ? (
            <p className="text-center font-semibold text-err">This date is in the past.</p>
          ) : (
            <>
              <ResultDisplay value={String(countdown.days)} suffix="days" label="Time remaining" />
              <div className="flex justify-center gap-6 text-sm text-soft">
                <span className="font-mono tabular-nums">{countdown.hours}h</span>
                <span className="font-mono tabular-nums">{countdown.minutes}m</span>
                <span className="font-mono tabular-nums">{countdown.seconds}s</span>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
