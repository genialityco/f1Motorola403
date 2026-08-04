import type { GameStateSnapshot, GameWord, ResultType } from '../types/game';

export function addUniqueWordId(selectedWordIds: readonly string[], wordId: string): string[] {
  if (selectedWordIds.includes(wordId)) {
    return [...selectedWordIds];
  }

  return [...selectedWordIds, wordId];
}

export function hasFoundAllTargetWords(targetWords: readonly GameWord[], selectedWordIds: readonly string[]): boolean {
  if (targetWords.length === 0) {
    return false;
  }

  return targetWords.every((word) => selectedWordIds.includes(word.id));
}

export function createInitialGameState(): GameStateSnapshot {
  return {
    screen: 'start',
    selectedCategoryId: null,
    selectedWordIds: [],
    result: null
  };
}

export function getMissingTargetWordsCount(targetWords: readonly GameWord[], selectedWordIds: readonly string[]): number {
  return targetWords.filter((word) => !selectedWordIds.includes(word.id)).length;
}

export function getFoundTargetWordsCount(targetWords: readonly GameWord[], selectedWordIds: readonly string[]): number {
  return targetWords.filter((word) => selectedWordIds.includes(word.id)).length;
}

export function buildResultSnapshot(result: ResultType): ResultType {
  return result;
}
