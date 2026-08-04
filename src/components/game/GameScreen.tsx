"use client";

import { useEffect, useMemo, useRef, useState } from 'react';

import type { Category, GameData, GameWord, ResultType } from '../../types/game';
import { getCategoryWords } from '../../utils/getCategoryWords';
import { hasFoundAllTargetWords } from '../../utils/gameHelpers';

import { useCountdown } from '../../hooks/useCountdown';
import { GameHeader } from './GameHeader';
import { WordGrid } from './WordGrid';

type GameScreenProps = {
  config: GameData;
  category: Category;
  selectedWordIds: string[];
  gameKey: number;
  onFoundWord: (wordId: string) => void;
  onFinish: (result: ResultType, remainingMilliseconds: number) => void;
  onInvalidConfig?: (message: string) => void;
};

export function GameScreen({
  config,
  category,
  selectedWordIds,
  gameKey,
  onFoundWord,
  onFinish,
  onInvalidConfig
}: GameScreenProps) {
  const [wrongWordId, setWrongWordId] = useState<string | null>(null);
  const wrongTimeoutRef = useRef<number | null>(null);
  const completedRef = useRef(false);

  const targetWords = useMemo(() => getCategoryWords(config.words, category.id), [config.words, category.id]);
  const wordsById = useMemo(() => new Map(config.words.map((word) => [word.id, word])), [config.words]);
  const foundWordItems = useMemo(
    () => selectedWordIds.map((wordId) => wordsById.get(wordId)).filter((word): word is GameWord => Boolean(word)),
    [selectedWordIds, wordsById]
  );
  const targetWordIds = useMemo(() => targetWords.map((word) => word.id), [targetWords]);
  const foundWordsCount = selectedWordIds.filter((id) => targetWordIds.includes(id)).length;
  const remainingTargetCount = Math.max(0, targetWords.length - foundWordsCount);

  const { remainingMilliseconds, deadlineRef, start, stop } = useCountdown({
    durationMilliseconds: config.timer.durationMilliseconds,
    onExpire: () => {
      if (completedRef.current) {
        return;
      }

      completedRef.current = true;
      onFinish('timeout', 0);
    }
  });

  useEffect(() => {
    if (targetWords.length === 0) {
      const message = `La categoría "${category.name}" no tiene palabras configuradas.`;

      if (process.env.NODE_ENV !== 'production') {
        onInvalidConfig?.(message);
      }

      return;
    }

    completedRef.current = false;
    start();

    return () => {
      stop();

      if (wrongTimeoutRef.current !== null) {
        window.clearTimeout(wrongTimeoutRef.current);
      }
    };
  }, [category.name, onInvalidConfig, start, stop, targetWords.length]);

  const finishSuccess = (remaining: number) => {
    if (completedRef.current) {
      return;
    }

    completedRef.current = true;
    stop();
    onFinish('success', remaining);
  };

  const handleWordSelect = (word: GameWord) => {
    if (completedRef.current) {
      return;
    }

    const currentDeadline = deadlineRef.current;
    const now = window.performance.now();

    if (currentDeadline !== null && now > currentDeadline) {
      return;
    }

    if (selectedWordIds.includes(word.id)) {
      return;
    }

    if (word.categoryId !== category.id) {
      setWrongWordId(word.id);

      if (wrongTimeoutRef.current !== null) {
        window.clearTimeout(wrongTimeoutRef.current);
      }

      wrongTimeoutRef.current = window.setTimeout(() => {
        setWrongWordId(null);
      }, 320);

      return;
    }

    onFoundWord(word.id);

    const nextSelectedIds = [...selectedWordIds, word.id];

    if (hasFoundAllTargetWords(targetWords, nextSelectedIds)) {
      finishSuccess(Math.max(0, Math.floor((currentDeadline ?? now) - now)));
    }
  };

  return (
    <section className="screen-frame playing-screen">
      <GameHeader
        category={category}
        timer={config.timer}
        remainingMilliseconds={remainingMilliseconds}
        targetWordsCount={targetWords.length}
        foundWordsCount={foundWordsCount}
      />

      <div className="game-layout__section">
        <div className="game-board-layout">
          <div className="game-board-layout__main">
            <WordGrid
              words={config.words}
              selectedWordIds={selectedWordIds}
              wrongWordId={wrongWordId}
              categoryColor={category.color}
              categoryImage={category.gameImage}
              gameKey={gameKey}
              onSelectWord={handleWordSelect}
            />
          </div>

          <aside className="found-words-panel panel" aria-label="Palabras encontradas">
            <div className="found-words-panel__header">
              <p className="found-words-panel__eyebrow">Palabras encontradas</p>
              <p className="found-words-panel__count">
                {foundWordsCount} / {targetWords.length}
              </p>
            </div>

            {foundWordItems.length > 0 ? (
              <ol className="found-words-panel__list">
                {foundWordItems.map((word) => (
                  <li key={word.id} className="found-words-panel__item" style={{ borderColor: category.color }}>
                    {word.name}
                  </li>
                ))}
              </ol>
            ) : (
              <p className="found-words-panel__empty">Aún no has encontrado palabras.</p>
            )}
          </aside>
        </div>
      </div>

      {remainingTargetCount === 0 ? <span className="visually-hidden">Todas las palabras objetivo han sido encontradas.</span> : null}
    </section>
  );
}
