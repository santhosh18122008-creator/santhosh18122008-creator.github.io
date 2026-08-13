export interface TextStats {
  characters: number;
  charactersWithoutSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  readingTimeSeconds: number;
}

const WORDS_PER_MINUTE = 200;

export function analyzeText(text: string): TextStats {
  const trimmed = text.trim();

  const characters = text.length;
  const charactersWithoutSpaces = text.replace(/\s/g, '').length;
  const words = (trimmed.match(/\S+/g) ?? []).length;

  const sentenceEnds = (trimmed.match(/[.!?…]+/g) ?? []).length;
  const hasTrailingFragment = trimmed.length > 0 && !/[.!?…]$/.test(trimmed);
  const sentences = sentenceEnds + (hasTrailingFragment ? 1 : 0);

  const paragraphs = trimmed.length === 0
    ? 0
    : trimmed.split(/\n+/).filter((p) => p.trim().length > 0).length;

  const readingTimeSeconds = words === 0
    ? 0
    : Math.max(1, Math.round((words / WORDS_PER_MINUTE) * 60));

  return {
    characters,
    charactersWithoutSpaces,
    words,
    sentences,
    paragraphs,
    readingTimeSeconds,
  };
}
