import { describe, expect, it } from 'vitest';

import { addUniqueWordId, createInitialGameState, getFoundTargetWordsCount, getMissingTargetWordsCount, hasFoundAllTargetWords } from './gameHelpers';
import type { GameWord } from '../types/game';

describe('gameHelpers', () => {
  const targetWords: GameWord[] = [
    { id: '1', name: 'UNO', categoryId: 'tech' },
    { id: '2', name: 'DOS', categoryId: 'tech' }
  ];

  it('avoids duplicate selected ids', () => {
    expect(addUniqueWordId(['1'], '1')).toEqual(['1']);
    expect(addUniqueWordId(['1'], '2')).toEqual(['1', '2']);
  });

  it('detects when all target words are found', () => {
    expect(hasFoundAllTargetWords(targetWords, ['1'])).toBe(false);
    expect(hasFoundAllTargetWords(targetWords, ['1', '2'])).toBe(true);
  });

  it('counts found and missing target words', () => {
    expect(getFoundTargetWordsCount(targetWords, ['1'])).toBe(1);
    expect(getMissingTargetWordsCount(targetWords, ['1'])).toBe(1);
  });

  it('returns the initial game state', () => {
    expect(createInitialGameState()).toEqual({
      screen: 'start',
      selectedCategoryId: null,
      selectedWordIds: [],
      result: null
    });
  });
});
