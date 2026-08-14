export type CaseMode = 'upper' | 'lower' | 'title' | 'sentence' | 'alt';

export function convertCase(text: string, mode: CaseMode): string {
  if (mode === 'upper') return text.toUpperCase();
  if (mode === 'lower') return text.toLowerCase();
  if (mode === 'alt') {
    let i = 0;
    return text.replace(/[a-zA-Z]/g, (c) => {
      i++;
      return i % 2 === 0 ? c.toUpperCase() : c.toLowerCase();
    });
  }
  if (mode === 'title') {
    return text.toLowerCase().replace(/(?:^|\s|-)\w/g, (m) => m.toUpperCase());
  }
  if (mode === 'sentence') {
    return text.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
  }
  return text;
}
