import { useState } from 'react';
import { analyzeText } from '../../lib/utilities/text';
import ResultDisplay from './ResultDisplay';

export default function TextCounter() {
  const [text, setText] = useState('');
  const stats = analyzeText(text);

  const readingLabel =
    stats.readingTimeSeconds === 0 ? '0s'
      : stats.readingTimeSeconds < 60 ? '~' + stats.readingTimeSeconds + 's'
      : '~' + Math.floor(stats.readingTimeSeconds / 60) + 'm ' + (stats.readingTimeSeconds % 60) + 's';

  const items = [
    { label: 'Characters', value: stats.characters },
    { label: 'No spaces', value: stats.charactersWithoutSpaces },
    { label: 'Sentences', value: stats.sentences },
    { label: 'Paragraphs', value: stats.paragraphs },
    { label: 'Reading time', value: readingLabel },
  ];

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <label htmlFor="text-input" className="mb-1 block text-sm font-medium">Type or paste your text</label>
      <textarea id="text-input" rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Start typing…" className="field" />
      <div className="mt-6 space-y-3">
        <ResultDisplay value={String(stats.words)} label="Words" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border border-ink/10 bg-paper p-3 text-center dark:border-ink/20">
              <p className="font-mono text-2xl font-bold tabular-nums text-ink dark:text-paper">{item.value}</p>
              <p className="mt-1 text-xs text-soft">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
