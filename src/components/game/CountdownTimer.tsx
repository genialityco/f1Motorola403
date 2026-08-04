import { formatTime } from '../../utils/formatTime';
import type { TimerConfig } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';

type CountdownTimerProps = {
  timer: TimerConfig;
  remainingMilliseconds: number;
};

export function CountdownTimer({ timer, remainingMilliseconds }: CountdownTimerProps) {
  return (
    <section className="countdown-timer panel" aria-label="Cronómetro">
      <div className="countdown-timer__media">
        <MediaAsset src={timer.backgroundMedia} alt={timer.backgroundMediaAlt} sizes="(max-width: 720px) 100vw, 320px" />
      </div>

      <div className="countdown-timer__content">
        <p className="countdown-timer__caption">Tiempo restante</p>
        <div className="countdown-timer__value" aria-live="polite" aria-atomic="true">
          {formatTime(remainingMilliseconds)}
        </div>
      </div>
    </section>
  );
}
