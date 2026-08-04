import { describe, expect, it } from 'vitest';

import { formatTime } from './formatTime';

describe('formatTime', () => {
  it('formats 15 seconds as 15.000', () => {
    expect(formatTime(15000)).toBe('15.000');
  });

  it('formats milliseconds with leading zero seconds', () => {
    expect(formatTime(1256)).toBe('01.256');
  });

  it('clamps values below zero', () => {
    expect(formatTime(-10)).toBe('00.000');
  });
});
