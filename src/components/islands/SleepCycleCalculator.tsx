import { useState } from 'react';
import { calculateSleepTimes } from '../../lib/calculations/sleep';

export default function SleepCycleCalculator() {
  const [mode, setMode] = useState<'wake' | 'sleep'>('wake');
  const [time, setTime] = useState('07:00');
  const [times, setTimes] = useState<string[]>([]);

  const handleCalculate = () => {
    setTimes(calculateSleepTimes(time, mode));
  };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode('wake')} aria-pressed={mode === 'wake'} className={'cat-btn ' + (mode === 'wake' ? 'is-active' : '')}>I need to wake up at</button>
        <button onClick={() => setMode('sleep')} aria-pressed={mode === 'sleep'} className={'cat-btn ' + (mode === 'sleep' ? 'is-active' : '')}>I am going to bed at</button>
      </div>
      <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label htmlFor="sl-time" className="mb-1 block text-sm font-medium">{mode === 'wake' ? 'Wake-up time' : 'Bedtime'}</label>
          <input id="sl-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} className="field" />
        </div>
      </div>
      <div className="mt-6 flex items-center gap-4">
        <button onClick={handleCalculate} className="btn-filled">Calculate cycles</button>
      </div>
      {times.length > 0 && (
        <div className="mt-6 rounded-xl border border-ink/10 bg-card p-6 text-center dark:border-ink/20">
          <p className="text-sm text-soft">
            {mode === 'wake' ? 'You should fall asleep at one of these times:' : 'You will wake up naturally at one of these times:'}
          </p>
          <p className="mt-1 text-xs text-soft">(Based on 90-minute sleep cycles{mode === 'sleep' ? ' + 15 mins to fall asleep' : ''})</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {times.map((t, i) => (
              <div key={i} className="rounded-lg border border-ink/10 bg-paper p-3 dark:border-ink/20">
                <p className="font-mono text-2xl font-bold tabular-nums text-ink dark:text-paper">{t}</p>
                <p className="mt-1 text-xs text-soft">{i + 1} cycles ({(i + 1) * 1.5}h)</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
