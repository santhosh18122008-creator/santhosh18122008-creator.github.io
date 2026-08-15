import { useState, useEffect } from 'react';

interface Card { id: string; front: string; back: string; }

export default function FlashcardMaker() {
  const [cards, setCards] = useState<Card[]>([]);
  const [mode, setMode] = useState<'edit' | 'quiz'>('edit');
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('md-flashcards');
    if (saved) setCards(JSON.parse(saved));
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem('md-flashcards', JSON.stringify(cards));
  }, [cards, loaded]);

  const addCard = () => {
    if (!front.trim() || !back.trim()) return;
    setCards([...cards, { id: Date.now().toString(), front: front.trim(), back: back.trim() }]);
    setFront(''); setBack('');
  };

  const removeCard = (id: string) => setCards(cards.filter(c => c.id !== id));
  const nextCard = () => { setFlipped(false); setCurrentIdx((currentIdx + 1) % cards.length); };
  const prevCard = () => { setFlipped(false); setCurrentIdx((currentIdx - 1 + cards.length) % cards.length); };

  if (!loaded) return <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">Loading...</div>;

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setMode('edit')} aria-pressed={mode === 'edit'} className={'cat-btn ' + (mode === 'edit' ? 'is-active' : '')}>Edit Deck ({cards.length})</button>
        <button onClick={() => { setMode('quiz'); setCurrentIdx(0); setFlipped(false); }} disabled={cards.length === 0} aria-pressed={mode === 'quiz'} className={'cat-btn ' + (mode === 'quiz' ? 'is-active' : '') + ' disabled:opacity-40'}>Quiz Mode</button>
      </div>

      {mode === 'edit' && (
        <div className="mt-5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_1fr_auto] md:items-end">
            <div><label className="mb-1 block text-sm font-medium">Front (Question)</label><input type="text" value={front} onChange={(e) => setFront(e.target.value)} className="field" /></div>
            <div><label className="mb-1 block text-sm font-medium">Back (Answer)</label><input type="text" value={back} onChange={(e) => setBack(e.target.value)} className="field" /></div>
            <button onClick={addCard} className="btn-filled h-[42px]">Add</button>
          </div>
          <div className="mt-4 space-y-2">
            {cards.map(c => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-ink/10 bg-paper p-3 dark:border-ink/20">
                <div className="flex-1 text-sm"><strong>{c.front}</strong> → {c.back}</div>
                <button onClick={() => removeCard(c.id)} className="btn-text text-err">×</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {mode === 'quiz' && cards.length > 0 && (
        <div className="mt-6">
          <div onClick={() => setFlipped(!flipped)} className="flex h-48 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-desk bg-paper p-6 text-center transition-colors duration-150 hover:bg-card dark:border-ink/20">
            <p className="text-xl font-semibold text-ink dark:text-paper">
              {flipped ? cards[currentIdx].back : cards[currentIdx].front}
            </p>
          </div>
          <p className="mt-2 text-center text-xs text-soft">Click the card to flip it. Card {currentIdx + 1} of {cards.length}.</p>
          <div className="mt-4 flex justify-center gap-4">
            <button onClick={prevCard} className="btn-text">← Previous</button>
            <button onClick={nextCard} className="btn-filled">Next →</button>
          </div>
        </div>
      )}
    </div>
  );
}
