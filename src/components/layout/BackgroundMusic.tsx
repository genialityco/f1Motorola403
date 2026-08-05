"use client";

import { useEffect, useRef } from 'react';

type BackgroundMusicProps = {
  src: string;
  volume?: number;
};

// Música de fondo global: suena desde que se abre la plataforma y se mantiene en
// loop en todas las pantallas. Si el navegador bloquea el autoplay con sonido,
// reintenta en la primera interacción del usuario (click/tecla/toque).
export function BackgroundMusic({ src, volume = 0.35 }: BackgroundMusicProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;

    if (!audio) {
      return;
    }

    audio.volume = volume;

    const tryPlay = () => audio.play();

    const unlock = () => {
      void tryPlay().then(removeUnlockListeners).catch(() => {
        // Sigue bloqueado; se reintentará en la próxima interacción.
      });
    };

    const removeUnlockListeners = () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };

    void tryPlay().catch(() => {
      // Autoplay bloqueado: esperamos el primer gesto del usuario.
      window.addEventListener('pointerdown', unlock);
      window.addEventListener('keydown', unlock);
      window.addEventListener('touchstart', unlock);
    });

    return () => {
      removeUnlockListeners();
      audio.pause();
    };
  }, [volume]);

  return <audio ref={audioRef} src={src} loop preload="auto" aria-hidden="true" />;
}
