import type { Category, TimerConfig } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';
import { CountdownTimer } from './CountdownTimer';

type GameHeaderProps = {
  category: Category;
  timer: TimerConfig;
  remainingMilliseconds: number;
};

export function GameHeader({ category, timer, remainingMilliseconds }: GameHeaderProps) {
  return (
    <div className="game-header">
      {/* Réplica compacta de la card de categoría: banner como fondo (cover) con el
          nombre superpuesto encima de la imagen, igual que en la pantalla de inicio. */}
      <section className="game-header__card panel" aria-label={`Categoría: ${category.name}`}>
        <span className="game-header__card-media" aria-hidden="true">
          <MediaAsset src={category.gameImage} alt={category.gameImageAlt} sizes="360px" objectFit="cover" />
        </span>

        <span className="game-header__card-name">{category.name}</span>
      </section>

      <CountdownTimer timer={timer} remainingMilliseconds={remainingMilliseconds} />
    </div>
  );
}
