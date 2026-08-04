import type { LayoutConfig } from '../../types/game';

import { MediaAsset } from './MediaAsset';

type VideoBackgroundProps = {
  layout: LayoutConfig;
};

export function VideoBackground({ layout }: VideoBackgroundProps) {
  return (
    <div className="video-background" aria-hidden="true">
      <div className="video-background__fallback" />

      <div className="media-asset">
        <MediaAsset src={layout.backgroundVideo} alt="Fondo animado decorativo" sizes="100vw" />
      </div>
    </div>
  );
}
