import type { ReactNode } from 'react';

import type { GameData } from '../../types/game';

import { Header } from './Header';
import { VideoBackground } from './VideoBackground';

type GameLayoutProps = {
  config: GameData;
  children: ReactNode;
};

export function GameLayout({ config, children }: GameLayoutProps) {
  return (
    <div className="game-shell">
      <Header header={config.layout.header} />

      <main className="game-main">
        <VideoBackground layout={config.layout} />
        <div className="game-main__overlay" style={{ background: `rgba(3, 7, 18, ${config.layout.backgroundOverlayOpacity})` }} />

        <div className="game-main__content">
          <div className="game-layout__section">{children}</div>
        </div>
      </main>
    </div>
  );
}
