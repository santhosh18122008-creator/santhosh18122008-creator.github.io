import { describe, it, expect } from 'vitest';
import { calculateSgpa } from '../../src/lib/calculations/sgpa';
import { calculateNeededScore } from '../../src/lib/calculations/predictor';
import { convertCase } from '../../src/lib/utilities/caseConverter';
import { splitIntoTeams } from '../../src/lib/utilities/teamSplitter';
import { hexToRgb, rgbToHex } from '../../src/lib/utilities/color';

describe('calculateSgpa', () => {
  it('calculates 2 subjects: 4cr@9, 3cr@8 = 8.57', () => {
    const r = calculateSgpa([{ credits: 4, gradePoints: 9 }, { credits: 3, gradePoints: 8 }]);
    expect(r.value?.sgpa).toBeCloseTo(8.571, 2);
  });
  it('blocks 0 credits', () => { expect(calculateSgpa([{ credits: 0, gradePoints: 9 }]).success).toBe(false); });
  it('blocks >10 grade points', () => { expect(calculateSgpa([{ credits: 3, gradePoints: 11 }]).success).toBe(false); });
});

describe('calculateNeededScore', () => {
  it('need 92.5 to get 85 overall', () => {
    const r = calculateNeededScore(85, 80, 60, 40);
    expect(r.value?.needed).toBeCloseTo(92.5, 2);
    expect(r.value?.possible).toBe(true);
  });
  it('flags impossible if > 100', () => {
    const r = calculateNeededScore(95, 50, 80, 20);
    expect(r.value?.possible).toBe(false);
  });
  it('blocks >100 total weight', () => { expect(calculateNeededScore(80, 80, 60, 50).success).toBe(false); });
});

describe('convertCase', () => {
  it('upper', () => { expect(convertCase('hello', 'upper')).toBe('HELLO'); });
  it('lower', () => { expect(convertCase('HELLO', 'lower')).toBe('hello'); });
  it('title', () => { expect(convertCase('the quick brown fox', 'title')).toBe('The Quick Brown Fox'); });
  it('sentence', () => { expect(convertCase('hello world. how are you?', 'sentence')).toBe('Hello world. How are you?'); });
  it('alt', () => { expect(convertCase('hello', 'alt')).toBe('hElLo'); });
});

describe('splitIntoTeams', () => {
  const stubRandom = () => 0;
  it('splits 4 names into 2 teams of 2', () => {
    const r = splitIntoTeams(['A', 'B', 'C', 'D'], 2, stubRandom);
    expect(r.success).toBe(true);
    expect(r.value?.length).toBe(2);
    expect(r.value?.[0].length).toBe(2);
  });
  it('blocks more groups than names', () => { expect(splitIntoTeams(['A', 'B'], 3, stubRandom).success).toBe(false); });
  it('blocks empty names', () => { expect(splitIntoTeams(['  ', ''], 1, stubRandom).success).toBe(false); });
});

describe('color converters', () => {
  it('hex to rgb', () => { expect(hexToRgb('#2F5D8A').value).toEqual({ r: 47, g: 93, b: 138 }); });
  it('rgb to hex', () => { expect(rgbToHex(47, 93, 138).value).toBe('#2F5D8A'); });
  it('blocks invalid hex', () => { expect(hexToRgb('ZZZZZZ').success).toBe(false); });
  it('blocks rgb out of bounds', () => { expect(rgbToHex(256, 0, 0).success).toBe(false); });
});
