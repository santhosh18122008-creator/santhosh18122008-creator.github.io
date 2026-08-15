import { useState, useEffect } from 'react';
import { parseAndValidateNumber } from '../../lib/validation/number';

interface Task { id: string; title: string; due: string; priority: number; done: boolean; }

export default function AssignmentTracker() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [due, setDue] = useState('');
  const [priority, setPriority] = useState('3');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('md-assignments');
    if (saved) setTasks(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('md-assignments', JSON.stringify(tasks));
  }, [tasks, loaded]);

  const addTask = () => {
    if (!title.trim() || !due) return;
    const p = parseAndValidateNumber(priority);
    const pNum = p.valid ? Math.max(1, Math.min(5, p.num as number)) : 3;
    setTasks([...tasks, { id: Date.now().toString(), title: title.trim(), due, priority: pNum, done: false }]);
    setTitle('');
  };

  const toggleDone = (id: string) => setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  const removeTask = (id: string) => setTasks(tasks.filter(t => t.id !== id));

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.done !== b.done) return a.done ? 1 : -1;
    if (a.priority !== b.priority) return a.priority - b.priority; // 1 is highest
    return new Date(a.due).getTime() - new Date(b.due).getTime();
  });

  if (!loaded) return <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">Loading...</div>;

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-[2fr_1fr_1fr_auto] md:items-end">
        <div>
          <label className="mb-1 block text-sm font-medium">Assignment</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="field" placeholder="e.g. Math Essay" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <input type="date" value={due} onChange={(e) => setDue(e.target.value)} className="field" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Priority (1-5)</label>
          <input type="text" inputMode="numeric" value={priority} onChange={(e) => setPriority(e.target.value)} className="field" />
        </div>
        <button onClick={addTask} className="btn-filled h-[42px]">Add</button>
      </div>

      <div className="mt-6 space-y-2">
        {sortedTasks.length === 0 && <p className="text-center text-sm text-soft">Add your first assignment above. Everything is saved privately in your browser.</p>}
        {sortedTasks.map(t => (
          <div key={t.id} className={'flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-3 dark:border-ink/20 ' + (t.done ? 'opacity-50' : '')}>
            <input type="checkbox" checked={t.done} onChange={() => toggleDone(t.id)} className="h-5 w-5 rounded border-ink/30 text-desk focus:ring-desk" />
            <div className="flex-1">
              <p className={'font-semibold ' + (t.done ? 'line-through' : '')}>{t.title}</p>
              <p className="text-xs text-soft">Due: {t.due} · Priority: {t.priority}</p>
            </div>
            <button onClick={() => removeTask(t.id)} className="btn-text text-err">×</button>
          </div>
        ))}
      </div>
    </div>
  );
}
