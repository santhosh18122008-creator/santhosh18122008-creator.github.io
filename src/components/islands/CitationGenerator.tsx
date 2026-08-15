import { useState } from 'react';
import { generateCitation, type CitationStyle, type SourceType } from '../../lib/utilities/citation';

export default function CitationGenerator() {
  const [type, setType] = useState<SourceType>('book');
  const [style, setStyle] = useState<CitationStyle>('apa');
  const [author, setAuthor] = useState('');
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [publisher, setPublisher] = useState('');
  const [url, setUrl] = useState('');

  const citation = generateCitation(author, title, year, publisher, url, style, type);
  const formattedCitation = citation.replace(/\*(.*?)\*/g, '<em>$1</em>');

  return (
    <div className="rounded-xl border border-ink/10 bg-card p-6 dark:border-ink/20">
      <div className="flex flex-wrap gap-2">
        <button onClick={() => setType('book')} aria-pressed={type === 'book'} className={'cat-btn ' + (type === 'book' ? 'is-active' : '')}>Book</button>
        <button onClick={() => setType('website')} aria-pressed={type === 'website'} className={'cat-btn ' + (type === 'website' ? 'is-active' : '')}>Website</button>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        <button onClick={() => setStyle('apa')} aria-pressed={style === 'apa'} className={'cat-btn ' + (style === 'apa' ? 'is-active' : '')}>APA</button>
        <button onClick={() => setStyle('mla')} aria-pressed={style === 'mla'} className={'cat-btn ' + (style === 'mla' ? 'is-active' : '')}>MLA</button>
        <button onClick={() => setStyle('chicago')} aria-pressed={style === 'chicago'} className={'cat-btn ' + (style === 'chicago' ? 'is-active' : '')}>Chicago</button>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div><label className="mb-1 block text-sm font-medium">Author(s)</label><input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="field" placeholder="Smith, J." /></div>
        <div><label className="mb-1 block text-sm font-medium">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="field" /></div>
        <div><label className="mb-1 block text-sm font-medium">Year</label><input type="text" value={year} onChange={(e) => setYear(e.target.value)} className="field" /></div>
        <div><label className="mb-1 block text-sm font-medium">Publisher / Site Name</label><input type="text" value={publisher} onChange={(e) => setPublisher(e.target.value)} className="field" /></div>
        {type === 'website' && (
          <div className="sm:col-span-2"><label className="mb-1 block text-sm font-medium">URL</label><input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className="field" /></div>
        )}
      </div>

      {author && title ? (
        <div className="mt-6">
          <div className="rounded-xl border border-ink/10 bg-card p-6 text-center dark:border-ink/20">
            <p className="text-sm text-soft">Your Citation</p>
            <p className="mt-2 text-left font-mono text-lg text-ink dark:text-paper" dangerouslySetInnerHTML={{ __html: formattedCitation }} />
          </div>
        </div>
      ) : (
        <p className="mt-6 text-sm text-soft">Enter an author and title to generate your citation.</p>
      )}
    </div>
  );
}
