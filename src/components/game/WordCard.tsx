"use client";

import type { CSSProperties, Ref } from 'react';

import type { GameWord } from '../../types/game';

type WordCardProps = {
  word: GameWord;
  found: boolean;
  wrong: boolean;
  categoryColor: string;
  foundImage: string;
  width: number;
  cardRef: Ref<HTMLButtonElement>;
  onSelect: (word: GameWord) => void;
};

export function WordCard({ word, found, wrong, categoryColor, foundImage, width, cardRef, onSelect }: WordCardProps) {
  // Al acertar, la casilla se rellena con la imagen de la categoría; el color dinámico
  // solo se usa para el borde/resplandor de "acertada" (no expresable con clases estáticas).
  const foundSurfaceStyle: CSSProperties | undefined = found
    ? {
        borderColor: `color-mix(in srgb, ${categoryColor} 78%, white 22%)`,
        boxShadow: `0 12px 30px color-mix(in srgb, ${categoryColor} 55%, transparent)`
      }
    : undefined;

  return (
    <button
      ref={cardRef}
      type="button"
      // Proporción del banner (~4.11:1); el alto se deriva del ancho vía aspect-ratio.
      // La posición (transform: translate3d) la escribe el bucle de física en WordGrid.
      className="group absolute left-0 top-0 aspect-[7104/1728] cursor-pointer touch-manipulation select-none border-0 bg-transparent p-0 font-extrabold tracking-wide will-change-transform disabled:cursor-default"
      style={{ width: `${width}px` }}
      aria-pressed={found}
      aria-label={word.name}
      disabled={found}
      // En táctil/pen seleccionamos en el "down": el objetivo se mueve, y un click
      // se cancela si la casilla se desplaza bajo el dedo. Con ratón/teclado usamos click.
      onPointerDown={(event) => {
        if (event.pointerType !== 'mouse') {
          onSelect(word);
        }
      }}
      onClick={() => onSelect(word)}
    >
      <span
        className={[
          'relative flex h-full w-full items-center overflow-hidden rounded-[18px] border text-[0.95rem] leading-tight text-white transition-transform duration-200 group-hover:scale-[1.05] group-active:scale-95',
          found ? 'justify-start pl-3 pr-2' : 'justify-center px-3',
          wrong
            ? 'animate-[shake_0.32s_ease-in-out] border-red-400/80 bg-gradient-to-b from-red-900/90 to-red-950/95'
            : found
              ? 'border-white/20 bg-slate-900'
              : 'border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-800/90'
        ].join(' ')}
        style={foundSurfaceStyle}
      >
        {found ? (
          <>
            {/* Como la casilla tiene la proporción del banner, `cover` lo muestra
                COMPLETO, llenando el ancho, sin recortar ni deformar. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url("${encodeURI(foundImage)}")` }}
            />
            {/* Contraste solo a la izquierda (para el texto); la cámara de la derecha queda visible. */}
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent"
            />
          </>
        ) : null}

        <span className="relative z-[1] whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">{word.name}</span>
      </span>
    </button>
  );
}
