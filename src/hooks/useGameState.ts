import { useCallback, useState } from 'react';

import type { GameScreen, ResultType } from '../types/game';

export function useGameState() {
  const [screen, setScreen] = useState<GameScreen>('start');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [selectedWordIds, setSelectedWordIds] = useState<string[]>([]);
  const [result, setResult] = useState<ResultType | null>(null);
  const [finalRemainingMilliseconds, setFinalRemainingMilliseconds] = useState<number | null>(null);
  const [roundKey, setRoundKey] = useState(0);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const beginGame = useCallback(() => {
    if (!selectedCategoryId) {
      return false;
    }

    setScreen('playing');
    setSelectedWordIds([]);
    setResult(null);
    setFinalRemainingMilliseconds(null);
    setValidationMessage(null);
    setRoundKey((current) => current + 1);

    return true;
  }, [selectedCategoryId]);

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
    setValidationMessage(null);
  }, []);

  const registerFoundWord = useCallback((wordId: string) => {
    setSelectedWordIds((current) => (current.includes(wordId) ? current : [...current, wordId]));
  }, []);

  const finishGame = useCallback((nextResult: ResultType) => {
    setResult(nextResult);
    setScreen('finished');
  }, []);

  const setFinalTime = useCallback((milliseconds: number | null) => {
    setFinalRemainingMilliseconds(milliseconds);
  }, []);

  const resetGame = useCallback(() => {
    setScreen('start');
    setSelectedCategoryId(null);
    setSelectedWordIds([]);
    setResult(null);
    setFinalRemainingMilliseconds(null);
    setValidationMessage(null);
    setRoundKey((current) => current + 1);
  }, []);

  return {
    screen,
    selectedCategoryId,
    selectedWordIds,
    result,
    finalRemainingMilliseconds,
    roundKey,
    validationMessage,
    setValidationMessage,
    setFinalRemainingMilliseconds: setFinalTime,
    setSelectedWordIds,
    selectCategory,
    beginGame,
    registerFoundWord,
    finishGame,
    resetGame
  };
}
