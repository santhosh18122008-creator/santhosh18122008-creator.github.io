import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../lib/calculations/time';
import ResultDisplay from './ResultDisplay';

type Mode = 'focus' | 'break';
const PRESETS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

export default function StudyTimer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(PRESETS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => setTimeLeft((p) => p - 1), 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      const next = mode === 'focus' ? 'break' : 'focus';
      setMode(next);
      setTimeLeft(PRESETS[next]);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning((p) => !p);
  const resetTimer = () => { setIsRunning(false); setTimeLeft(PRESETS[mode]); };
  const switchMode = (m: Mode) => { setIsRunning(false); setMode(m); setTimeLeft(PRESETS[m]); };

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex justify-center gap-2">
        <button onClick={() => switchMode('focus')} className={'cat-btn ' + (mode === 'focus' ? 'is-active' : '')}>Focus (25m)</button>
        <button onClick={() => switchMode('break')} className={'cat-btn ' + (mode === 'break' ? 'is-active' : '')}>Break (5m)</button>
      </div>
      <div className="mt-8">
        <ResultDisplay value={formatTime(timeLeft)} label={isRunning ? 'Time remaining' : 'Paused'} />
      </div>
      <div className="mt-6 flex items-center justify-center gap-4">
        <button onClick={toggleTimer} className="btn-filled">{isRunning ? 'Pause' : 'Start'}</button>
        <button onClick={resetTimer} className="btn-text">Reset</button>
      </div>
    </div>
  );
}
