"use client";

import type { StartButtonConfig } from '../../types/game';

import { MediaAsset } from '../layout/MediaAsset';

type StartButtonProps = {
  config: StartButtonConfig;
  disabled: boolean;
  onStart: () => void;
};

export function StartButton({ config, disabled, onStart }: StartButtonProps) {
  return (
    <button type="button" className="start-button" disabled={disabled} onClick={onStart} aria-disabled={disabled}>
      <span className="start-button__media" aria-hidden="true">
        <MediaAsset
          src={disabled ? config.disabledMedia : config.activeMedia}
          alt={disabled ? config.disabledMediaAlt : config.activeMediaAlt}
          sizes="(max-width: 720px) 100vw, 320px"
        />
      </span>

      <span className="start-button__text">{config.text}</span>
    </button>
  );
}
