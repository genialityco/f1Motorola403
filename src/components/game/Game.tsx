"use client";

import { useMemo } from 'react';

import gameData from '../../data/game-data.json';
import { useGameState } from '../../hooks/useGameState';
import type { GameData, ResultType } from '../../types/game';
import { getCategoryWords } from '../../utils/getCategoryWords';

import { BackgroundMusic } from '../layout/BackgroundMusic';
import { GameLayout } from '../layout/GameLayout';
import { GameScreen } from './GameScreen';
import { ResultModal } from './ResultModal';
import { StartScreen } from './StartScreen';

const config = gameData as GameData;

export function Game() {
  const {
    screen,
    selectedCategoryId,
    selectedWordIds,
    result,
    finalRemainingMilliseconds,
    roundKey,
    validationMessage,
    setValidationMessage,
    selectCategory,
    beginGame,
    registerFoundWord,
    finishGame,
    resetGame,
    setFinalRemainingMilliseconds
  } = useGameState();

  const selectedCategory = useMemo(
    () => config.categories.find((category) => category.id === selectedCategoryId) ?? null,
    [selectedCategoryId]
  );

  const targetWords = useMemo(() => (selectedCategory ? getCategoryWords(config.words, selectedCategory.id) : []), [selectedCategory]);

  const handleStart = () => {
    if (!selectedCategoryId) {
      return;
    }

    const targetWordsForCategory = getCategoryWords(config.words, selectedCategoryId);

    if (targetWordsForCategory.length === 0) {
      setValidationMessage(`La categoría "${selectedCategory?.name ?? selectedCategoryId}" no tiene palabras configuradas.`);
      return;
    }

    beginGame();
  };

  const handleFinish = (nextResult: ResultType, remainingMilliseconds: number) => {
    setFinalRemainingMilliseconds(remainingMilliseconds);
    finishGame(nextResult);
  };

  return (
    <GameLayout config={config}>
      <BackgroundMusic src="/assets/videos/F1_Opening_Titles.mp3.mpeg" />

      {screen === 'start' ? (
        <StartScreen
          intro={config.intro}
          categories={config.categories}
          selectedCategoryId={selectedCategoryId}
          startButton={config.startButton}
          validationMessage={validationMessage}
          onCategoryChange={selectCategory}
          onStart={handleStart}
        />
      ) : null}

      {screen === 'playing' && selectedCategory ? (
        <GameScreen
          config={config}
          category={selectedCategory}
          selectedWordIds={selectedWordIds}
          gameKey={roundKey}
          onFoundWord={registerFoundWord}
          onFinish={handleFinish}
          onInvalidConfig={setValidationMessage}
        />
      ) : null}

      {screen === 'finished' && result && selectedCategory ? (
        <ResultModal
          resultType={result}
          category={selectedCategory}
          resultConfig={config.result}
          foundWordsCount={selectedWordIds.filter((wordId) => targetWords.some((word) => word.id === wordId)).length}
          targetWordsCount={targetWords.length}
          remainingMilliseconds={finalRemainingMilliseconds}
          onPlayAgain={resetGame}
        />
      ) : null}
    </GameLayout>
  );
}
