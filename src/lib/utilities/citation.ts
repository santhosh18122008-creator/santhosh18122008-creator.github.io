export type CitationStyle = 'apa' | 'mla' | 'chicago';
export type SourceType = 'book' | 'website';

export function generateCitation(
  author: string, title: string, year: string, publisher: string, url: string,
  style: CitationStyle, type: SourceType
): string {
  const a = author.trim();
  const t = title.trim();
  const y = year.trim();
  const p = publisher.trim();
  const u = url.trim();

  if (style === 'apa') {
    if (type === 'book') return `${a} (${y}). *${t}*. ${p}.`;
    return `${a} (${y}). *${t}*. ${p}. ${u}`;
  }
  if (style === 'mla') {
    if (type === 'book') return `${a}. *${t}*. ${p}, ${y}.`;
    return `${a}. "${t}." *${p}*, ${y}, ${u}.`;
  }
  if (style === 'chicago') {
    if (type === 'book') return `${a}. *${t}*. ${p}, ${y}.`;
    return `${a}. "${t}." ${p}. ${y}. ${u}.`;
  }
  return '';
}
