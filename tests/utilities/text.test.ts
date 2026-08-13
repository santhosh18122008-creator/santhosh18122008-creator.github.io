import { describe, it, expect } from 'vitest';
import { analyzeText } from '../../src/lib/utilities/text';

describe('analyzeText', () => {
  it('empty string returns zeros', () => {
    expect(analyzeText('')).toEqual({
      characters: 0,
      charactersWithoutSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      readingTimeSeconds: 0,
    });
  });
  it('counts simple sentence', () => {
    const stats = analyzeText('Hello world.');
    expect(stats.words).toBe(2);
    expect(stats.sentences).toBe(1);
    expect(stats.characters).toBe(12);
    expect(stats.charactersWithoutSpaces).toBe(11);
  });
  it('counts trailing fragment as a sentence', () => {
    expect(analyzeText('Hi. How are you? Fine').sentences).toBe(3);
  });
  it('counts paragraphs separated by newlines', () => {
    const stats = analyzeText('First paragraph.\n\nSecond paragraph.');
    expect(stats.paragraphs).toBe(2);
  });
  it('whitespace only = zero words', () => {
    expect(analyzeText('   \n  ').words).toBe(0);
  });
  it('estimates reading time at 200 wpm', () => {
    const stats = analyzeText(Array(200).fill('word').join(' '));
    expect(stats.readingTimeSeconds).toBe(60);
  });
});
