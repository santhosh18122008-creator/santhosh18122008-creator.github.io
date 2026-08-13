import { useState } from 'react';
import { analyzeText } from '../../lib/utilities/text';

export default function TextCounter() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);

  const readingLabel =
    stats.readingTimeSeconds === 0
      ? '0 sec'
      : stats.readingTimeSeconds < 60
        ? '~' + stats.readingTimeSeconds + ' sec'
        : '~' + Math.floor(stats.readingTimeSeconds / 60) + ' min ' + (stats.readingTimeSeconds % 60) + ' sec';

  const items = [
    { label: 'Words', value: stats.words },
    { label: 'Characters', value: stats.characters },
    { label: 'No spaces', value: stats.charactersWithoutSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <label htmlFor="text-input" className="mb-1 block text-sm font-medium">
        Type or paste your text
      </label>
      <textarea
        id="text-input"
        rows={8}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing…"
        className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-500 dark:border-slate-700 dark:bg-slate-950"
      />

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3" aria-live="polite">
        {items.map((item) => (
          <div key={item.label} className="rounded-md bg-slate-100 p-3 text-center dark:bg-slate-800">
            <p className="text-2xl font-bold tabular-nums text-brand-900 dark:text-brand-100">{item.value}</p>
            <p className="text-xs text-slate-600 dark:text-slate-300">{item.label}</p>
          </div>
        ))}
        <div className="rounded-md bg-slate-100 p-3 text-center dark:bg-slate-800">
          <p className="text-2xl font-bold text-brand-900 dark:text-brand-100">{readingLabel}</p>
          <p className="text-xs text-slate-600 dark:text-slate-300">Reading time</p>
        </div>
      </div>
    </div>
  );
}
