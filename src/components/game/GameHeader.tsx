import type { Category, TimerConfig } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';
import { CountdownTimer } from './CountdownTimer';

type GameHeaderProps = {
  category: Category;
  timer: TimerConfig;
  remainingMilliseconds: number;
  targetWordsCount: number;
  foundWordsCount: number;
};

export function GameHeader({ category, timer, remainingMilliseconds, targetWordsCount, foundWordsCount }: GameHeaderProps) {
  return (
    <div className="game-header">
      <section className="game-header__card panel" aria-label={`Categoría seleccionada: ${category.name}`}>
        <div className="game-header__category-image">
          <MediaAsset src={category.gameImage} alt={category.gameImageAlt} sizes="96px" objectFit="contain" />
        </div>

        <div className="game-header__category-copy">
          <p className="game-header__eyebrow">Categoría</p>
          <h2 className="game-header__title">{category.name}</h2>
          <div className="game-header__meta">
            <span className="game-header__color-dot" style={{ backgroundColor: category.color }} aria-hidden="true" />
            <span>
              {foundWordsCount} de {targetWordsCount} palabras encontradas
            </span>
          </div>
        </div>
      </section>

      <CountdownTimer timer={timer} remainingMilliseconds={remainingMilliseconds} />
    </div>
  );
}
