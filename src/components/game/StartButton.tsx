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
    <button
      type="button"
      className="start-button"
      disabled={disabled}
      onClick={onStart}
      aria-disabled={disabled}
      aria-label={config.text}
    >
      <span className="start-button__media" aria-hidden="true">
        <MediaAsset
          src={disabled ? config.disabledMedia : config.activeMedia}
          alt={disabled ? config.disabledMediaAlt : config.activeMediaAlt}
          sizes="(max-width: 720px) 100vw, 360px"
          objectFit="contain"
        />
      </span>

      {/* El texto ya viene en la imagen del botón; lo mantenemos solo para lectores de pantalla. */}
      <span className="visually-hidden">{config.text}</span>
    </button>
  );
}
