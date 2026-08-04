import { describe, expect, it } from 'vitest';

import { shuffleArray } from './shuffleArray';

describe('shuffleArray', () => {
  it('does not mutate the original array', () => {
    const original = [1, 2, 3, 4];

    const shuffled = shuffleArray(original, () => 0.1);

    expect(shuffled).not.toBe(original);
    expect(original).toEqual([1, 2, 3, 4]);
  });
});
