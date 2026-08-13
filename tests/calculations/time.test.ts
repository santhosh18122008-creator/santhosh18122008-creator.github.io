import { describe, it, expect } from 'vitest';
import { formatTime } from '../../src/lib/calculations/time';

describe('formatTime', () => {
  it('formats 0 seconds', () => expect(formatTime(0)).toBe('00:00'));
  it('formats 59 seconds', () => expect(formatTime(59)).toBe('00:59'));
  it('formats 60 seconds', () => expect(formatTime(60)).toBe('01:00'));
  it('formats 3661 seconds (1h 1m 1s)', () => expect(formatTime(3661)).toBe('01:01:01'));
  it('handles negative numbers', () => expect(formatTime(-10)).toBe('00:00'));
  it('handles NaN', () => expect(formatTime(NaN)).toBe('00:00'));
});
