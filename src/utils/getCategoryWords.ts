import type { GameWord } from '../types/game';

export function getCategoryWords(words: readonly GameWord[], categoryId: string): GameWord[] {
  return words.filter((word) => word.categoryId === categoryId);
}
