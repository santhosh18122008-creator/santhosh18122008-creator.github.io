import { useState, useEffect, useRef } from 'react';
import { formatTime } from '../../lib/calculations/time';

type Mode = 'focus' | 'break';
const PRESETS: Record<Mode, number> = { focus: 25 * 60, break: 5 * 60 };

export default function StudyTimer() {
  const [mode, setMode] = useState<Mode>('focus');
  const [timeLeft, setTimeLeft] = useState(PRESETS.focus);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsRunning(false);
      // Auto switch mode when timer finishes
      const nextMode = mode === 'focus' ? 'break' : 'focus';
      setMode(nextMode);
      setTimeLeft(PRESETS[nextMode]);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft, mode]);

  const toggleTimer = () => setIsRunning((prev) => !prev);

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(PRESETS[mode]);
  };

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(PRESETS[newMode]);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-6 flex justify-center gap-4">
        <button
          onClick={() => switchMode('focus')}
          className={`px-4 py-2 rounded-md font-medium ${mode === 'focus' ? 'bg-brand-900 text-white dark:bg-brand-500' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Focus (25m)
        </button>
        <button
          onClick={() => switchMode('break')}
          className={`px-4 py-2 rounded-md font-medium ${mode === 'break' ? 'bg-brand-900 text-white dark:bg-brand-500' : 'text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          Break (5m)
        </button>
      </div>

      <div className="mb-8 text-center">
        <p className="text-7xl font-bold tabular-nums text-brand-900 dark:text-brand-100">
          {formatTime(timeLeft)}
        </p>
      </div>

      <div className="flex justify-center gap-4">
        <button
          onClick={toggleTimer}
          className="rounded-md bg-brand-900 px-8 py-3 font-semibold text-white hover:bg-brand-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:bg-brand-500 dark:hover:bg-brand-600"
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={resetTimer}
          className="rounded-md border border-slate-300 px-8 py-3 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
